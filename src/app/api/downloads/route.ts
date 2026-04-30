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
    const purchases = await prisma.purchase.findMany({
      where: { userId: user.clerkId },
      include: {
        plugin: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      purchases.map((purchase) => ({
        id: purchase.id,
        createdAt: purchase.createdAt.toISOString(),
        plugin: purchase.plugin,
      }))
    );
  } catch (error) {
    console.error('Failed to load downloads', error);
    return NextResponse.json({ error: 'Unable to load downloads' }, { status: 500 });
  }
}
