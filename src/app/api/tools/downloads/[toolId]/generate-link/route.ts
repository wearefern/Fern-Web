import crypto from 'crypto';
import { NextResponse } from 'next/server';

import { getModelClient } from '../../../../shared/model-client';
import { getCurrentUser } from '~lib/auth/get-current-user';

interface Params {
  params: {
    toolId: string;
  };
}

export async function POST(request: Request, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user?.clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getModelClient();
    const order = await prisma.toolOrder.findFirst({
      where: {
        userId: user.clerkId,
        toolId: params.toolId,
        status: 'paid',
      },
      include: { tool: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!order.tool.fileKey) {
      return NextResponse.json({ error: 'File is not available for this tool' }, { status: 400 });
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.toolDownloadToken.create({
      data: {
        toolId: order.tool.id,
        userId: user.clerkId,
        token,
        expiresAt,
      },
    });

    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      null;

    await prisma.toolDownload.create({
      data: {
        userId: user.clerkId,
        toolId: order.tool.id,
        ipAddress,
      },
    });

    return NextResponse.json({ url: `/api/tools/downloads/file?token=${token}` });
  } catch (error) {
    console.error('Failed to generate tool download token', error);
    return NextResponse.json({ error: 'Unable to generate download link' }, { status: 500 });
  }
}
