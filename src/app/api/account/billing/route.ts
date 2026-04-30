import { NextResponse } from 'next/server';

import { getModelClient } from '../../shared/model-client';
import { getCurrentUser } from '~lib/auth/get-current-user';

interface BillingPayload {
  fullName?: unknown;
  billingEmail?: unknown;
  country?: unknown;
  city?: unknown;
  addressLine1?: unknown;
  addressLine2?: unknown;
  postalCode?: unknown;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getModelClient();
    const billing = await prisma.billingProfile.findUnique({
      where: { userId: user.clerkId },
    });

    if (!billing) {
      return NextResponse.json({
        fullName: '',
        billingEmail: '',
        country: '',
        city: '',
        addressLine1: '',
        addressLine2: '',
        postalCode: '',
      });
    }

    return NextResponse.json(billing);
  } catch (error) {
    console.error('Failed to load billing profile', error);
    return NextResponse.json({ error: 'Unable to load billing profile' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as BillingPayload;
    const data = {
      fullName: String(body.fullName ?? ''),
      billingEmail: String(body.billingEmail ?? ''),
      country: String(body.country ?? ''),
      city: String(body.city ?? ''),
      addressLine1: String(body.addressLine1 ?? ''),
      addressLine2: String(body.addressLine2 ?? ''),
      postalCode: String(body.postalCode ?? ''),
    };

    const prisma = getModelClient();
    const profile = await prisma.billingProfile.upsert({
      where: { userId: user.clerkId },
      update: data,
      create: {
        userId: user.clerkId,
        ...data,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Failed to save billing profile', error);
    return NextResponse.json({ error: 'Unable to save billing profile' }, { status: 500 });
  }
}
