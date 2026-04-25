'use client';

import { ComponentPropsWithoutRef, useEffect, useRef } from 'react';

import { cn } from '~utils/style';

export interface GsapRevealProps extends ComponentPropsWithoutRef<'div'> {
  delay?: number;
  duration?: number;
  start?: string;
  y?: number;
}

const GsapReveal = ({
  className,
  children,
  delay = 0,
  duration = 0.9,
  start = 'top 80%',
  y = 48,
  ...rest
}: GsapRevealProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const run = async () => {
      const gsapModule = await import('gsap');
      const scrollTriggerModule = await import('gsap/ScrollTrigger');

      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        if (!ref.current) {
          return;
        }

        gsap.set(ref.current, {
          opacity: 0,
          y,
        });

        gsap.to(ref.current, {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: ref.current,
            start,
            once: true,
          },
        });
      }, ref);

      cleanup = () => ctx.revert();
    };

    void run();

    return () => cleanup?.();
  }, [delay, duration, start, y]);

  return (
    <div ref={ref} className={cn(className)} {...rest}>
      {children}
    </div>
  );
};

GsapReveal.displayName = 'GsapReveal';

export { GsapReveal };
