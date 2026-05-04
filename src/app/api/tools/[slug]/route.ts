import { NextResponse } from 'next/server';

import { getModelClient } from '../../shared/model-client';

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const prisma = getModelClient();
    const tool = await prisma.tool.findUnique({ where: { slug: params.slug } });

    if (!tool || tool.status === 'archived') {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    return NextResponse.json(tool);
  } catch (error) {
    console.error('Failed to load tool by slug', error);
    return NextResponse.json({ error: 'Unable to load tool' }, { status: 500 });
  }
}
