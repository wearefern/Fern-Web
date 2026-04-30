import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

import { getModelClient } from '../../shared/model-client';

export async function GET() {
  const user = await currentUser();
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const prisma = getModelClient();
  const preferences = await prisma.userPreference.findUnique({
    where: { userId: user.id },
  });

  return NextResponse.json(
    preferences ?? {
      orderConfirmations: true,
      downloadUpdates: false,
      productAnnouncements: false,
      marketingEmails: false,
    }
  );
}

export async function PATCH(request: Request) {
  const user = await currentUser();
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const preferences = {
    orderConfirmations: Boolean(body.orderConfirmations),
    downloadUpdates: Boolean(body.downloadUpdates),
    productAnnouncements: Boolean(body.productAnnouncements),
    marketingEmails: Boolean(body.marketingEmails),
  };

  const prisma = getModelClient();

  const result = await prisma.userPreference.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      ...preferences,
    },
    update: preferences,
  });

  return NextResponse.json(result);
}
