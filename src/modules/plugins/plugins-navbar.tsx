'use client';

import Link from 'next/link';

import { ThemeToggle } from '~ui/atoms/theme/theme-toggle';
import { AppHeader } from '~ui/molecules/app-header';

const PluginsNavbar = () => {
  return (
    <AppHeader
      mode='compact'
      className='border-b border-black/10 bg-white/90 from-white to-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-black/90 dark:from-black dark:to-black/80'
      innerClassName='flex items-center justify-between gap-4 py-4'
    >
      <Link
        href='/plugins'
        className='font-sans text-2xl font-bold tracking-normal text-black dark:text-white'
      >
        fern.
      </Link>

      <nav className='flex items-center gap-2 sm:gap-4'>
        <Link
          href='/cart'
          className='rounded-full px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10'
        >
          View Cart
        </Link>
        <Link
          href='/account/downloads'
          className='rounded-full px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10'
        >
          Account
        </Link>
        <ThemeToggle className='h-9 w-9 text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/10 [&_svg]:h-4 [&_svg]:w-4' />
      </nav>
    </AppHeader>
  );
};

PluginsNavbar.displayName = 'PluginsNavbar';

export { PluginsNavbar };
