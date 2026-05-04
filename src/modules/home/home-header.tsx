'use client';

import { MotionConfig, motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';

import { BLOG_PATH, PLUGINS_PATH } from '~constants/index';

import { LAYOUT_ID_HOME_LOGO } from '~ui/atoms/motion';
import { ThemeToggle } from '~ui/atoms/theme/theme-toggle';
import { AppHeader } from '~ui/molecules/app-header';
import { AuthNavControls } from '../../components/auth/auth-nav-controls';
import { FernLogo } from '../../components/ui/atoms/fern-logo';

/* -------------------------------------------------------------------------------------------------
 * HomeHeader
 * -----------------------------------------------------------------------------------------------*/

interface NavLinkProps {
  href: string;
  children: ReactNode;
  emphasize?: boolean;
}

const NavLink = ({ href, children, emphasize }: NavLinkProps) => (
  <motion.div whileHover='hover' initial='rest' animate='rest' className='relative'>
    <Link
      href={href}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full px-1.5 py-1 text-xs font-medium sm:text-sm ${
        emphasize
          ? 'min-w-[5.75rem] border border-ctx-primary-fg-decorative/80 px-3 py-1.5 text-ctx-primary-fg-solid'
          : 'text-ctx-primary-fg-solid'
      }`}
    >
      <motion.span
        variants={{
          rest: { y: 0 },
          hover: { y: emphasize ? -1 : -2 },
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        className={`relative z-10 transition-colors duration-200 ${
          emphasize ? 'group-hover:text-ctx-button-fg-solid' : ''
        }`}
      >
        {children}
      </motion.span>

      {emphasize ? (
        <>
          <motion.span
            aria-hidden='true'
            variants={{
              rest: { scaleX: 0, opacity: 0.1 },
              hover: { scaleX: 1, opacity: 1 },
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className='absolute inset-0 origin-left rounded-full bg-ctx-button'
          />
          <motion.span
            aria-hidden='true'
            variants={{
              rest: { opacity: 1 },
              hover: { opacity: 0 },
            }}
            transition={{ duration: 0.16 }}
            className='absolute inset-0 rounded-full border border-ctx-primary-fg-decorative/80'
          />
        </>
      ) : (
        <>
          <motion.span
            aria-hidden='true'
            variants={{
              rest: { scaleX: 0, opacity: 0 },
              hover: { scaleX: 1, opacity: 1 },
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className='absolute bottom-0.5 left-1.5 right-1.5 h-px origin-left bg-ctx-primary-fg-solid'
          />
          <motion.span
            aria-hidden='true'
            variants={{
              rest: { y: '100%' },
              hover: { y: 0 },
            }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className='absolute inset-x-0 bottom-0 h-full rounded-full bg-ctx-secondary/70'
          />
        </>
      )}
    </Link>
  </motion.div>
);

const HomeHeader = () => {
  return (
    <AppHeader
      mode='compact'
      className='absolute top-0 bg-transparent from-transparent to-transparent backdrop-blur-0'
      innerClassName='flex justify-between gap-x-2 pt-5 sm:pt-6'
    >
      <FernLogo width={58} layoutId={LAYOUT_ID_HOME_LOGO} title='Home' />

      <MotionConfig transition={{ type: 'spring', duration: 0.5, bounce: 0 }}>
        <motion.nav layout='position' className='flex items-center gap-x-4 sm:gap-x-5'>
          <NavLink href='/#projects'>Services.</NavLink>
          <NavLink href='/#process'>Process.</NavLink>
          <NavLink href={PLUGINS_PATH}>Plugins.</NavLink>
          <NavLink href={BLOG_PATH}>Insights.</NavLink>
          <NavLink href='/tools'>Tools.</NavLink>
          <NavLink href='/contact' emphasize>
            Contact.
          </NavLink>

          <AuthNavControls showAccountLink={false} userButtonAvatarClassName='h-7 w-7 sm:h-8 sm:w-8' />
          <ThemeToggle className='p-1 [&_svg]:h-4 [&_svg]:w-4 sm:[&_svg]:h-5 sm:[&_svg]:w-5' />
        </motion.nav>
      </MotionConfig>
    </AppHeader>
  );
};

HomeHeader.displayName = 'HomeHeader';

/* -----------------------------------------------------------------------------------------------*/

export { HomeHeader };
