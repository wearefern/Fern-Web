import { NextResponse } from 'next/server';

import { getModelClient } from '../shared/model-client';
import { getCurrentUser } from '~lib/auth/get-current-user';
import { mapDBPluginToUIPlugin } from '~api/plugins/plugin-mapper';

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

    console.log('DOWNLOADS API USER ID:', user.clerkId);

    // Get plugin orders and purchases
    const paidOrders = await prisma.order.findMany({
      where: {
        userId: user.clerkId,
        status: 'completed',
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

    console.log('DOWNLOADS API PLUGIN ORDERS FOUND:', paidOrders.length);

    const purchaseFallback = await prisma.purchase.findMany({
      where: { userId: user.clerkId },
      include: { plugin: true },
      orderBy: { createdAt: 'desc' },
    });

    console.log('DOWNLOADS API PURCHASES FOUND:', purchaseFallback.length);

    const pluginMap = new Map<string, DownloadableItem>();

    paidOrders.forEach((order) => {
      order.items.forEach((item) => {
        const pluginId = String(item.pluginId);
        if (!pluginMap.has(pluginId)) {
          const mappedPlugin = mapDBPluginToUIPlugin(item.plugin);
          pluginMap.set(pluginId, {
            id: `${order.id}:${pluginId}`,
            createdAt: order.createdAt.toISOString(),
            type: 'plugin',
            plugin: mappedPlugin,
            fileKey: item.plugin.fileKey,
          });
        }
      });
    });

    purchaseFallback.forEach((purchase) => {
      const pluginId = String(purchase.pluginId);
      if (!pluginMap.has(pluginId)) {
        const mappedPlugin = mapDBPluginToUIPlugin(purchase.plugin);
        pluginMap.set(pluginId, {
          id: purchase.id,
          createdAt: purchase.createdAt.toISOString(),
          type: 'plugin',
          plugin: mappedPlugin,
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

    console.log('DOWNLOADS API TOTAL ITEMS:', items.length);
    console.log('DOWNLOADS API ITEMS BY TYPE:', {
      plugins: items.filter(i => i.type === 'plugin').length,
      tools: items.filter(i => i.type === 'tool').length,
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to load downloads', error);
    return NextResponse.json({ error: 'Unable to load downloads' }, { status: 500 });
  }
}
