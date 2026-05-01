import { NextResponse } from 'next/server';

import { getModelClient } from '../../shared/model-client';
import { getCurrentUser } from '~lib/auth/get-current-user';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as { toolId?: unknown } | null;
    const toolId = typeof body?.toolId === 'string' ? body.toolId : '';
    if (!toolId) {
      return NextResponse.json({ error: 'toolId is required' }, { status: 400 });
    }

    const prisma = getModelClient();
    const tool = await prisma.tool.findUnique({ where: { id: toolId } });

    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    if (tool.status !== 'free') {
      return NextResponse.json({ error: 'Only free tools can be claimed' }, { status: 400 });
    }

    const order = await prisma.toolOrder.upsert({
      where: {
        userId_toolId: {
          userId: user.clerkId,
          toolId: tool.id,
        },
      },
      update: {},
      create: {
        userId: user.clerkId,
        toolId: tool.id,
        amountCents: 0,
        status: 'paid',
      },
    });

    return NextResponse.json({ order, tool });
  } catch (error) {
    console.error('Failed to claim free tool', error);
    return NextResponse.json({ error: 'Unable to claim free tool' }, { status: 500 });
  }
}
