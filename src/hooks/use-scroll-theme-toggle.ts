'use client';

import { RefObject, useEffect } from 'react';

interface UseScrollThemeToggleOptions {
  targetRef: RefObject<HTMLElement | null>;
  className?: string;
}

const INTERSECTION_THRESHOLD = 0.35;

export const useScrollThemeToggle = ({
  targetRef,
  className = 'services-theme-active',
}: UseScrollThemeToggleOptions) => {
  useEffect(() => {
    const section = targetRef.current;

    if (!section || typeof window === 'undefined') {
      return;
    }

    const root = document.documentElement;
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    const setThemeActive = (active: boolean) => {
      root.classList.toggle(className, active);
    };

    const createObserverFallback = () => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setThemeActive(entry.intersectionRatio >= INTERSECTION_THRESHOLD);
        },
        {
          threshold: [0, 0.2, INTERSECTION_THRESHOLD, 0.5, 0.8],
          rootMargin: '-12% 0px -18% 0px',
        }
      );

      observer.observe(section);

      return () => {
        observer.disconnect();
        setThemeActive(false);
      };
    };

    let cleanup = () => setThemeActive(false);
    let cancelled = false;

    const setup = async () => {
      if (reducedMotionQuery.matches) {
        cleanup = createObserverFallback();
        return;
      }

      try {
        const gsapModule = await import('gsap');
        const scrollTriggerModule = await import('gsap/ScrollTrigger');

        if (cancelled) {
          return;
        }

        const gsap = gsapModule.gsap;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

        gsap.registerPlugin(ScrollTrigger);

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: 'top 72%',
          end: 'bottom 42%',
          onEnter: () => setThemeActive(true),
          onEnterBack: () => setThemeActive(true),
          onLeave: () => setThemeActive(false),
          onLeaveBack: () => setThemeActive(false),
        });

        cleanup = () => {
          trigger.kill();
          setThemeActive(false);
        };
      } catch {
        if (!cancelled) {
          cleanup = createObserverFallback();
        }
      }
    };

    void setup();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [className, targetRef]);
};
