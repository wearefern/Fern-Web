'use client';

import { Apple, ArrowLeft, MonitorDown } from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';

import { getPluginBySlug } from '../../../../../data/plugins-data';
import { Button } from '~ui/atoms/button';
import { Card } from '~ui/atoms/card';
import { Typography } from '~ui/atoms/typography';
import { useCart } from '~modules/plugins/cart-context';
import { PluginsNavbar } from '~modules/plugins/plugins-navbar';

const DownloadCard = ({
  href,
  label,
  fileSize,
  format,
  platform,
}: {
  href: string;
  label: string;
  fileSize: string;
  format: string;
  platform: 'mac' | 'windows';
}) => {
  const Icon = platform === 'mac' ? Apple : MonitorDown;

  return (
    <Card className='rounded-xl'>
      <Icon className='mb-5 h-8 w-8 text-ctx-primary-fg-solid' />
      <Typography variant='heading' weight='medium' prose={false}>
        {label}
      </Typography>
      <Typography variant='body-sm' color='secondary' prose={false} className='mt-2'>
        {fileSize} / {format}
      </Typography>
      <Button asChild className='mt-6'>
        <a href={href} download>
          Download
        </a>
      </Button>
    </Card>
  );
};

export default function PluginDownloadPage() {
  const params = useParams<{ slug: string }>();
  const plugin = getPluginBySlug(params.slug);
  const { isPurchased } = useCart();

  if (!plugin) {
    notFound();
  }

  const canDownload = isPurchased(plugin.slug);

  return (
    <main className='min-h-screen space-y-10 pb-section-sm'>
      <PluginsNavbar />

      <section className='layout-width-limiter layout-padding space-y-8 pt-32 sm:pt-40'>
        <Button variant='ghost' asChild className='px-0'>
          <Link href='/account/downloads'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to downloads
          </Link>
        </Button>

        {!canDownload ? (
          <Card className='rounded-xl'>
            <Typography asChild variant='heading' weight='medium' prose={false}>
              <h1>Download unavailable</h1>
            </Typography>
            <Typography variant='body' color='secondary' prose={false} className='mt-3'>
              This plugin has not been purchased yet.
            </Typography>
            <Button asChild className='mt-6'>
              <Link href='/plugins'>Back to Plugins</Link>
            </Button>
          </Card>
        ) : (
          <>
            <div className='space-y-3'>
              <Typography asChild variant='hero' weight='bold' prose={false}>
                <h1>{plugin.name}</h1>
              </Typography>
              <Typography variant='body' color='secondary' prose={false}>
                {plugin.format} / {plugin.version} / {plugin.fileSize} /{' '}
                {plugin.compatibility}
              </Typography>
            </div>

            <div className='grid gap-5 md:grid-cols-2'>
              <DownloadCard
                platform='mac'
                label='macOS'
                fileSize={plugin.fileSize}
                format={plugin.format}
                href={plugin.macDownloadUrl}
              />
              <DownloadCard
                platform='windows'
                label='Windows'
                fileSize={plugin.fileSize}
                format={plugin.format}
                href={plugin.windowsDownloadUrl}
              />
            </div>
          </>
        )}
      </section>
    </main>
  );
}
