'use client';

import { AudioLines, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '~ui/atoms/button';
import { Card } from '~ui/atoms/card';
import { Typography } from '~ui/atoms/typography';
import { useCart } from '~modules/plugins/cart-context';
import { PluginsNavbar } from '~modules/plugins/plugins-navbar';

export default function CartPage() {
  const { cartItems, removeFromCart, total } = useCart();

  return (
    <main className='min-h-screen bg-white pb-section-sm text-black'>
      <PluginsNavbar />

      <section className='layout-width-limiter layout-padding space-y-8 pt-32 sm:pt-40'>
        <div className='space-y-3'>
          <Typography asChild variant='hero' weight='bold' prose={false}>
            <h1>Your Cart</h1>
          </Typography>
          <Typography variant='body' color='secondary' prose={false}>
            Review selected plugins before checkout.
          </Typography>
        </div>

        {cartItems.length === 0 ? (
          <Card className='rounded-xl border border-gray-200 bg-white'>
            <Typography variant='body' color='secondary' prose={false}>
              Your cart is empty
            </Typography>
            <Typography variant='body-sm' color='secondary' prose={false} className='mt-2'>
              Looks like you haven't added any plugins yet.
            </Typography>
            <Button asChild className='mt-5'>
              <Link href='/plugins'>Browse Plugins</Link>
            </Button>
          </Card>
        ) : (
          <div className='grid gap-6 lg:grid-cols-[1fr_22rem]'>
            <div className='space-y-3'>
              {cartItems.map((plugin) => (
                <Card
                  key={plugin.slug}
                  className='flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-6'
                >
                  <div className='flex items-center gap-4'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100'>
                      <AudioLines className='h-5 w-5' />
                    </div>
                    <div>
                      <Typography variant='heading' weight='medium' prose={false}>
                        {plugin.name}
                      </Typography>
                      <span className='inline-flex rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium'>
                        {plugin.category}
                      </span>
                    </div>
                  </div>

                  <div className='flex items-center gap-4'>
                    <span className='font-sans text-lg font-medium'>${plugin.price}</span>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      aria-label={`Remove ${plugin.name}`}
                      onClick={() => removeFromCart(plugin.slug)}
                      className='text-gray-500 hover:text-black'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Card className='h-fit rounded-xl border border-gray-200 bg-white p-6'>
              <Typography variant='heading' weight='medium' prose={false}>
                Order Summary
              </Typography>
              <div className='my-5 space-y-3'>
                {cartItems.map((plugin) => (
                  <div key={plugin.slug} className='flex justify-between gap-4 text-sm'>
                    <span>{plugin.name}</span>
                    <span>${plugin.price}</span>
                  </div>
                ))}
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
              <Button asChild className='mt-6 w-full'>
                <Link href='/checkout'>Proceed to Checkout</Link>
              </Button>
            </Card>
          </div>
        )}
      </section>
    </main>
  );
}
