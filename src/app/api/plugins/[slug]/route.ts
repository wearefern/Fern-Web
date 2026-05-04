import { NextResponse } from 'next/server';

import { getModelClient } from '../../shared/model-client';
import { mapDBPluginToUIPlugin } from '../plugin-mapper';
import { getPluginBySlug } from '../../../../data/plugins-data';

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const prisma = getModelClient();
    const plugin = await prisma.plugin.findUnique({
      where: { slug: params.slug },
    });

    if (!plugin) {
      const staticPlugin = getPluginBySlug(params.slug);
      if (!staticPlugin) {
        return NextResponse.json({ error: 'Plugin not found' }, { status: 404 });
      }
      return NextResponse.json(staticPlugin);
    }

    return NextResponse.json(mapDBPluginToUIPlugin(plugin));
  } catch (error) {
    console.error('Failed to load plugin by slug from database, using static fallback', error);
    const staticPlugin = getPluginBySlug(params.slug);
    if (!staticPlugin) {
      return NextResponse.json({ error: 'Plugin not found' }, { status: 404 });
    }
    return NextResponse.json(staticPlugin);
  }
}
