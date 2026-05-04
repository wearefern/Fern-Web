import { NextRequest, NextResponse } from 'next/server';

import { getModelClient } from '../../shared/model-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const prisma = getModelClient();
    const downloadToken = await prisma.downloadToken.findUnique({
      where: { token },
      include: {
        purchase: {
          include: {
            plugin: true,
          },
        },
      },
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

    // Mark token as used
    await prisma.downloadToken.update({
      where: { id: downloadToken.id },
      data: { usedAt: new Date() },
    });

    // For now, redirect to a placeholder file
    // In production, this would be a signed URL to R2/S3
    const fileUrl = `/downloads/${downloadToken.purchase.plugin.slug}.zip`;

    return NextResponse.redirect(new URL(fileUrl, request.url));
  } catch (error) {
    console.error('Failed to process download', error);
    return NextResponse.json({ error: 'Unable to process download' }, { status: 500 });
  }
}