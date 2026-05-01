import { NextResponse } from 'next/server';

import { getModelClient } from '../../../shared/model-client';
import { getCurrentUser } from '~lib/auth/get-current-user';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getModelClient();
    const orders = await prisma.toolOrder.findMany({
      where: { userId: user.clerkId, status: 'paid' },
      include: { tool: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      orders.map((order) => ({
        id: order.id,
        createdAt: order.createdAt.toISOString(),
        tool: order.tool,
      }))
    );
  } catch (error) {
    console.error('Failed to load tool downloads', error);
    return NextResponse.json({ error: 'Unable to load downloads' }, { status: 500 });
  }
}
