'use client';

import { MotionConfig, motion } from 'framer-motion';
import Link from 'next/link';

import { BLOG_PATH } from '~constants/index';

import { LAYOUT_ID_HOME_LOGO } from '~ui/atoms/motion';
import { ThemeToggle } from '~ui/atoms/theme/theme-toggle';
import { AppHeader } from '~ui/molecules/app-header';
import { Logo } from '~ui/widgets/logo';

/* -------------------------------------------------------------------------------------------------
 * HomeHeader
 * -----------------------------------------------------------------------------------------------*/

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className='text-xs font-medium text-ctx-primary-fg-solid transition-opacity hover:opacity-70 sm:text-sm'
  >
    {children}
  </Link>
);

const HomeHeader = () => {
  return (
    <AppHeader
      mode='compact'
      className='absolute top-0 bg-transparent from-transparent to-transparent backdrop-blur-0'
      innerClassName='flex justify-between gap-x-2 pt-5 sm:pt-6'
    >
      <Link title='Home' href={'/'}>
        <Logo width={58} layoutId={LAYOUT_ID_HOME_LOGO} />
      </Link>

      <MotionConfig transition={{ type: 'spring', duration: 0.5, bounce: 0 }}>
        <motion.nav layout='position' className='flex items-center gap-x-4 sm:gap-x-5'>
          <NavLink href='/#projects'>Services.</NavLink>
          <NavLink href='/#about'>Company.</NavLink>
          <NavLink href={BLOG_PATH}>Insights.</NavLink>
          <NavLink href='#contact'>Contact.</NavLink>

          <ThemeToggle className='p-1 [&_svg]:h-4 [&_svg]:w-4 sm:[&_svg]:h-5 sm:[&_svg]:w-5' />
        </motion.nav>
      </MotionConfig>
    </AppHeader>
  );
};

HomeHeader.displayName = 'HomeHeader';

/* -----------------------------------------------------------------------------------------------*/

export { HomeHeader };
