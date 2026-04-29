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
    <main className='min-h-screen bg-white pb-section-sm text-black'>
      <PluginsNavbar />

      <section className='layout-width-limiter layout-padding grid gap-8 pt-32 sm:pt-40 lg:grid-cols-[1fr_24rem]'>
        <div className='space-y-6'>
          <div className='space-y-3'>
            <Typography asChild variant='hero' weight='bold' prose={false}>
              <h1>Checkout</h1>
            </Typography>
            <Typography variant='body' color='secondary' prose={false}>
              Complete your purchase to get instant access.
            </Typography>
          </div>

          <Card className='rounded-xl border border-gray-200 bg-white p-6'>
            <Typography variant='heading' weight='medium' prose={false} className='mb-5'>
              Customer Details
            </Typography>
            <form onSubmit={handleSubmit} className='space-y-5'>
              <label className='block space-y-2'>
                <span className='text-sm font-medium text-gray-600'>Full Name</span>
                <input
                  required
                  name='name'
                  className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-black outline-none focus:border-black'
                />
              </label>

              <label className='block space-y-2'>
                <span className='text-sm font-medium text-gray-600'>Email</span>
                <input
                  required
                  type='email'
                  name='email'
                  className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-black outline-none focus:border-black'
                />
              </label>

              <Typography variant='body-sm' color='secondary' prose={false} className='text-gray-500'>
                We'll use this information to send you download links and receipts.
              </Typography>

              <Button type='submit' disabled={cartItems.length === 0} className='w-full'>
                Complete Purchase
              </Button>
            </form>
          </Card>
        </div>

        <Card className='h-fit rounded-xl border border-gray-200 bg-white p-6'>
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
          <div className='space-y-2 border-t border-gray-200 pt-4'>
            <div className='flex justify-between font-sans text-lg font-medium'>
              <span>Subtotal</span>
              <span>${total}</span>
            </div>
            <div className='flex justify-between font-sans text-xl font-bold'>
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
          <div className='mt-6 space-y-2 text-center text-sm text-gray-500'>
            <div>Secure checkout</div>
            <div>Instant access after purchase</div>
          </div>
        </Card>
      </section>
    </main>
  );
}
