'use client';

import Link from 'next/link';

import { AccountShell } from './account-shell';

export const SettingsSecurityPage = () => {
  return (
    <AccountShell
      title='Security'
      subtitle='Manage password, sessions, and sign-in settings.'
    >
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <h2 className='text-lg font-semibold text-black mb-2'>Password</h2>
          <p className='text-sm text-gray-600'>Update your password through Clerk account management.</p>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <h2 className='text-lg font-semibold text-black mb-2'>Active sessions</h2>
          <p className='text-sm text-gray-600'>Review active devices and sessions for your account.</p>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <h2 className='text-lg font-semibold text-black mb-2'>Connected accounts</h2>
          <p className='text-sm text-gray-600'>Manage linked sign-in providers and connected accounts.</p>
        </div>
      </div>

      <div className='mt-6 rounded-lg border border-gray-200 bg-gray-50 p-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
          <Link
            href='/account/settings/manage'
            className='inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white transition-opacity duration-200 ease-in-out hover:opacity-90'
          >
            Manage Security
          </Link>
          <p className='text-sm text-gray-500'>Open Clerk account management to make security changes safely.</p>
        </div>
      </div>
    </AccountShell>
  );
};
