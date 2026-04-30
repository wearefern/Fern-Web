import { auth, currentUser } from '@clerk/nextjs/server';

import { getModelClient } from '~api/shared/model-client';

export const getCurrentUser = async () => {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const prisma = getModelClient();
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
};
