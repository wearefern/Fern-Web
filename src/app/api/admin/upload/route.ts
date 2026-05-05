import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2, R2_BUCKET } from '~lib/r2';
import { getCurrentUser } from '~lib/auth/get-current-user';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'plugin' or 'tool'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!type || !['plugin', 'tool'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type specified' }, { status: 400 });
    }

    // Validate file type (ZIP files)
    if (!file.name.toLowerCase().endsWith('.zip')) {
      return NextResponse.json({ error: 'Only ZIP files are allowed' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const key = `${type}s/${filename}`;

    // Upload to R2
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    try {
      await r2.send(new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: 'application/zip',
      }));
    } catch (error) {
      console.error('R2 upload error:', error);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    // Return key for storage in database
    const relativePath = key;

    return NextResponse.json({ 
      success: true,
      filename,
      path: relativePath,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
