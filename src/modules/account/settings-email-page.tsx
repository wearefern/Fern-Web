'use client';

import { useEffect, useState } from 'react';

import { AccountShell } from './account-shell';

const defaultPreferences = {
  orderConfirmations: true,
  downloadUpdates: false,
  productAnnouncements: false,
  marketingEmails: false,
};

type Preferences = typeof defaultPreferences;

export const SettingsEmailPage = () => {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [status, setStatus] = useState<'loading' | 'idle' | 'saving' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/account/preferences');
        if (!response.ok) {
          throw new Error('Failed to load preferences');
        }

        const data = (await response.json()) as Partial<Preferences>;
        setPreferences((current) => ({
          ...current,
          ...data,
        }));
        setStatus('idle');
      } catch (error) {
        setStatus('error');
        setMessage('Unable to load email preferences.');
      }
    };

    void fetchPreferences();
  }, []);

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleSave = async () => {
    setStatus('saving');
    setMessage('');

    try {
      const response = await fetch('/api/account/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Unable to save preferences');
      }

      setStatus('success');
      setMessage('Email preferences saved successfully.');
    } catch (error) {
      setStatus('error');
      setMessage('Unable to save email preferences. Please try again.');
    }
  };

  return (
    <AccountShell
      title='Email Preferences'
      subtitle='Choose what emails you want to receive.'
    >
      <div className='space-y-6'>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <div className='space-y-4'>
            {[
              {
                key: 'orderConfirmations' as const,
                label: 'Order confirmations',
                description: 'Updates when your orders are processed and shipped.',
              },
              {
                key: 'downloadUpdates' as const,
                label: 'Download updates',
                description: 'Notices about new downloads and plugin updates.',
              },
              {
                key: 'productAnnouncements' as const,
                label: 'Product announcements',
                description: 'Information about new features and releases.',
              },
              {
                key: 'marketingEmails' as const,
                label: 'Marketing emails',
                description: 'Promotions, offers, and Fern news.',
              },
            ].map((item) => (
              <label
                key={item.key}
                className='flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-4'
              >
                <div>
                  <p className='text-sm font-semibold text-black'>{item.label}</p>
                  <p className='text-sm text-gray-600'>{item.description}</p>
                </div>
                <input
                  type='checkbox'
                  checked={preferences[item.key]}
                  onChange={() => handleToggle(item.key)}
                  className='h-5 w-5 rounded border-gray-300 text-black focus:ring-black'
                />
              </label>
            ))}
          </div>
        </div>

        <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
          <button
            type='button'
            disabled={status === 'saving' || status === 'loading'}
            onClick={() => {
              void handleSave();
            }}
            className='inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white transition-opacity duration-200 ease-in-out hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-400'
          >
            Save preferences
          </button>
          {status === 'loading' ? (
            <p className='text-sm text-gray-500'>Loading your current preferences...</p>
          ) : (
            <p className='text-sm text-gray-500'>Preferences are saved per account when you click Save preferences.</p>
          )}
        </div>

        {status === 'success' && <p className='text-sm text-green-600'>{message}</p>}
        {status === 'error' && <p className='text-sm text-red-600'>{message}</p>}
      </div>
    </AccountShell>
  );
};
