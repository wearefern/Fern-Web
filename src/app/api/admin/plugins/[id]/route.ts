import { NextResponse } from 'next/server';

import { getModelClient } from '../../../shared/model-client';
import { requireAdmin, AdminAccessError } from '~lib/auth/require-admin';
import { sanitizePluginPayload, type PluginAdminPayload } from '../utils';

interface Params {
  params: {
    id: string;
  };
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const payload = (await request.json()) as PluginAdminPayload;
    const prisma = getModelClient();
    const updated = await prisma.plugin.update({
      where: { id: params.id },
      data: sanitizePluginPayload(payload),
    });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Unable to update plugin' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const prisma = getModelClient();
    await prisma.plugin.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Unable to delete plugin' }, { status: 500 });
  }
}
