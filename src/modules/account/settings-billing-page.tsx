'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';

import { AccountShell } from './account-shell';
import { cn } from '~utils/style';

const emptyBilling = {
  fullName: '',
  billingEmail: '',
  country: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postalCode: '',
};

interface BillingForm {
  fullName: string;
  billingEmail: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
}

interface ApiError {
  error?: string;
}

interface FieldProps {
  label: string;
  className?: string;
  children: ReactNode;
}

const Field = ({ label, className, children }: FieldProps) => {
  return (
    <div className={cn('min-w-0 space-y-2', className)}>
      <label className='block text-sm font-medium text-black'>{label}</label>
      {children}
    </div>
  );
};

export const SettingsBillingPage = () => {
  type SaveStatus = 'idle' | 'loading' | 'success' | 'error';
  type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

  const [form, setForm] = useState<BillingForm>(emptyBilling);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('idle');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadBillingProfile = async () => {
      setLoadStatus('loading');
      setErrorMessage(null);

      try {
        const res = await fetch('/api/account/billing', {
          method: 'GET',
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Failed to load billing details');
        }

        const data = (await res.json()) as Partial<BillingForm>;
        setForm({
          fullName: data?.fullName ?? '',
          billingEmail: data?.billingEmail ?? '',
          country: data?.country ?? '',
          city: data?.city ?? '',
          addressLine1: data?.addressLine1 ?? '',
          addressLine2: data?.addressLine2 ?? '',
          postalCode: data?.postalCode ?? '',
        });
        setLoadStatus('success');
      } catch (error) {
        console.error(error);
        setLoadStatus('error');
        setErrorMessage('Unable to load billing details. Please refresh and try again.');
      }
    };

    void loadBillingProfile();
  }, []);

  const handleChange = (key: keyof typeof emptyBilling, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveStatus('loading');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/account/billing', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as ApiError | null;
        throw new Error(data?.error || 'Failed to save billing profile');
      }

      const saved = (await res.json()) as Partial<BillingForm>;
      setForm({
        fullName: saved?.fullName ?? '',
        billingEmail: saved?.billingEmail ?? '',
        country: saved?.country ?? '',
        city: saved?.city ?? '',
        addressLine1: saved?.addressLine1 ?? '',
        addressLine2: saved?.addressLine2 ?? '',
        postalCode: saved?.postalCode ?? '',
      });
      setSaveStatus('success');
    } catch (error) {
      console.error(error);
      setSaveStatus('error');
      setErrorMessage('Unable to save billing details. Please try again.');
    }
  };

  return (
    <AccountShell title='Billing Details' subtitle='Manage payment methods, invoices, and billing profile.'>
      <div className='w-full max-w-none'>
        <div className='w-full max-w-5xl rounded-lg border border-gray-200 bg-white p-6 md:p-8'>
          <div className='space-y-6'>
            <div>
              <h2 className='text-lg font-semibold text-black mb-3'>Billing profile</h2>
              <p className='text-sm text-gray-600'>Update the billing address and contact information used for invoices.</p>
            </div>

            <form
              onSubmit={(event) => {
                void handleSubmit(event);
              }}
              className='w-full space-y-8'
            >
              <div className='grid w-full grid-cols-1 gap-6 md:grid-cols-2'>
                <Field label='Full name / company name'>
                  <input
                    value={form.fullName}
                    onChange={(event) => handleChange('fullName', event.target.value)}
                    className='h-12 w-full min-w-0 rounded-lg border border-neutral-300 px-4 text-sm text-black'
                  />
                </Field>

                <Field label='Billing email'>
                  <input
                    value={form.billingEmail}
                    onChange={(event) => handleChange('billingEmail', event.target.value)}
                    className='h-12 w-full min-w-0 rounded-lg border border-neutral-300 px-4 text-sm text-black'
                  />
                </Field>

                <Field label='Country'>
                  <input
                    value={form.country}
                    onChange={(event) => handleChange('country', event.target.value)}
                    className='h-12 w-full min-w-0 rounded-lg border border-neutral-300 px-4 text-sm text-black'
                  />
                </Field>

                <Field label='City'>
                  <input
                    value={form.city}
                    onChange={(event) => handleChange('city', event.target.value)}
                    className='h-12 w-full min-w-0 rounded-lg border border-neutral-300 px-4 text-sm text-black'
                  />
                </Field>

                <Field label='Address line 1' className='md:col-span-2'>
                  <input
                    value={form.addressLine1}
                    onChange={(event) => handleChange('addressLine1', event.target.value)}
                    className='h-12 w-full min-w-0 rounded-lg border border-neutral-300 px-4 text-sm text-black'
                  />
                </Field>

                <Field label='Address line 2' className='md:col-span-2'>
                  <input
                    value={form.addressLine2}
                    onChange={(event) => handleChange('addressLine2', event.target.value)}
                    className='h-12 w-full min-w-0 rounded-lg border border-neutral-300 px-4 text-sm text-black'
                  />
                </Field>

                <Field label='Postal code'>
                  <input
                    value={form.postalCode}
                    onChange={(event) => handleChange('postalCode', event.target.value)}
                    className='h-12 w-full min-w-0 rounded-lg border border-neutral-300 px-4 text-sm text-black'
                  />
                </Field>
              </div>

              <div className='flex w-full flex-col gap-4 border-t border-neutral-200 pt-6 md:flex-row md:items-center md:justify-between'>
                <button
                  type='submit'
                  disabled={saveStatus === 'loading'}
                  className='h-11 w-full whitespace-nowrap rounded-lg bg-black px-5 text-white transition-opacity duration-200 ease-in-out hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-400 md:w-auto'
                >
                  {saveStatus === 'loading' ? 'Saving...' : 'Save billing profile'}
                </button>

                <p className='max-w-xl text-sm text-neutral-500'>
                  Only billing profile fields are saved here. Payment methods remain placeholder content.
                </p>
              </div>

              {loadStatus === 'error' && errorMessage ? <p className='text-sm text-red-600'>{errorMessage}</p> : null}
              {saveStatus === 'success' ? (
                <p className='text-sm text-neutral-600'>Billing details saved successfully.</p>
              ) : null}
              {saveStatus === 'error' && errorMessage ? <p className='text-sm text-red-600'>{errorMessage}</p> : null}
            </form>
          </div>
        </div>

        <div className='mt-6 w-full max-w-5xl rounded-lg border border-gray-200 bg-gray-50 p-6'>
          <h2 className='text-lg font-semibold text-black mb-4'>Invoices & payment</h2>
          <p className='text-sm text-gray-600'>Payment methods and invoices are placeholder-ready until Stripe portal integration is available.</p>
          <div className='mt-6 rounded-xl border border-gray-200 bg-white p-4'>
            <p className='text-sm text-gray-700'>No billing details available yet.</p>
            <div className='mt-4'>
              <Link
                href='/account/orders'
                className='inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white transition-opacity duration-200 ease-in-out hover:opacity-90'
              >
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AccountShell>
  );
};
