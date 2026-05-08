'use client';

import {
  HTMLMotionProps,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useVelocity,
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
    const scrollVelocity = useVelocity(scrollY);
    const scrollDistanceStartY = useMotionValue(0);

    useEffect(() => {
      setMounted(true);
    }, []);

    useMotionValueEvent(scrollVelocity, 'change', (latest) => {
      if (!mounted) return;
      // If scroll is slow enough, the velocity will reset `scrollDistanceStartY`
      // to avoid displaying normal view immediately when user scrolls up.
      if (latest * 10000 === 0) {
        scrollDistanceStartY.set(scrollY.get());
      }
    });

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

      const MIN_SCROLL_OFFSET_COMPACT_VIEW = 50;
      const MIN_SCROLL_OFFSET_NORMAL_VIEW = 200;

      const previous = scrollY.getPrevious() ?? 0;
      const delta = latest - previous;
      const forceNormalView = latest <= vhToPx(30);

      let distance = latest - scrollDistanceStartY.get();

      if (forceNormalView) {
        setCompact(false);
      } else {
        const directionChanged = delta * distance < 0;
        if (directionChanged) {
          scrollDistanceStartY.set(latest);
          distance = 0;
        }

        const scrollOffset = Math.abs(distance);
        const isScrollingDown = delta > 0;

        setCompact((isNowCompact) =>
          isScrollingDown
            ? scrollOffset >= MIN_SCROLL_OFFSET_COMPACT_VIEW
            : isNowCompact && scrollOffset < MIN_SCROLL_OFFSET_NORMAL_VIEW
        );
      }
    });

    return (
      <motion.header
        layout
        ref={ref}
        variants={{
          compact: {
            padding: '0.5rem 0',
            background: 'rgba(var(--ctx-primary-bg), 0.9)',
            backdropFilter: 'blur(12px)',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            margin: '0.75rem',
            maxWidth: 'calc(100% - 1.5rem)',
          },
          normal: {
            padding: '2.5rem 0',
            background: 'transparent',
            backdropFilter: 'none',
            borderRadius: '0',
            boxShadow: 'none',
            margin: '0',
            maxWidth: '100%',
          },
        }}
        initial='normal'
        animate={mounted && compact ? 'compact' : 'normal'}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        className={cn(
          'sticky top-0 z-50 flex w-full',
          className
        )}
        {...rest}
      >
        <div
          className={cn(
            'layout-width-limiter layout-padding flex w-full items-center',
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
