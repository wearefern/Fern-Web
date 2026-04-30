import { NextResponse } from 'next/server';

import { getModelClient } from '../../shared/model-client';
import { getCurrentUser } from '~lib/auth/get-current-user';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getModelClient();
    const billing = await prisma.billingProfile.findUnique({
      where: { userId: user.id },
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
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
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
      where: { userId: user.id },
      update: data,
      create: {
        userId: user.id,
        ...data,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Failed to save billing profile', error);
    return NextResponse.json({ error: 'Unable to save billing profile' }, { status: 500 });
  }
}
