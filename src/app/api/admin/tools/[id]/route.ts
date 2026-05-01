import { NextResponse } from 'next/server';

import { getModelClient } from '../../../shared/model-client';
import { requireAdmin, AdminAccessError } from '~lib/auth/require-admin';

interface Params {
  params: {
    id: string;
  };
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!payload) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const prisma = getModelClient();
    const updated = await prisma.tool.update({
      where: { id: params.id },
      data: {
        ...(payload.name !== undefined ? { name: String(payload.name) } : {}),
        ...(payload.slug !== undefined ? { slug: String(payload.slug) } : {}),
        ...(payload.description !== undefined ? { description: payload.description ? String(payload.description) : null } : {}),
        ...(payload.longDescription !== undefined ? { longDescription: payload.longDescription ? String(payload.longDescription) : null } : {}),
        ...(payload.priceCents !== undefined ? { priceCents: Number(payload.priceCents) } : {}),
        ...(payload.status !== undefined ? { status: String(payload.status) } : {}),
        ...(payload.category !== undefined ? { category: payload.category ? String(payload.category) : null } : {}),
        ...(payload.previewImageUrl !== undefined ? { previewImageUrl: payload.previewImageUrl ? String(payload.previewImageUrl) : null } : {}),
        ...(payload.fileKey !== undefined ? { fileKey: payload.fileKey ? String(payload.fileKey) : null } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Unable to update tool' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const prisma = getModelClient();
    await prisma.tool.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Unable to delete tool' }, { status: 500 });
  }
}
