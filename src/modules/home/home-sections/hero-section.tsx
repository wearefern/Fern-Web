'use client';

import { Typography } from '~ui/atoms/typography';

export const HeroSection = () => {
  return (
    <section className='layout-width-limiter layout-padding relative flex min-h-[420px] w-full items-center overflow-hidden sm:min-h-[520px]'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-4 top-10 h-[340px] sm:inset-x-[5vw] sm:top-12 sm:h-[430px] 2xl:inset-x-0'
      >
        <div className='absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_center,hsla(var(--base-fg-solid)/0.12)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(120deg,transparent_0%,black_30%,black_76%,transparent_100%)]' />
        <div className='absolute bottom-6 right-0 h-32 w-[58%] opacity-25 [background-image:linear-gradient(135deg,hsla(var(--base-fg-solid)/0.14)_1px,transparent_1px)] [background-size:14px_14px] [mask-image:linear-gradient(to_right,transparent_0%,black_24%,black_100%)]' />
        <div className='absolute left-0 top-16 h-px w-full bg-ctx-primary-fg-decorative' />
        <div className='absolute left-8 top-28 h-px w-[72%] bg-ctx-primary-fg-decorative sm:left-16' />
        <div className='absolute left-[30%] top-36 h-px w-[34%] bg-ctx-primary-fg-decorative' />
        <div className='absolute left-20 top-44 h-px w-[46%] bg-ctx-primary-fg-decorative sm:left-40' />
        <div className='absolute right-[12%] top-56 h-px w-[24%] bg-ctx-primary-fg-decorative' />
        <div className='absolute bottom-10 left-20 h-px w-[calc(100%-5rem)] bg-ctx-primary-fg-decorative sm:left-40 sm:w-[calc(100%-10rem)]' />
        <div className='absolute bottom-24 right-0 h-px w-[52%] bg-ctx-primary-fg-decorative' />
        <div className='absolute bottom-36 left-[18%] h-px w-[38%] bg-ctx-primary-fg-decorative' />
        <div className='absolute left-20 top-0 h-full w-px bg-ctx-primary-fg-decorative sm:left-40' />
        <div className='absolute left-[28%] top-28 h-[42%] w-px bg-ctx-primary-fg-decorative' />
        <div className='absolute left-[52%] top-16 h-[62%] w-px bg-ctx-primary-fg-decorative' />
        <div className='absolute left-[68%] top-32 h-[38%] w-px bg-ctx-primary-fg-decorative' />
        <div className='absolute right-0 top-16 h-[72%] w-px bg-ctx-primary-fg-decorative' />
        <div className='absolute right-0 top-16 h-[72%] w-[64%] border border-ctx-primary-fg-decorative' />
        <div className='absolute right-[34%] top-16 h-12 w-px bg-ctx-primary-fg-decorative' />
        <div className='absolute right-[14%] top-[46%] h-12 w-px bg-ctx-primary-fg-decorative' />
        <div className='absolute bottom-0 right-[18%] h-12 w-px bg-ctx-primary-fg-decorative sm:h-20' />
        <div className='absolute bottom-10 right-[38%] h-3 w-3 border border-ctx-primary-fg-decorative' />
        <div className='absolute left-6 top-6 h-3 w-3 border border-ctx-primary-fg-decorative sm:left-10 sm:top-8' />
        <div className='absolute right-[28%] top-6 h-3 w-16 border-y border-ctx-primary-fg-decorative sm:w-24' />
        <div className='absolute bottom-28 left-[34%] h-3 w-20 border-y border-ctx-primary-fg-decorative sm:w-28' />
        <div className='absolute left-[14%] top-[38%] h-4 w-4 before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:bg-ctx-primary-fg-decorative before:content-[""] after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:bg-ctx-primary-fg-decorative after:content-[""]' />
        <div className='absolute right-[8%] top-[30%] h-4 w-4 before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:bg-ctx-primary-fg-decorative before:content-[""] after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:bg-ctx-primary-fg-decorative after:content-[""]' />
        <div className='absolute bottom-[18%] left-[58%] h-4 w-4 before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:bg-ctx-primary-fg-decorative before:content-[""] after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:bg-ctx-primary-fg-decorative after:content-[""]' />
        <div className='absolute right-6 top-8 h-8 w-8 border-r border-t border-ctx-primary-fg-decorative sm:right-10' />
        <div className='absolute bottom-6 left-6 h-8 w-8 border-b border-l border-ctx-primary-fg-decorative sm:left-10' />
        <div className='absolute bottom-[32%] right-[22%] flex h-10 w-16 items-end justify-between'>
          <span className='h-3 w-px bg-ctx-primary-fg-decorative' />
          <span className='h-6 w-px bg-ctx-primary-fg-decorative' />
          <span className='h-4 w-px bg-ctx-primary-fg-decorative' />
          <span className='h-8 w-px bg-ctx-primary-fg-decorative' />
        </div>
      </div>

      <figure className='relative z-10 flex flex-col'>
        <Typography
          variant='hero'
          className='max-w-none bg-ctx-primary/80 py-2 pr-4 !text-4xl !leading-tight sm:!text-6xl sm:!leading-[1.05] lg:!text-7xl'
          asChild
        >
          <h1>
            <p>Built to rank.</p>
            <p>Designed to convert.</p>
            <p>Made to scale.</p>
          </h1>
        </Typography>

        <Typography
          variant='body-sm'
          color='secondary'
          className='mt-6 max-w-2xl bg-ctx-primary/80 py-1 pr-4 text-base leading-7 sm:ml-16 sm:mt-8 sm:text-lg sm:leading-8 lg:ml-28'
          asChild
        >
          <p>
            From custom software to cloud-based systems — we engineer the tools
            that move your business forward.
          </p>
        </Typography>
      </figure>
    </section>
  );
};
