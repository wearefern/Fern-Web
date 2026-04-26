'use client';

import { motion } from 'framer-motion';

import { Typography } from '~ui/atoms/typography';

export const HeroSection = () => {
  return (
    <section className='layout-width-limiter layout-padding relative flex min-h-screen w-full items-start overflow-hidden pt-[22vh] sm:pt-[24vh]'>
      <motion.div
        aria-hidden='true'
        animate={{
          x: [0, 28, 0],
          y: [0, -18, 0],
          scale: [1, 1.04, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className='pointer-events-none absolute left-[6%] top-[18vh] h-52 w-52 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.14),_transparent_68%)] blur-3xl'
      />
      <motion.div
        aria-hidden='true'
        animate={{
          x: [0, -24, 0],
          y: [0, 24, 0],
          scale: [1, 1.06, 1],
        }}
        transition={{
          duration: 17,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className='pointer-events-none absolute right-[8%] top-[30vh] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_rgba(17,24,39,0.08),_transparent_70%)] blur-3xl'
      />

      <div className='relative flex w-full max-w-[88rem] flex-col items-start'>
        <h1
          aria-label='Software systems businesses rely on when growth gets real.'
          className='w-full max-w-[64rem]'
        >
          <motion.span
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className='relative block max-w-none text-pretty font-sans text-[3.35rem] font-medium leading-[0.95] tracking-[-0.065em] sm:text-[4.85rem] lg:text-[5.55rem] xl:text-[6.15rem] 2xl:text-[6.45rem]'
          >
            <span
              aria-hidden='true'
              className='pointer-events-none absolute inset-0 translate-x-[0.018em] translate-y-[0.025em] bg-[repeating-linear-gradient(135deg,rgba(17,24,39,0.12)_0,rgba(17,24,39,0.12)_2px,transparent_2px,transparent_12px)] bg-clip-text text-transparent opacity-55'
            >
              Software systems
              <br />
              businesses rely on
              <br />
              when growth gets
              <br />
              real.
            </span>

            <span
              aria-hidden='true'
              className='pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.42))] bg-clip-text text-transparent opacity-50 blur-[0.4px]'
            >
              Software systems
              <br />
              businesses rely on
              <br />
              when growth gets
              <br />
              real.
            </span>

            <span className='relative text-ctx-primary-fg-primary [text-shadow:0_1px_0_rgba(255,255,255,0.14)]'>
              Software systems
              <br />
              businesses rely on
              <br />
              when growth gets
              <br />
              real.
            </span>
          </motion.span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.85,
            delay: 0.18,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Typography
            variant='body'
            color='secondary'
            className='mt-6 max-w-3xl text-base !leading-8 sm:mt-8 sm:text-[1.05rem]'
            asChild
          >
            <p>
              Fern designs and builds modern digital products, internal tools,
              and automation systems for teams that need clarity, speed, and
              durable execution.
            </p>
          </Typography>
        </motion.div>
      </div>
    </section>
  );
};
