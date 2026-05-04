import { NextRequest, NextResponse } from 'next/server';

import { getModelClient } from '../../../shared/model-client';

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

    if (!downloadToken.tool.fileKey) {
      return NextResponse.json({ error: 'File unavailable' }, { status: 400 });
    }

    await prisma.toolDownloadToken.update({
      where: { id: downloadToken.id },
      data: { usedAt: new Date() },
    });

    const relativeFile = downloadToken.tool.fileKey.replace(/^tools\//, '');
    const fileUrl = `/downloads/${relativeFile}`;

    return NextResponse.redirect(new URL(fileUrl, request.url));
  } catch (error) {
    console.error('Failed to process tool download', error);
    return NextResponse.json({ error: 'Unable to process download' }, { status: 500 });
  }
}
