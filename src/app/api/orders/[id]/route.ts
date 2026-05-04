import { NextResponse } from 'next/server';

import { getModelClient } from '../../shared/model-client';
import { getCurrentUser } from '~lib/auth/get-current-user';

const centsToPrice = (value: number) => `$${(value / 100).toFixed(2)}`;

interface Params {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user?.clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getModelClient();
    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        userId: user.clerkId,
      },
      include: {
        items: {
          include: {
            plugin: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('Failed to load order by id', error);
    return NextResponse.json({ error: 'Unable to load order' }, { status: 500 });
  }
}
