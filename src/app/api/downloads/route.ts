import { NextResponse } from 'next/server';

import { getModelClient } from '../shared/model-client';
import { getCurrentUser } from '~lib/auth/get-current-user';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getModelClient();
    const paidOrders = await prisma.order.findMany({
      where: {
        userId: user.clerkId,
        status: 'PAID',
      },
      include: {
        items: {
          include: {
            plugin: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const purchaseFallback = await prisma.purchase.findMany({
      where: { userId: user.clerkId },
      include: { plugin: true },
      orderBy: { createdAt: 'desc' },
    });

    const pluginMap = new Map<string, { id: string; createdAt: string; plugin: unknown }>();

    paidOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!pluginMap.has(item.pluginId)) {
          pluginMap.set(item.pluginId, {
            id: `${order.id}:${item.pluginId}`,
            createdAt: order.createdAt.toISOString(),
            plugin: item.plugin,
          });
        }
      });
    });

    purchaseFallback.forEach((purchase) => {
      if (!pluginMap.has(purchase.pluginId)) {
        pluginMap.set(purchase.pluginId, {
          id: purchase.id,
          createdAt: purchase.createdAt.toISOString(),
          plugin: purchase.plugin,
        });
      }
    });

    return NextResponse.json(Array.from(pluginMap.values()));
  } catch (error) {
    console.error('Failed to load downloads', error);
    return NextResponse.json({ error: 'Unable to load downloads' }, { status: 500 });
  }
}
