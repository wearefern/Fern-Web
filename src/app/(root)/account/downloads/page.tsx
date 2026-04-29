'use client';

import { AudioLines } from 'lucide-react';
import Link from 'next/link';

import { Button } from '~ui/atoms/button';
import { Card } from '~ui/atoms/card';
import { Typography } from '~ui/atoms/typography';
import { useCart } from '~modules/plugins/cart-context';
import { PluginsNavbar } from '~modules/plugins/plugins-navbar';

export default function AccountDownloadsPage() {
  const { purchasedPlugins } = useCart();

  return (
    <main className='min-h-screen bg-white pb-section-sm text-black'>
      <PluginsNavbar />

      <section className='layout-width-limiter layout-padding space-y-8 pt-32 sm:pt-40'>
        <div className='space-y-3'>
          <Typography asChild variant='hero' weight='bold' prose={false}>
            <h1>Account Downloads</h1>
          </Typography>
          <Typography variant='body' color='secondary' prose={false}>
            Access purchased plugins and platform downloads.
          </Typography>
        </div>

        {purchasedPlugins.length === 0 ? (
          <Card className='rounded-xl border border-gray-200 bg-white p-6'>
            <Typography variant='body' color='secondary' prose={false}>
              No downloads available yet
            </Typography>
            <Typography variant='body-sm' color='secondary' prose={false} className='mt-2'>
              Purchase plugins to access their installers here.
            </Typography>
            <Button asChild className='mt-5'>
              <Link href='/plugins'>Browse Plugins</Link>
            </Button>
          </Card>
        ) : (
          <div className='space-y-4'>
            {purchasedPlugins.map((plugin) => (
              <Card
                key={plugin.slug}
                className='flex items-center justify-between gap-6 rounded-xl border border-gray-200 bg-white p-6'
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
                    <div className='mt-2 text-sm text-gray-600'>
                      {plugin.version} / {plugin.fileSize} / {plugin.compatibility}
                    </div>
                  </div>
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
