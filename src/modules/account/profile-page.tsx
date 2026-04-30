'use client';

import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';

import { AccountShell } from './account-shell';

export const ProfilePage = () => {
  const { user } = useUser();
  const fullName = user?.fullName ?? 'Not set';
  const primaryEmail = user?.primaryEmailAddress?.emailAddress ?? 'Not available';

  return (
    <AccountShell
      title='Profile'
      subtitle='Manage your account identity and personal details.'
    >
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]'>
        <div className='rounded-lg border border-gray-200 bg-gray-50/40 p-6'>
          <h2 className='text-lg font-semibold text-black mb-4'>Identity</h2>

          <div className='space-y-3 text-gray-700'>
            <p>
              <span className='text-gray-500'>Name:</span> {fullName}
            </p>
            <p>
              <span className='text-gray-500'>Email:</span> {primaryEmail}
            </p>
          </div>

          <div className='mt-6'>
            <Link
              href='/account/settings'
              className='inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white transition-opacity duration-200 ease-in-out hover:opacity-90'
            >
              Manage Account
            </Link>
          </div>
        </div>

        <div className='rounded-lg border border-gray-200 bg-gray-50/40 p-6 lg:w-56'>
          <h2 className='text-lg font-semibold text-black mb-4'>Profile Image</h2>
          <div className='flex items-center gap-3'>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'h-10 w-10',
                },
              }}
            />
            <p className='text-sm text-gray-600'>Managed by Clerk</p>
          </div>
        </div>
      </div>
    </AccountShell>
  );
};
