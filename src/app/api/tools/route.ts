import { NextResponse } from 'next/server';

import { getModelClient } from '../shared/model-client';

export async function GET() {
  try {
    const prisma = getModelClient();
    const tools = await prisma.tool.findMany({
      where: {
        status: {
          in: ['active', 'free', 'coming_soon'],
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(tools);
  } catch (error) {
    console.error('Failed to load tools', error);
    return NextResponse.json({ error: 'Unable to load tools' }, { status: 500 });
  }
}
