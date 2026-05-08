'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '~ui/atoms/button';
import { Typography } from '~ui/atoms/typography';

import { cn } from '~utils/style';

interface ComingSoonProps {
  className?: string;
  title: string;
  message?: string;
}

const ComingSoon = ({ className, title, message }: ComingSoonProps) => {
  const defaultMessage = `${title} by Fern are currently in development.`;

  return (
    <main className={cn('min-h-screen bg-ctx-primary', className)}>
      <div className='layout-width-limiter layout-padding flex min-h-screen flex-col items-center justify-center py-20'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className='max-w-2xl text-center'
        >
          <Typography
            variant='hero'
            weight='medium'
            prose={false}
            className='text-pretty text-[4rem] leading-[0.92] tracking-[-0.07em] sm:text-[5.75rem] lg:text-[7rem]'
          >
            {title}
          </Typography>

          <Typography
            variant='body'
            color='secondary'
            className='mx-auto mt-6 max-w-xl text-lg leading-8 sm:text-xl'
          >
            {message || defaultMessage}
          </Typography>

          <div className='mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center'>
            <Button className='rounded-xl px-6 py-4 text-sm font-medium' asChild>
              <Link href='/contact'>Contact Fern</Link>
            </Button>

            <Button
              variant='outline'
              className='rounded-xl px-6 py-4 text-sm font-medium'
              asChild
            >
              <Link href='/'>Back to Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

ComingSoon.displayName = 'ComingSoon';

export { ComingSoon };
export type { ComingSoonProps };
