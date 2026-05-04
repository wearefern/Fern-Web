import { NextResponse } from 'next/server';

import { getModelClient } from '../../shared/model-client';
import { requireAdmin, AdminAccessError } from '~lib/auth/require-admin';

export async function GET() {
  try {
    await requireAdmin();
    const prisma = getModelClient();
    const tools = await prisma.tool.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json(tools);
  } catch (error) {
    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Unable to load tools' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!payload) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const prisma = getModelClient();
    const created = await prisma.tool.create({
      data: {
        name: String(payload.name ?? ''),
        slug: String(payload.slug ?? ''),
        description: payload.description ? String(payload.description) : null,
        longDescription: payload.longDescription ? String(payload.longDescription) : null,
        priceCents: Number(payload.priceCents ?? 0),
        status: String(payload.status ?? 'active'),
        category: payload.category ? String(payload.category) : null,
        previewImageUrl: payload.previewImageUrl ? String(payload.previewImageUrl) : null,
        fileKey: payload.fileKey ? String(payload.fileKey) : null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Unable to create tool' }, { status: 500 });
  }
}
