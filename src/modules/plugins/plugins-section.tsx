'use client';

import { useMemo, useState } from 'react';

import { plugins } from '../../data/plugins-data';
import { Button } from '~ui/atoms/button';
import { Typography } from '~ui/atoms/typography';

import { cn } from '~utils/style';

import { PluginCard } from './plugin-card';
import { PluginsNavbar } from './plugins-navbar';

const filters = ['All', 'Ambient', 'Electronic', 'Vintage', 'Cinematic', 'Lo-Fi', 'Nature'];

export const PluginsSection = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredPlugins = useMemo(
    () =>
      activeFilter === 'All'
        ? plugins
        : plugins.filter((plugin) => plugin.category === activeFilter),
    [activeFilter]
  );

  return (
    <main className='min-h-screen bg-white pb-section-sm text-black dark:bg-black dark:text-white'>
      <PluginsNavbar />

      <section className='layout-width-limiter layout-padding pt-28 sm:pt-36'>
        <div className='mx-auto max-w-4xl space-y-6 text-center'>
          <Typography
            variant='sm'
            weight='bold'
            prose={false}
            className='font-mono uppercase tracking-normal text-black/55 dark:text-white/55'
          >
            FERN-NATIVE PLUGINS
          </Typography>
          <Typography
            asChild
            variant='hero'
            weight='bold'
            prose={false}
            className='mx-auto max-w-5xl text-[clamp(3rem,8vw,6.75rem)] leading-[0.94] tracking-normal text-black dark:text-white'
          >
            <h1>Professional Audio Plugins</h1>
          </Typography>
          <Typography
            variant='body'
            prose={false}
            className='mx-auto max-w-2xl text-base leading-7 text-black/60 dark:text-white/60 sm:text-lg'
          >
            Production-ready audio tools shaped for focused writing, clean mixing,
            and expressive sound design inside modern creative workflows.
          </Typography>
        </div>
      </section>

      <section className='layout-width-limiter layout-padding mt-12 space-y-10 sm:mt-16'>
        <div className='mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-3'>
          {filters.map((filter) => (
            <Button
              key={filter}
              type='button'
              variant='outline'
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'min-h-11 rounded-full border px-5 py-2.5 text-sm font-medium tracking-normal shadow-none',
                activeFilter === filter
                  ? 'border-black bg-black text-white hover:bg-black/85 dark:border-white dark:bg-white dark:text-black dark:hover:bg-white/85'
                  : 'border-black/20 bg-white text-black hover:bg-black/5 dark:border-white/20 dark:bg-black dark:text-white dark:hover:bg-white/10'
              )}
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
          {filteredPlugins.map((plugin) => (
            <PluginCard key={plugin.slug} plugin={plugin} />
          ))}
        </div>
      </section>
    </main>
  );
};
