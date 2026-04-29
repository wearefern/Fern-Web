'use client';

import { Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '~ui/atoms/button';
import { Card } from '~ui/atoms/card';
import { Typography } from '~ui/atoms/typography';
import { useCart } from '~modules/plugins/cart-context';
import { PluginsNavbar } from '~modules/plugins/plugins-navbar';

export default function CartPage() {
  const { cartItems, removeFromCart, total } = useCart();

  return (
    <main className='min-h-screen space-y-10 pb-section-sm'>
      <PluginsNavbar />

      <section className='layout-width-limiter layout-padding space-y-8 pt-32 sm:pt-40'>
        <div className='space-y-3'>
          <Typography asChild variant='hero' weight='bold' prose={false}>
            <h1>View Cart</h1>
          </Typography>
          <Typography variant='body' color='secondary' prose={false}>
            Review your selected Fern-native plugins before checkout.
          </Typography>
        </div>

        {cartItems.length === 0 ? (
          <Card className='rounded-xl'>
            <Typography variant='body' color='secondary' prose={false}>
              Your cart is empty.
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
                  className='flex flex-col justify-between gap-4 rounded-xl sm:flex-row sm:items-center'
                >
                  <div>
                    <Typography variant='heading' weight='medium' prose={false}>
                      {plugin.name}
                    </Typography>
                    <Typography variant='body-sm' color='secondary' prose={false}>
                      {plugin.category} / {plugin.format}
                    </Typography>
                  </div>

                  <div className='flex items-center justify-between gap-4 sm:justify-end'>
                    <span className='font-sans text-lg font-medium'>${plugin.price}</span>
                    <Button
                      type='button'
                      size='icon'
                      variant='outline'
                      aria-label={`Remove ${plugin.name}`}
                      onClick={() => removeFromCart(plugin.slug)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Card className='h-fit rounded-xl'>
              <div className='flex items-center justify-between'>
                <Typography variant='heading' weight='medium' prose={false}>
                  Total
                </Typography>
                <span className='font-sans text-2xl font-bold'>${total}</span>
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
