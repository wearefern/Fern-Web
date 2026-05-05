import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join, normalize } from 'path';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

import { getModelClient } from '../../../shared/model-client';
import { r2, R2_BUCKET } from '~lib/r2';

// Helper to normalize and validate fileKey for security
function normalizeFileKey(fileKey: string): string | null {
  if (!fileKey) return null;
  
  // Remove leading slash if present
  const normalized = fileKey.startsWith('/') ? fileKey.slice(1) : fileKey;
  
  // Ensure it starts with downloads/
  if (!normalized.startsWith('downloads/')) {
    // Support relative paths like "plugins/file.zip" or "tools/file.zip"
    if (normalized.startsWith('plugins/') || normalized.startsWith('tools/')) {
      return `downloads/${normalized}`;
    }
    return null;
  }
  
  return normalized;
}

// Security check to prevent path traversal
function isValidDownloadPath(filePath: string): boolean {
  const normalized = normalize(filePath);
  return normalized.startsWith('downloads/') && !normalized.includes('../');
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const prisma = getModelClient();
    const downloadToken = await prisma.toolDownloadToken.findUnique({
      where: { token },
      include: { tool: true },
    });

    if (!downloadToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    if (downloadToken.usedAt) {
      return NextResponse.json({ error: 'Token already used' }, { status: 403 });
    }

    if (downloadToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Token expired' }, { status: 403 });
    }

    const fileKey = downloadToken.tool.fileKey;
    if (!fileKey) {
      return NextResponse.json({ error: 'Download unavailable' }, { status: 404 });
    }

    await prisma.toolDownloadToken.update({
      where: { id: downloadToken.id },
      data: { usedAt: new Date() },
    });

    // Normalize and validate fileKey
    const normalizedFileKey = normalizeFileKey(fileKey);
    if (!normalizedFileKey) {
      console.error('Invalid fileKey format:', fileKey);
      return NextResponse.json({ error: 'Invalid file path' }, { status: 404 });
    }

    // Security check
    if (!isValidDownloadPath(normalizedFileKey)) {
      console.error('Path traversal attempt:', normalizedFileKey);
      return NextResponse.json({ error: 'Invalid file path' }, { status: 403 });
    }

    // Backward compatibility: if fileKey starts with '/downloads', serve from local disk
    if (fileKey.startsWith('/downloads/')) {
      console.warn("Using local fallback - not production safe. FileKey:", fileKey);
      try {
        // Construct full file path for local files
        const fullPath = join(process.cwd(), 'public', normalizedFileKey);
        
        // Read file from disk
        const fileBuffer = await readFile(fullPath);
        
        // Extract filename from fileKey for Content-Disposition
        const filename = normalizedFileKey.split('/').pop() || 'download.zip';
        
        // Set proper headers for ZIP download
        const headers = new Headers({
          'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': fileBuffer.length.toString(),
            'Cache-Control': 'no-cache',
        });
        
        return new NextResponse(fileBuffer, { headers });
      } catch (error) {
        console.error('File read error:', error);
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
    }

    // R2: Generate signed URL for new uploads
    try {
      const command = new GetObjectCommand({
        Bucket: R2_BUCKET,
        Key: normalizedFileKey,
      });
      
      const url = await getSignedUrl(r2, command, { expiresIn: 60 });
      
      return NextResponse.redirect(url);
    } catch (error) {
      console.error('R2 signed URL error:', error);
      return NextResponse.json({ error: 'Unable to generate download link' }, { status: 500 });
    }
  } catch (error) {
    console.error('Failed to process tool download', error);
    return NextResponse.json({ error: 'Unable to process download' }, { status: 500 });
  }
}
