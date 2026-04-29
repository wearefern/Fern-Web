'use client';

import Link from 'next/link';

import { ThemeToggle } from '~ui/atoms/theme/theme-toggle';
import { AppHeader } from '~ui/molecules/app-header';

const PluginsNavbar = () => {
  return (
    <AppHeader
      mode='compact'
      className='border-b border-gray-200 bg-white from-white to-white backdrop-blur-xl'
      innerClassName='flex items-center justify-between gap-4 py-4'
    >
      <Link
        href='/plugins'
        className='font-sans text-2xl font-bold tracking-normal text-black'
      >
        fern.
      </Link>

      <nav className='flex items-center gap-2 sm:gap-4'>
        <Link
          href='/cart'
          className='rounded-full px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-100'
        >
          View Cart
        </Link>
        <Link
          href='/account/downloads'
          className='rounded-full px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-100'
        >
          Account
        </Link>
        <ThemeToggle className='h-9 w-9 text-black hover:bg-gray-100 [&_svg]:h-4 [&_svg]:w-4' />
      </nav>
    </AppHeader>
  );
};

PluginsNavbar.displayName = 'PluginsNavbar';

export { PluginsNavbar };
