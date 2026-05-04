/*import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

import { prisma } from '~lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clerkUser = await currentUser();

    const email = clerkUser?.primaryEmailAddress?.emailAddress ?? '';
    const name =
      [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') ||
      clerkUser?.username ||
      null;

    const user = await prisma.user.upsert({
      where: { hash: `clerk:${userId}` },
      update: {
        email,
        name,
        imageUrl: clerkUser?.imageUrl ?? null,
      },
      create: {
        hash: `clerk:${userId}`,
        clerkId: userId,
        email,
        name,
        imageUrl: clerkUser?.imageUrl ?? null,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Failed to sync current user', error);
    return NextResponse.json({ error: 'Unable to load user' }, { status: 500 });
  }
}*/

import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

import { prisma } from '~lib/prisma';

export async function GET() {
  console.log('ME API HIT');

  try {
    console.log('BEFORE AUTH');
    const { userId } = await auth();
    console.log('AFTER AUTH', userId);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('BEFORE CLERK CURRENT USER');
    const clerkUser = await currentUser();
    console.log('AFTER CLERK CURRENT USER', clerkUser?.primaryEmailAddress?.emailAddress);

    console.log('BEFORE PRISMA UPSERT');
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email: clerkUser?.primaryEmailAddress?.emailAddress ?? '',
        name:
          [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') ||
          clerkUser?.username ||
          null,
        imageUrl: clerkUser?.imageUrl ?? null,
      },
      create: {
        hash: `clerk:${userId}`,
        clerkId: userId,
        email: clerkUser?.primaryEmailAddress?.emailAddress ?? '',
        name:
          [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') ||
          clerkUser?.username ||
          null,
        imageUrl: clerkUser?.imageUrl ?? null,
      },
    });

    console.log('AFTER PRISMA UPSERT');

    return NextResponse.json(user);
  } catch (error) {
    console.error('ME API ERROR', error);
    return NextResponse.json({ error: 'Unable to load user' }, { status: 500 });
  }
}