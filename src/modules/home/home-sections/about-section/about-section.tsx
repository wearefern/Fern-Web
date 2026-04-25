'use client';

import { Typography } from '~ui/atoms/typography';
import { SectionContainer } from '~ui/molecules/section/section-container';
import { SectionHeader } from '~ui/molecules/section/section-header';

/* -------------------------------------------------------------------------------------------------
 * AboutSection
 * -----------------------------------------------------------------------------------------------*/

const AboutSection = () => {
  return (
    <div id='process'>
      <SectionContainer>
        <SectionHeader
          title='Process'
          subtitle='How Fern moves from planning to reliable delivery.'
          className='pb-16 sm:pb-24'
        />

        <Typography
          className='mx-auto max-w-5xl text-center text-xl leading-9 sm:text-2xl sm:leading-10'
          balance
          asChild
        >
          <h3>
            A lean delivery process built to reduce ambiguity, keep momentum,
            and turn product decisions into maintainable software.
          </h3>
        </Typography>

        <div className='mt-16 grid grid-cols-1 gap-6 sm:mt-24 sm:grid-cols-2 sm:gap-8 xl:mt-28 xl:grid-cols-4 xl:gap-10'>
          {steps.map((step, index) => (
            <div
              key={step.title}
              className='rounded-[1.75rem] border border-ctx-primary-fg-hint bg-ctx-primary px-6 py-7 sm:px-8 sm:py-9'
            >
              <Typography
                variant='sm'
                color='secondary'
                weight='bold'
                prose={false}
                className='uppercase tracking-[0.2em]'
              >
                {`0${index + 1}`}
              </Typography>

              <Typography
                variant='heading'
                weight='medium'
                prose={false}
                className='mt-6 text-[1.35rem] leading-8'
              >
                {step.title}
              </Typography>

              <Typography color='secondary' className='mt-4 leading-8'>
                {step.description}
              </Typography>
            </div>
          ))}
        </div>
      </SectionContainer>
    </div>
  );
};

AboutSection.displayName = 'AboutSection';

const steps = [
  {
    title: 'Discover',
    description:
      'We align on the product goal, business constraints, users, and the shortest path to a useful release.',
  },
  {
    title: 'Design',
    description:
      'We shape the experience, define system behavior, and remove ambiguity before engineering effort scales.',
  },
  {
    title: 'Build',
    description:
      'We implement the product with clear architecture, tight feedback loops, and production-focused engineering.',
  },
  {
    title: 'Refine',
    description:
      'We optimize, stabilize, and iterate after launch so the product keeps improving as the business grows.',
  },
];

/* -----------------------------------------------------------------------------------------------*/

export { AboutSection };
