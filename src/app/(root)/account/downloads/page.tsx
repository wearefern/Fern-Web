'use client';

import Link from 'next/link';

import { Button } from '~ui/atoms/button';
import { Card } from '~ui/atoms/card';
import { Typography } from '~ui/atoms/typography';
import { useCart } from '~modules/plugins/cart-context';
import { PluginsNavbar } from '~modules/plugins/plugins-navbar';

export default function AccountDownloadsPage() {
  const { purchasedPlugins } = useCart();

  return (
    <main className='min-h-screen space-y-10 pb-section-sm'>
      <PluginsNavbar />

      <section className='layout-width-limiter layout-padding space-y-8 pt-32 sm:pt-40'>
        <div className='space-y-3'>
          <Typography asChild variant='hero' weight='bold' prose={false}>
            <h1>Account Downloads</h1>
          </Typography>
          <Typography variant='body' color='secondary' prose={false}>
            Access purchased Fern-native plugin installers.
          </Typography>
        </div>

        {purchasedPlugins.length === 0 ? (
          <Card className='rounded-xl'>
            <Typography variant='body' color='secondary' prose={false}>
              No purchased plugins yet.
            </Typography>
            <Button asChild className='mt-5'>
              <Link href='/plugins'>Browse Plugins</Link>
            </Button>
          </Card>
        ) : (
          <div className='grid gap-4 md:grid-cols-2'>
            {purchasedPlugins.map((plugin) => (
              <Card
                key={plugin.slug}
                className='flex flex-col justify-between gap-5 rounded-xl sm:flex-row sm:items-center'
              >
                <div>
                  <Typography variant='heading' weight='medium' prose={false}>
                    {plugin.name}
                  </Typography>
                  <Typography variant='body-sm' color='secondary' prose={false}>
                    {plugin.version} / {plugin.compatibility}
                  </Typography>
                </div>

                <Button asChild>
                  <Link href={`/plugins/${plugin.slug}/download`}>Go to Download</Link>
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
