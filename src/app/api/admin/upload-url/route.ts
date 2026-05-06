import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2, R2_BUCKET } from '~lib/r2';
import { getCurrentUser } from '~lib/auth/get-current-user';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { fileName, contentType, fileType = 'plugin' } = body as {
      fileName?: string;
      contentType?: string;
      fileType?: 'plugin' | 'tool';
    };

    if (!fileName || !contentType) {
      return NextResponse.json({ error: 'fileName and contentType are required' }, { status: 400 });
    }

    // Validate file name for security
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
    }

    // Generate file key
    const fileKey = `${fileType}s/${fileName}`;

    // Create signed PUT URL for direct browser upload to R2
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: fileKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 3600 }); // 1 hour

    return NextResponse.json({
      uploadUrl,
      fileKey,
    });
  } catch (error) {
    console.error('Failed to generate upload URL:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
