import { NextResponse } from 'next/server';

import { getModelClient } from '../shared/model-client';
import { mapDBPluginToUIPlugin } from './plugin-mapper';

export async function GET() {
  try {
    const prisma = getModelClient();
    const plugins = await prisma.plugin.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(plugins.map(mapDBPluginToUIPlugin));
  } catch (error) {
    console.error('Failed to load plugins', error);
    return NextResponse.json(
      { error: 'Unable to load plugins' },
      { status: 500 }
    );
  }
}
