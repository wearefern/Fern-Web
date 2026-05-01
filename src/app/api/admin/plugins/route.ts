import { NextResponse } from 'next/server';

import { getModelClient } from '../../shared/model-client';
import { requireAdmin, AdminAccessError } from '~lib/auth/require-admin';
import {
  sanitizePluginCreatePayload,
  type PluginAdminPayload,
} from './utils';

export async function GET() {
  try {
    await requireAdmin();
    const prisma = getModelClient();
    const plugins = await prisma.plugin.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
    return NextResponse.json(plugins);
  } catch (error) {
    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Unable to load plugins' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const payload = (await request.json()) as PluginAdminPayload;
    const createData = sanitizePluginCreatePayload(payload);
    if (!createData) {
      return NextResponse.json({ error: 'Invalid plugin payload' }, { status: 400 });
    }
    const prisma = getModelClient();
    const created = await prisma.plugin.create({
      data: createData,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Unable to create plugin' }, { status: 500 });
  }
}
