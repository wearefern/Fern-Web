'use client';

import { AccountShell } from './account-shell';

export const BillingPage = () => {
  return (
    <AccountShell
      title='Billing'
      subtitle='Manage billing and payment connections'
    >
      <div className='rounded-lg border border-gray-200 bg-gray-50/40 p-6'>
        <p className='text-gray-600'>Billing details and payment setup will appear here.</p>
      </div>
    </AccountShell>
  );
};
