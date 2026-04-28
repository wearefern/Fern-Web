'use client';

import Link from 'next/link';

import { BLOG_PATH } from '~constants/index';

import { ThemeToggle } from '~ui/atoms/theme/theme-toggle';
import { AppHeader } from '~ui/molecules/app-header';
import { FernLogo } from '../../components/ui/atoms/fern-logo';

/* -------------------------------------------------------------------------------------------------
 * BlogHeader
 * -----------------------------------------------------------------------------------------------*/

const BlogHeader = () => {
  return (
    <AppHeader innerClassName='flex gap-x-2 justify-between'>
      <Link title='Blog' href={BLOG_PATH}>
        <FernLogo />
      </Link>

      <nav className='flex items-center gap-x-2'>
        <ThemeToggle />
      </nav>
    </AppHeader>
  );
};

BlogHeader.displayName = 'BlogHeader';

/* -----------------------------------------------------------------------------------------------*/

export { BlogHeader };
