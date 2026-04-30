'use client';

import Link from 'next/link';

import { AccountShell } from './account-shell';

const cardClassName =
  'group block rounded-lg border border-gray-200 bg-white p-6 transition duration-200 ease-in-out hover:border-gray-300 hover:bg-gray-50';

export const SettingsPage = () => {
  return (
    <AccountShell
      title='Settings'
      subtitle='Manage preferences, security, and account options.'
    >
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Link href='/account/settings/profile' className={cardClassName}>
          <h2 className='text-lg font-semibold text-black mb-2'>Profile settings</h2>
          <p className='text-gray-600'>Name, photo, and personal account details.</p>
        </Link>

        <Link href='/account/settings/email' className={cardClassName}>
          <h2 className='text-lg font-semibold text-black mb-2'>Email preferences</h2>
          <p className='text-gray-600'>Notification and communication preferences.</p>
        </Link>

        <Link href='/account/settings/security' className={cardClassName}>
          <h2 className='text-lg font-semibold text-black mb-2'>Security</h2>
          <p className='text-gray-600'>Password, device sessions, and sign-in settings.</p>
        </Link>

        <Link href='/account/settings/billing' className={cardClassName}>
          <h2 className='text-lg font-semibold text-black mb-2'>Billing details</h2>
          <p className='text-gray-600'>Payment methods and billing profile.</p>
        </Link>

        <Link href='/account/settings/manage' className={cardClassName}>
          <h2 className='text-lg font-semibold text-black mb-2'>Manage Account</h2>
          <p className='text-gray-600'>Advanced account profile, security, and connected sign-in methods.</p>
        </Link>
      </div>
    </AccountShell>
  );
};
