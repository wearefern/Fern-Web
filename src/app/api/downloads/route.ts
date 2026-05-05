import { NextResponse } from 'next/server';

import { getModelClient } from '../shared/model-client';
import { getCurrentUser } from '~lib/auth/get-current-user';

export const dynamic = 'force-dynamic';

interface DownloadableItem {
  id: string;
  createdAt: string;
  type: 'plugin' | 'tool';
  plugin?: unknown;
  tool?: unknown;
  fileKey?: string | null;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getModelClient();
    const items: DownloadableItem[] = [];

    // Get plugin orders and purchases
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

    const pluginMap = new Map<string, DownloadableItem>();

    paidOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!pluginMap.has(item.pluginId)) {
          pluginMap.set(item.pluginId, {
            id: `${order.id}:${item.pluginId}`,
            createdAt: order.createdAt.toISOString(),
            type: 'plugin',
            plugin: item.plugin,
            fileKey: item.plugin.fileKey,
          });
        }
      });
    });

    purchaseFallback.forEach((purchase) => {
      if (!pluginMap.has(purchase.pluginId)) {
        pluginMap.set(purchase.pluginId, {
          id: purchase.id,
          createdAt: purchase.createdAt.toISOString(),
          type: 'plugin',
          plugin: purchase.plugin,
          fileKey: purchase.plugin.fileKey,
        });
      }
    });

    items.push(...Array.from(pluginMap.values()));

    // Get tool orders
    const toolOrders = await prisma.toolOrder.findMany({
      where: {
        userId: user.clerkId,
        status: 'paid',
      },
      include: {
        tool: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    toolOrders.forEach((order) => {
      items.push({
        id: order.id,
        createdAt: order.createdAt.toISOString(),
        type: 'tool',
        tool: order.tool,
        fileKey: order.tool.fileKey,
      });
    });

    // Sort by creation date (newest first)
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to load downloads', error);
    return NextResponse.json({ error: 'Unable to load downloads' }, { status: 500 });
  }
}
