'use client';

import {
  HTMLMotionProps,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { ReactNode, forwardRef, useEffect, useState } from 'react';

import { cn, vhToPx } from '~utils/style';

export interface AppHeaderProps extends HTMLMotionProps<'header'> {
  innerClassName?: string;
  children?: ReactNode;
  mode?: 'compact' | 'normal' | 'dynamic';
}

const AppHeader = forwardRef<HTMLDivElement, AppHeaderProps>(
  ({ className, innerClassName, children, mode = 'dynamic', ...rest }, ref) => {
    const [mounted, setMounted] = useState(false);
    const [compact, setCompact] = useState(false);

    const { scrollY } = useScroll();

    useEffect(() => {
      setMounted(true);
    }, []);

    useMotionValueEvent(scrollY, 'change', (latest) => {
      if (!mounted) return;
      if (mode === 'compact') {
        setCompact(true);
        return;
      }
      if (mode === 'normal') {
        setCompact(false);
        return;
      }

      const SCROLL_THRESHOLD = 100;
      const forceNormalView = latest <= vhToPx(30);

      if (forceNormalView) {
        setCompact(false);
      } else {
        setCompact(latest > SCROLL_THRESHOLD);
      }
    });

    return (
      <motion.header
        layout
        ref={ref}
        variants={{
          compact: {
            padding: '0.75rem 2rem',
            background: 'rgba(var(--ctx-primary-bg), 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: '999px',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(var(--ctx-primary-fg-decorative), 0.1)',
            maxWidth: 'min(92vw, 1000px)',
            margin: '1rem auto',
          },
          normal: {
            padding: '2.5rem 0',
            background: 'transparent',
            backdropFilter: 'none',
            borderRadius: '0',
            boxShadow: 'none',
            border: 'none',
            maxWidth: '100%',
            margin: '0',
          },
        }}
        initial='normal'
        animate={mounted && compact ? 'compact' : 'normal'}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cn(
          'sticky top-0 z-50 flex w-full',
          className
        )}
        {...rest}
      >
        <div
          className={cn(
            'flex w-full items-center justify-between',
            innerClassName
          )}
        >
          {children}
        </div>
      </motion.header>
    );
  }
);

AppHeader.displayName = 'AppHeader';

export { AppHeader };
