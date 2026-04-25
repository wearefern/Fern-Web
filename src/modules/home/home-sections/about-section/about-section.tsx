'use client';

import Link from 'next/link';

import { BLOG_PATH } from '~constants/index';

import { AboutSectionHeadline } from '~modules/home/home-sections/about-section/about-section-headline';

import { ButtonWithVideo } from '~ui/atoms/button';
import { Typography } from '~ui/atoms/typography';
import { SectionContainer } from '~ui/molecules/section/section-container';
import { SectionHeader } from '~ui/molecules/section/section-header';
import { InterestsSpotlight } from '~ui/widgets/interests-spotlight';

/* -------------------------------------------------------------------------------------------------
 * AboutSection
 * -----------------------------------------------------------------------------------------------*/

const AboutSection = () => {
  return (
    <div id='about'>
      <SectionContainer>
        <SectionHeader
          title='Company'
          subtitle='How Fern works across the software lifecycle.'
        />

        <AboutSectionHeadline />

        <div className='flex justify-between gap-x-8 md:gap-x-24'>
          <div className='flex-1'>
            <Typography balance>
              Fern works with founders, operators, and product teams that need
              reliable execution. We prioritize understandable architecture,
              pragmatic scope, and delivery systems that stay healthy as the
              business grows.
            </Typography>

            <ButtonWithVideo
              className='mt-6'
              whenVideo={{ inverse: true }}
              variant='outline'
              asChild
              videoFileName='read-about-google-code-in'
            >
              <Link href={BLOG_PATH}>Read our insights</Link>
            </ButtonWithVideo>
          </div>

          <div className='flex-1'>
            <Typography>
              Our approach covers discovery, design, implementation,
              integration, optimization, and support so teams can move from idea
              to production with one software partner.
            </Typography>
          </div>
        </div>
      </SectionContainer>

      <InterestsSpotlight className='mt-content-sm sm:mt-content' />
    </div>
  );
};

AboutSection.displayName = 'AboutSection';

/* -----------------------------------------------------------------------------------------------*/

export { AboutSection };
