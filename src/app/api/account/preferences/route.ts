import { NextResponse } from 'next/server';

import { getModelClient } from '../../shared/model-client';
import { getCurrentUser } from '~lib/auth/get-current-user';

interface PreferencesPayload {
  orderConfirmations?: unknown;
  downloadUpdates?: unknown;
  productAnnouncements?: unknown;
  marketingEmails?: unknown;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getModelClient();
    const preferences = await prisma.userPreference.findUnique({
      where: { userId: user.clerkId },
    });

    return NextResponse.json(
      preferences ?? {
        orderConfirmations: true,
        downloadUpdates: false,
        productAnnouncements: false,
        marketingEmails: false,
      }
    );
  } catch (error) {
    console.error('Failed to load preferences', error);
    return NextResponse.json({ error: 'Unable to load preferences' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as PreferencesPayload | null;
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
      where: { userId: user.clerkId },
      create: {
        userId: user.clerkId,
        ...preferences,
      },
      update: preferences,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to save preferences', error);
    return NextResponse.json({ error: 'Unable to save preferences' }, { status: 500 });
  }
}
