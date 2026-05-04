'use client';

import { BLOG_PATH } from '~constants/index';
import Link from 'next/link';

import { ThemeToggle } from '~ui/atoms/theme/theme-toggle';
import { AppHeader } from '~ui/molecules/app-header';
import { BlogLogo } from './blog-logo';

export const BlogHeader = () => {
  return (
    <AppHeader innerClassName='flex gap-x-2 justify-between'>
      <Link href={BLOG_PATH} title='Blog'>
        <BlogLogo />
      </Link>

      <nav className='flex items-center gap-x-2'>
        <ThemeToggle />
      </nav>
    </AppHeader>
  );
};