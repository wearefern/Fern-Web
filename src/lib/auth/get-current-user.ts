import { auth, currentUser } from '@clerk/nextjs/server';
import { type User } from '@prisma/client';

import { prisma } from '~lib/prisma';

export const getCurrentUser = async (): Promise<User | null> => {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  try {
    const byClerkId = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (byClerkId) {
      return byClerkId;
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.primaryEmailAddress?.emailAddress ?? null;
    const name =
      clerkUser
        ? [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
          clerkUser.username ||
          null
        : null;
    const imageUrl = clerkUser?.imageUrl ?? null;

    const createdUser = await prisma.user.create({
      data: {
        hash: `clerk:${userId}`,
        clerkId: userId,
        email,
        name,
        imageUrl,
      },
    });

    return createdUser;
  } catch (error) {
    console.warn('Failed to resolve current user from database:', error);
    return null;
  }
};
