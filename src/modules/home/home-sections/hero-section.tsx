'use client';

import Link from 'next/link';

import { Button } from '~ui/atoms/button';
import { Typography } from '~ui/atoms/typography';

export const HeroSection = () => {
  return (
    <section className='layout-width-limiter layout-padding flex min-h-screen w-full items-start pt-[24vh] sm:pt-[26vh]'>
      <div className='flex w-full max-w-[92rem] flex-col items-start'>
        <Typography
          variant='hero'
          weight='medium'
          className='max-w-none text-pretty !text-[3.5rem] !leading-[0.98] sm:!text-[5.4rem] lg:!text-[6.4rem] xl:!text-[6.9rem]'
          asChild
        >
          <h1>
            Software systems
            <br />
            businesses rely on
            <br />
            when growth gets
            <br />
            real.
          </h1>
        </Typography>

        <Typography
          variant='body'
          color='secondary'
          className='mt-6 max-w-4xl text-base !leading-8 sm:mt-8 sm:text-xl'
          asChild
        >
          <p>
            Fern designs and builds modern digital products, internal tools,
            and automation systems for teams that need clarity, speed, and
            durable execution.
          </p>
        </Typography>

        <Button className='mt-8 rounded-md px-6 py-4 text-sm font-medium sm:mt-10 sm:px-7'>
          <Link href='/#projects'>View Our Work &#8594;</Link>
        </Button>
      </div>
    </section>
  );
};
