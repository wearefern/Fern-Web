import { NextResponse } from 'next/server';

import { getModelClient } from '../shared/model-client';
import { mapDBPluginToUIPlugin } from './plugin-mapper';
import { getAllPlugins } from '../../../data/plugins-data';

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
    console.error('Failed to load plugins from database, using static fallback', error);
    return NextResponse.json(getAllPlugins());
  }
}
