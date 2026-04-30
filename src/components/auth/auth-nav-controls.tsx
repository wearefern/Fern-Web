'use client';

import Link from 'next/link';
import { Show, UserButton, useAuth } from '@clerk/nextjs';

import { ClientOnly } from '../client-only';

interface AuthNavControlsProps {
  showAccountLink?: boolean;
  accountClassName?: string;
  accountLabel?: string;
  signedInHref?: string;
  signedOutHref?: string;
  showUserButton?: boolean;
  userButtonAvatarClassName?: string;
}

export function AuthNavControls({
  showAccountLink = true,
  accountClassName,
  accountLabel = 'Account',
  signedInHref = '/account',
  signedOutHref = '/sign-in',
  showUserButton = true,
  userButtonAvatarClassName = 'h-8 w-8',
}: AuthNavControlsProps) {
  const { isSignedIn } = useAuth();
  const fallback = showAccountLink ? (
    <Link href={signedOutHref} className={accountClassName}>
      {accountLabel}
    </Link>
  ) : null;

  return (
    <ClientOnly fallback={fallback}>
      <Show when={isSignedIn ? 'signed-in' : 'signed-out'}>
        {showAccountLink ? (
          <Link href={isSignedIn ? signedInHref : signedOutHref} className={accountClassName}>
            {accountLabel}
          </Link>
        ) : null}
        {isSignedIn && showUserButton ? (
          <UserButton
            appearance={{
              elements: {
                avatarBox: userButtonAvatarClassName,
              },
            }}
          />
        ) : null}
      </Show>
    </ClientOnly>
  );
}
