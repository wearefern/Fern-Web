import { NextResponse } from 'next/server';

import { getModelClient } from '../../shared/model-client';
import { mapDBPluginToUIPlugin } from '../plugin-mapper';

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
      return NextResponse.json({ error: 'Plugin not found' }, { status: 404 });
    }

    return NextResponse.json(mapDBPluginToUIPlugin(plugin));
  } catch (error) {
    console.error('Failed to load plugin by slug', error);
    return NextResponse.json(
      { error: 'Unable to load plugin' },
      { status: 500 }
    );
  }
}
