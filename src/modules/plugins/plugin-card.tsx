'use client';

import { AudioLines } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Plugin } from '../../data/plugins-data';
import { Card } from '~ui/atoms/card';
import { Typography } from '~ui/atoms/typography';

import { cn } from '~utils/style';

import { WavemakerAudioPlayer } from './wavemaker-audio-player';

interface PluginCardProps {
  plugin: Plugin;
  className?: string;
}

export const PluginCard = ({ plugin, className }: PluginCardProps) => {
  const router = useRouter();

  return (
    <Card
      role='link'
      tabIndex={0}
      onClick={() => router.push(`/plugins/${plugin.slug}`)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          router.push(`/plugins/${plugin.slug}`);
        }
      }}
      className={cn(
        'group flex h-full cursor-pointer flex-col gap-6 rounded-2xl border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] transition-transform duration-200 hover:-translate-y-1 dark:border-white/10 dark:bg-neutral-950 dark:shadow-none',
        className
      )}
    >
      <div className='flex items-start justify-between gap-4'>
        <div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-black/10 bg-neutral-100 text-black dark:border-white/10 dark:bg-neutral-900 dark:text-white'>
          <AudioLines className='h-5 w-5' />
        </div>

        <span className='rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-black/60 dark:border-white/10 dark:bg-black dark:text-white/60'>
          {plugin.category}
        </span>
      </div>

      <div className='flex flex-1 flex-col gap-3'>
        <Typography
          asChild
          variant='heading'
          weight='bold'
          prose={false}
          className='text-xl leading-7 text-black dark:text-white'
        >
          <h2>{plugin.name}</h2>
        </Typography>
        <Typography
          variant='body-sm'
          prose={false}
          className='min-h-12 text-sm leading-6 text-black/58 dark:text-white/58'
        >
          {plugin.description}
        </Typography>
      </div>

      <WavemakerAudioPlayer
        compact
        id={`card-${plugin.slug}`}
        audioUrl={plugin.audioUrl}
        duration={plugin.duration}
      />

      <div className='flex items-center justify-between border-t border-black/10 pt-1 dark:border-white/10'>
        <span className='text-sm text-black/45 dark:text-white/45'>License</span>
        <span className='font-sans text-xl font-bold text-black dark:text-white'>
          ${plugin.price}
        </span>
      </div>
    </Card>
  );
};
