import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

import { getModelClient } from '../../../../shared/model-client';
import { AdminAccessError, requireAdmin } from '~lib/auth/require-admin';
import { parseDemoControls } from '~modules/plugins/demo-controls';

interface Params {
  params: {
    id: string;
  };
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const body = (await request.json().catch(() => null)) as { demoControls?: unknown } | null;
    const parsed = parseDemoControls(body?.demoControls);

    if (!parsed) {
      return NextResponse.json({ error: 'Invalid demoControls payload' }, { status: 400 });
    }

    const prisma = getModelClient();
    const updated = await prisma.plugin.update({
      where: { id: params.id },
      data: {
        demoControls: parsed as unknown as Prisma.InputJsonValue,
      },
      select: {
        id: true,
        demoControls: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Unable to update demo controls' }, { status: 500 });
  }
}
