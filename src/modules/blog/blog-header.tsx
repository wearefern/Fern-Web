'use client';

<<<<<<< Updated upstream
import { BLOG_PATH } from '~constants/index';
=======
import Link from 'next/link';

import { BlogLogo } from '~modules/blog/blog-logo';
>>>>>>> Stashed changes

import { ThemeToggle } from '~ui/atoms/theme/theme-toggle';
import { AppHeader } from '~ui/molecules/app-header';
import { FernLogo } from '../../components/ui/atoms/fern-logo';

/* -------------------------------------------------------------------------------------------------
 * BlogHeader
 * -----------------------------------------------------------------------------------------------*/

const BlogHeader = () => {
  return (
    <AppHeader innerClassName='flex gap-x-2 justify-between'>
<<<<<<< Updated upstream
      <FernLogo href={BLOG_PATH} title='Blog' />
=======
      <Link title='Fern' href='/'>
        <BlogLogo />
      </Link>
>>>>>>> Stashed changes

      <nav className='flex items-center gap-x-2'>
        <ThemeToggle />
      </nav>
    </AppHeader>
  );
};

BlogHeader.displayName = 'BlogHeader';

/* -----------------------------------------------------------------------------------------------*/

export { BlogHeader };
