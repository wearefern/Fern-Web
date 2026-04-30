import { currentUser } from '@clerk/nextjs/server';

import { getModelClient } from '~api/shared/model-client';

export const getCurrentUser = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser?.id) {
    return null;
  }

  const prisma = getModelClient();
  const email = clerkUser.primaryEmailAddress?.emailAddress ?? null;
  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
    clerkUser.username ||
    null;

  const dbUser = await prisma.user.upsert({
    where: { hash: `clerk:${clerkUser.id}` },
    update: {
      clerkId: clerkUser.id,
      email,
      name,
      imageUrl: clerkUser.imageUrl ?? null,
    },
    create: {
      hash: `clerk:${clerkUser.id}`,
      clerkId: clerkUser.id,
      email,
      name,
      imageUrl: clerkUser.imageUrl ?? null,
    },
  });

  return dbUser;
};
