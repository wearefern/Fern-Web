'use client';

import { ArrowLeft, Check, Package, Play, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Plugin } from '../../data/plugins-data';
import { Button } from '~ui/atoms/button';
import { Card } from '~ui/atoms/card';
import { Typography } from '~ui/atoms/typography';

import { useCart } from './cart-context';
import { PluginsNavbar } from './plugins-navbar';
import { WavemakerAudioPlayer } from './wavemaker-audio-player';

interface PluginDetailProps {
  plugin: Plugin;
}

const MetadataItem = ({ label, value }: { label: string; value: string }) => (
  <div className='rounded-xl border border-ctx-primary-fg-decorative bg-ctx-primary p-4'>
    <Typography variant='sm' color='secondary' prose={false}>
      {label}
    </Typography>
    <Typography variant='body-sm' weight='medium' prose={false}>
      {value}
    </Typography>
  </div>
);

const ListSection = ({ title, items }: { title: string; items: string[] }) => (
  <section className='space-y-4'>
    <Typography asChild variant='heading' weight='medium' prose={false}>
      <h2>{title}</h2>
    </Typography>
    <div className='grid gap-3 sm:grid-cols-2'>
      {items.map((item) => (
        <div key={item} className='flex gap-3 rounded-xl bg-ctx-secondary p-4'>
          <Check className='mt-1 h-4 w-4 shrink-0 text-black dark:text-white' />
          <Typography variant='body-sm' prose={false}>
            {item}
          </Typography>
        </div>
      ))}
    </div>
  </section>
);

export const PluginDetail = ({ plugin }: PluginDetailProps) => {
  const { addToCart, isInCart } = useCart();
  const [message, setMessage] = useState('');

  const handleAddToCart = () => {
    const result = addToCart(plugin);
    setMessage(result === 'duplicate' ? 'Already in cart' : 'Added to cart');
  };

  return (
    <main className='min-h-screen space-y-12 pb-section-sm'>
      <PluginsNavbar />

      <section className='layout-width-limiter layout-padding pt-32 sm:pt-40'>
        <Button variant='ghost' asChild className='mb-8 px-0'>
          <Link href='/plugins'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Plugins
          </Link>
        </Button>

        <div className='grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]'>
          <div className='space-y-5'>
            <Card className='flex aspect-[4/3] items-center justify-center rounded-xl bg-ctx-secondary'>
              <div className='flex flex-col items-center gap-4 text-ctx-primary-fg-secondary'>
                <Package className='h-16 w-16' />
                <Typography variant='body-sm' prose={false}>
                  Product visual
                </Typography>
              </div>
            </Card>

            <WavemakerAudioPlayer
              id={`hero-${plugin.slug}`}
              audioUrl={plugin.audioUrl}
              duration={plugin.duration}
            />
          </div>

          <div className='space-y-6'>
            <span className='inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-medium text-black/65 dark:border-white/10 dark:bg-black dark:text-white/65'>
              {plugin.category}
            </span>

            <div className='space-y-4'>
              <Typography asChild variant='hero' weight='bold' prose={false}>
                <h1>{plugin.name}</h1>
              </Typography>
              <Typography variant='body' color='secondary' prose={false}>
                {plugin.description}
              </Typography>
              <Typography
                asChild
                variant='heading'
                weight='bold'
                prose={false}
                className='text-ctx-primary-fg-solid'
              >
                <p>${plugin.price}</p>
              </Typography>
            </div>

            <div className='flex flex-wrap items-center gap-3'>
              <Button type='button' onClick={handleAddToCart}>
                <ShoppingCart className='mr-2 h-4 w-4' />
                {isInCart(plugin.slug) ? 'In Cart' : 'Add to Cart'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('fern-audio-preview-play', {
                      detail: `bottom-${plugin.slug}`,
                    })
                  );
                }}
              >
                <Play className='mr-2 h-4 w-4' />
                Preview Audio
              </Button>
            </div>

            {message ? (
              <Typography variant='body-sm' color='secondary' prose={false}>
                {message}
              </Typography>
            ) : null}

            <div className='grid gap-3 sm:grid-cols-2'>
              <MetadataItem label='Format' value={plugin.format} />
              <MetadataItem label='Version' value={plugin.version} />
              <MetadataItem label='File size' value={plugin.fileSize} />
              <MetadataItem label='Compatibility' value={plugin.compatibility} />
            </div>
          </div>
        </div>
      </section>

      <section className='layout-width-limiter layout-padding space-y-10'>
        <section className='space-y-4'>
          <Typography asChild variant='heading' weight='medium' prose={false}>
            <h2>Overview</h2>
          </Typography>
          <Typography variant='body' color='secondary' prose={false}>
            {plugin.longDescription}
          </Typography>
        </section>

        <ListSection title='Key Features' items={plugin.features} />

        <section className='space-y-4'>
          <Typography asChild variant='heading' weight='medium' prose={false}>
            <h2>How It Works</h2>
          </Typography>
          <Typography variant='body' color='secondary' prose={false}>
            Load the plugin on an instrument, bus, or audio track, choose a preset,
            then shape the macro controls until the preview sits naturally in your
            production.
          </Typography>
        </section>

        <ListSection title="What's Included" items={plugin.includedItems} />
        <ListSection title='System Requirements' items={plugin.systemRequirements} />

        <section className='space-y-4'>
          <Typography asChild variant='heading' weight='medium' prose={false}>
            <h2>License</h2>
          </Typography>
          <Typography variant='body' color='secondary' prose={false}>
            {plugin.licenseText}
          </Typography>
        </section>

        <section className='space-y-4'>
          <Typography asChild variant='heading' weight='medium' prose={false}>
            <h2>Audio Preview</h2>
          </Typography>
          <WavemakerAudioPlayer
            id={`bottom-${plugin.slug}`}
            audioUrl={plugin.audioUrl}
            duration={plugin.duration}
          />
        </section>
      </section>
    </main>
  );
};
