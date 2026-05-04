import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
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
    const uploadDir = join(process.cwd(), 'public', 'downloads', type + 's');
    const filepath = join(uploadDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return the relative path for storage in database
    const relativePath = `/downloads/${type}s/${filename}`;

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
