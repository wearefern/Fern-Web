'use client';

import { Typography } from '~ui/atoms/typography';

/* -------------------------------------------------------------------------------------------------
 * HeroSection
 * -----------------------------------------------------------------------------------------------*/

const HeroSection = () => {
  return (
    <section className='layout-width-limiter layout-padding flex w-full items-center'>
      <figure className='flex flex-col'>
        <Typography variant='hero' asChild>
          <h1>
            <p>Insights for teams</p>
            <p>building better</p>
            <p>software systems.</p>
          </h1>
        </Typography>

        <Typography variant='body-sm' className='mt-8' asChild>
          <h2>
            Fern shares articles, talks, and implementation notes on product
            engineering, architecture, user experience, and software delivery.
          </h2>
        </Typography>
      </figure>
    </section>
  );
};

HeroSection.displayName = 'HeroSection';

/* -----------------------------------------------------------------------------------------------*/

export { HeroSection };
