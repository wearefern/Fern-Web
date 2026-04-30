'use client';

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
      <FernLogo href={BLOG_PATH} title='Blog' />

      <nav className='flex items-center gap-x-2'>
        <ThemeToggle />
      </nav>
    </AppHeader>
  );
};

BlogHeader.displayName = 'BlogHeader';

/* -----------------------------------------------------------------------------------------------*/

export { BlogHeader };
