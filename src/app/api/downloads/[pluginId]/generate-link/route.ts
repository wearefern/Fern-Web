import crypto from 'crypto';
import { NextResponse } from 'next/server';

import { getModelClient } from '../../../shared/model-client';
import { getCurrentUser } from '~lib/auth/get-current-user';

interface Params {
  params: {
    pluginId: string;
  };
}

export async function POST(_request: Request, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user?.clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getModelClient();
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_pluginId: {
          userId: user.clerkId,
          pluginId: params.pluginId,
        },
      },
    });

    if (!purchase) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const downloadToken = await prisma.downloadToken.create({
      data: {
        purchaseId: purchase.id,
        token,
        expiresAt,
      },
    });

    return NextResponse.json({
      token: downloadToken.token,
      expiresAt: downloadToken.expiresAt.toISOString(),
      url: `/api/downloads/placeholder/${downloadToken.token}`,
    });
  } catch (error) {
    console.error('Failed to generate download token', error);
    return NextResponse.json({ error: 'Unable to generate download link' }, { status: 500 });
  }
}
