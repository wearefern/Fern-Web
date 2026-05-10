'use client';

import { useEffect, useState } from 'react';

import { cn } from '~utils/style';

/* -------------------------------------------------------------------------------------------------
 * AnimatedWord - Rolodex / Slot Machine style word animation
 * -----------------------------------------------------------------------------------------------*/

interface AnimatedWordProps {
  words: string[];
  interval?: number;
  className?: string;
}

const AnimatedWord = ({ words, interval = 3000, className }: AnimatedWordProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      
      // Wait for exit animation (half of interval)
      setTimeout(() => {
        setDisplayIndex((prev: number) => (prev + 1) % words.length);
      }, 400);

      // Reset animation state
      setTimeout(() => {
        setIsAnimating(false);
      }, 800);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span
      className={cn(
        'relative inline-flex items-center',
        'h-[1.2em] align-bottom',
        className
      )}
      style={{
        perspective: '1000px',
      }}
    >
      <span
        className="relative inline-flex items-center"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Current word */}
        <span
          className={cn(
            'inline-block transition-transform duration-500 ease-out',
            isAnimating && 'animate-rolodex-exit'
          )}
          style={{
            transformOrigin: 'center bottom',
            backfaceVisibility: 'hidden',
            transform: isAnimating ? 'rotateX(-90deg)' : 'rotateX(0deg)',
            opacity: isAnimating ? 0 : 1,
          }}
        >
          {words[displayIndex]}
        </span>

        {/* Next word (flips up from bottom) */}
        <span
          className={cn(
            'absolute left-0 top-0 inline-flex items-center',
            'transition-transform duration-500 ease-out'
          )}
          style={{
            transformOrigin: 'center bottom',
            backfaceVisibility: 'hidden',
            transform: isAnimating ? 'rotateX(0deg)' : 'rotateX(90deg)',
            opacity: isAnimating ? 1 : 0,
          }}
        >
          {words[(displayIndex + 1) % words.length]}
        </span>
      </span>
    </span>
  );
};

AnimatedWord.displayName = 'AnimatedWord';

/* -----------------------------------------------------------------------------------------------*/

export { AnimatedWord };
