'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

import { AccountShell } from './account-shell';

export const SettingsProfilePage = () => {
  const { user, isLoaded } = useUser();
  const [fullName, setFullName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) {
      return;
    }

    setFullName(user.fullName ?? '');
    setImageUrl(user.imageUrl ?? '');
  }, [isLoaded, user]);

  const handleSave = async () => {
    try {
      if (!user) return;

      await user.update({
        firstName: fullName.split(' ')[0] || '',
        lastName: fullName.split(' ').slice(1).join(' ') || '',
      });

      setSuccess(true);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Unable to save profile details. Please try again.');
    }
  };

  const email = user?.primaryEmailAddress?.emailAddress ?? 'Not available';

  return (
    <AccountShell
      title='Profile Settings'
      subtitle='Update your name, photo, and personal account details.'
    >
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]'>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <div className='space-y-6'>
            <div>
              <h2 className='text-lg font-semibold text-black mb-3'>Profile details</h2>
              <p className='text-sm text-gray-600'>Edit your public name and avatar for the account.</p>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-black'>Full name</label>
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className='mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-black'>Email address</label>
                <input
                  readOnly
                  value={email}
                  className='mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700'
                />
                <p className='mt-2 text-sm text-gray-500'>Email is managed through your sign-in provider.</p>
              </div>

              <div>
                <label className='block text-sm font-medium text-black'>Profile image URL</label>
                <input
                  readOnly
                  value={imageUrl}
                  className='mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900'
                />
                <p className='mt-2 text-sm text-gray-500'>Avatar updates are managed through Clerk profile.</p>
              </div>
            </div>

            <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
              <button
                type='button'
                onClick={handleSave}
                className='inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white transition-opacity duration-200 ease-in-out hover:opacity-90'
              >
                Save changes
              </button>
              <Link
                href='/account/settings'
                className='inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-black transition-colors duration-200 ease-in-out hover:border-gray-400'
              >
                Cancel / Back to Settings
              </Link>
            </div>

            {success && <p className='text-sm text-green-600'>Profile updated successfully</p>}
            {error && <p className='text-sm text-red-600'>{error}</p>}
          </div>
        </div>

        <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
          <h2 className='text-lg font-semibold text-black mb-4'>Profile preview</h2>
          <div className='flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-200 bg-white p-4'>
            {imageUrl ? (
              <img src={imageUrl} alt='Profile' className='h-24 w-24 rounded-full object-cover' />
            ) : (
              <div className='flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-600'>No image</div>
            )}
            <div className='text-center'>
              <p className='text-sm font-semibold text-black'>{fullName || 'No name set'}</p>
              <p className='text-sm text-gray-600'>{email}</p>
            </div>
            <Link
              href='/account/profile'
              className='inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white transition-opacity duration-200 ease-in-out hover:opacity-90'
            >
              Manage in Clerk profile
            </Link>
          </div>
        </div>
      </div>
    </AccountShell>
  );
};
