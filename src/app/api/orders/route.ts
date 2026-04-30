import { NextResponse } from 'next/server';

import { getModelClient } from '../shared/model-client';
import { getCurrentUser } from '~lib/auth/get-current-user';

const centsToPrice = (value: number) => `$${(value / 100).toFixed(2)}`;

interface CreateOrderPayload {
  items?: { pluginId: string; quantity: number }[];
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getModelClient();
    const orders = await prisma.order.findMany({
      where: { userId: user.clerkId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            plugin: true,
          },
        },
      },
    });

    const mapped = orders.map((order) => ({
      id: order.id,
      date: order.createdAt.toISOString(),
      total: centsToPrice(order.totalCents),
      status: order.status,
      items: order.items.map((item) => ({
        quantity: item.quantity,
        price: centsToPrice(item.unitPriceCents * item.quantity),
        plugin: {
          id: item.plugin.id,
          name: item.plugin.name,
          slug: item.plugin.slug,
          category: item.plugin.status,
        },
      })),
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Failed to load orders', error);
    return NextResponse.json({ error: 'Unable to load orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as CreateOrderPayload | null;
    if (!body || typeof body !== 'object' || !Array.isArray(body.items)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const prisma = getModelClient();
    const inputItems = body.items as { pluginId: string; quantity: number }[];
    const pluginIds = inputItems.map((item) => String(item.pluginId));
    const plugins = await prisma.plugin.findMany({
      where: { id: { in: pluginIds } },
    });
    const pluginById = new Map(plugins.map((plugin) => [plugin.id, plugin]));

    const normalizedItems = inputItems
      .map((item) => {
        const plugin = pluginById.get(String(item.pluginId));
        if (!plugin) return null;

        const quantity = Math.max(1, Number(item.quantity || 1));
        return {
          pluginId: plugin.id,
          quantity,
          unitPriceCents: plugin.priceCents,
          lineTotal: plugin.priceCents * quantity,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    if (normalizedItems.length === 0) {
      return NextResponse.json({ error: 'No valid order items' }, { status: 400 });
    }

    const totalCents = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);

    const created = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: user.clerkId!,
          totalCents,
          status: 'completed',
        },
      });

      await tx.orderItem.createMany({
        data: normalizedItems.map((item) => ({
          orderId: order.id,
          pluginId: item.pluginId,
          quantity: item.quantity,
          unitPriceCents: item.unitPriceCents,
        })),
      });

      for (const item of normalizedItems) {
        await tx.purchase.upsert({
          where: {
            userId_pluginId: {
              userId: user.clerkId!,
              pluginId: item.pluginId,
            },
          },
          update: {
            orderId: order.id,
          },
          create: {
            userId: user.clerkId!,
            pluginId: item.pluginId,
            orderId: order.id,
          },
        });
      }

      return order;
    });

    return NextResponse.json({
      id: created.id,
      total: centsToPrice(created.totalCents),
      status: created.status,
    });
  } catch (error) {
    console.error('Failed to create order', error);
    return NextResponse.json({ error: 'Unable to create order' }, { status: 500 });
  }
}
