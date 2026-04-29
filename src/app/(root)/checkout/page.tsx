'use client';

import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

import { Button } from '~ui/atoms/button';
import { Card } from '~ui/atoms/card';
import { Typography } from '~ui/atoms/typography';
import { useCart } from '~modules/plugins/cart-context';
import { PluginsNavbar } from '~modules/plugins/plugins-navbar';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, completePurchase, total } = useCart();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    completePurchase();
    router.push('/account/downloads');
  };

  return (
    <main className='min-h-screen space-y-10 pb-section-sm'>
      <PluginsNavbar />

      <section className='layout-width-limiter layout-padding grid gap-8 pt-32 sm:pt-40 lg:grid-cols-[1fr_24rem]'>
        <div className='space-y-6'>
          <div className='space-y-3'>
            <Typography asChild variant='hero' weight='bold' prose={false}>
              <h1>Checkout</h1>
            </Typography>
            <Typography variant='body' color='secondary' prose={false}>
              Complete your purchase to unlock plugin downloads.
            </Typography>
          </div>

          <Card asChild className='rounded-xl'>
            <form onSubmit={handleSubmit} className='space-y-5'>
              <label className='block space-y-2'>
                <span className='text-sm font-medium text-ctx-primary-fg-secondary'>Name</span>
                <input
                  required
                  name='name'
                  className='w-full rounded-xl border border-ctx-primary-fg-decorative bg-ctx-primary px-4 py-3 text-ctx-primary-fg-solid outline-none focus:border-ctx-primary-fg-solid'
                />
              </label>

              <label className='block space-y-2'>
                <span className='text-sm font-medium text-ctx-primary-fg-secondary'>Email</span>
                <input
                  required
                  type='email'
                  name='email'
                  className='w-full rounded-xl border border-ctx-primary-fg-decorative bg-ctx-primary px-4 py-3 text-ctx-primary-fg-solid outline-none focus:border-ctx-primary-fg-solid'
                />
              </label>

              <Button type='submit' disabled={cartItems.length === 0}>
                Complete Purchase
              </Button>
            </form>
          </Card>
        </div>

        <Card className='h-fit rounded-xl'>
          <Typography variant='heading' weight='medium' prose={false}>
            Order Summary
          </Typography>
          <div className='my-5 space-y-3'>
            {cartItems.length === 0 ? (
              <Typography variant='body-sm' color='secondary' prose={false}>
                No plugins selected.
              </Typography>
            ) : (
              cartItems.map((plugin) => (
                <div key={plugin.slug} className='flex justify-between gap-4 text-sm'>
                  <span>{plugin.name}</span>
                  <span>${plugin.price}</span>
                </div>
              ))
            )}
          </div>
          <div className='flex justify-between border-t border-ctx-primary-fg-decorative pt-4 font-sans text-lg font-medium'>
            <span>Total</span>
            <span>${total}</span>
          </div>
        </Card>
      </section>
    </main>
  );
}
