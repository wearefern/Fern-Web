'use client';

import Link from 'next/link';
import { SignOutButton, UserProfile, useAuth } from '@clerk/nextjs';

import { AccountShell } from './account-shell';

export const SettingsManagePage = () => {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <AccountShell
        title='Manage Account'
        subtitle='Manage your account profile, security, and connected sign-in methods.'
      >
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <p className='text-sm text-gray-600'>Loading account management tools…</p>
        </div>
      </AccountShell>
    );
  }

  return (
    <AccountShell
      title='Manage Account'
      subtitle='Manage your account profile, security, and connected sign-in methods.'
    >
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]'>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <p className='text-gray-700 mb-6'>Use the embedded Clerk profile manager to update account settings, security, and sign-in methods.</p>

          <div className='overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-4'>
            <UserProfile />
          </div>
        </div>

        <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
          <h2 className='text-lg font-semibold text-black mb-3'>Quick account actions</h2>
          <p className='text-sm text-gray-600 mb-6'>If embedded account management is limited, use these links to navigate to specific account flows.</p>
          <div className='space-y-3'>
            <Link
              href='/account/settings/profile'
              className='inline-flex h-10 w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-black transition-colors duration-200 ease-in-out hover:border-gray-400'
            >
              Manage profile
            </Link>
            <Link
              href='/account/settings/security'
              className='inline-flex h-10 w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-black transition-colors duration-200 ease-in-out hover:border-gray-400'
            >
              Manage security
            </Link>
            <div className='inline-flex h-10 w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-black transition-colors duration-200 ease-in-out hover:border-gray-400'>
              <SignOutButton>
                Sign out
              </SignOutButton>
            </div>
          </div>
        </div>
      </div>
    </AccountShell>
  );
};
