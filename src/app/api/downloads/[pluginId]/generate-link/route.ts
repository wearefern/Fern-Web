import crypto from 'crypto';
import { NextResponse } from 'next/server';

import { getModelClient } from '../../../shared/model-client';
import { getCurrentUser } from '~lib/auth/get-current-user';

interface Params {
  params: {
    pluginId: string;
  };
}

export async function POST(request: Request, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user?.clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as { platform?: unknown } | null;
    const platform = body?.platform;
    if (platform !== 'MAC' && platform !== 'WINDOWS') {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
    }

    const prisma = getModelClient();
    const paidOrder = await prisma.order.findFirst({
      where: {
        userId: user.clerkId,
        status: 'PAID',
        items: {
          some: {
            pluginId: params.pluginId,
          },
        },
      },
      include: {
        items: {
          where: { pluginId: params.pluginId },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_pluginId: {
          userId: user.clerkId,
          pluginId: params.pluginId,
        },
      },
      include: {
        plugin: true,
      },
    });

    if (!paidOrder && !purchase) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const plugin = purchase?.plugin
      ?? (await prisma.plugin.findUnique({ where: { id: params.pluginId } }));
    if (!plugin) {
      return NextResponse.json({ error: 'Plugin not found' }, { status: 404 });
    }

    const resolvedPurchase = purchase
      ?? await prisma.purchase.upsert({
        where: {
          userId_pluginId: {
            userId: user.clerkId,
            pluginId: params.pluginId,
          },
        },
        update: {
          orderId: paidOrder?.id ?? null,
        },
        create: {
          userId: user.clerkId,
          pluginId: params.pluginId,
          orderId: paidOrder?.id ?? null,
        },
      });

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const downloadToken = await prisma.downloadToken.create({
      data: {
        purchaseId: resolvedPurchase.id,
        token,
        expiresAt,
      },
    });

    return NextResponse.json({
      url: `/api/downloads/file?token=${downloadToken.token}`,
    });
  } catch (error) {
    console.error('Failed to generate download token', error);
    return NextResponse.json({ error: 'Unable to generate download link' }, { status: 500 });
  }
}
