'use client';

import { ThemeToggle } from '~ui/atoms/theme/theme-toggle';
import { AppHeader } from '~ui/molecules/app-header';
import { BlogLogo } from './blog-logo';

export const BlogHeader = () => {
  return (
    <AppHeader innerClassName='flex gap-x-2 justify-between py-0.5'>
      <BlogLogo />

      <nav className='flex items-center gap-x-2'>
        <ThemeToggle />
      </nav>
    </AppHeader>
  );
};
