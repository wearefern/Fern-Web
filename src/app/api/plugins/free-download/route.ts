import { NextResponse } from 'next/server';

import { getModelClient } from '../../shared/model-client';
import { getCurrentUser } from '~lib/auth/get-current-user';

interface FreeDownloadPayload {
  pluginId?: unknown;
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as FreeDownloadPayload | null;
    const pluginId = String(body?.pluginId ?? '');
    if (!pluginId) {
      return NextResponse.json({ error: 'pluginId is required' }, { status: 400 });
    }

    const prisma = getModelClient();
    const plugin = await prisma.plugin.findUnique({ where: { id: pluginId } });
    if (!plugin) {
      return NextResponse.json({ error: 'Plugin not found' }, { status: 404 });
    }

    if (plugin.status !== 'free') {
      return NextResponse.json({ error: 'Only free plugins can be claimed' }, { status: 400 });
    }

    const purchase = await prisma.purchase.upsert({
      where: {
        userId_pluginId: {
          userId: user.clerkId,
          pluginId: plugin.id,
        },
      },
      update: {},
      create: {
        userId: user.clerkId,
        pluginId: plugin.id,
      },
    });

    return NextResponse.json({ purchase, plugin });
  } catch (error) {
    console.error('Failed to claim free plugin', error);
    return NextResponse.json({ error: 'Unable to claim free plugin' }, { status: 500 });
  }
}
