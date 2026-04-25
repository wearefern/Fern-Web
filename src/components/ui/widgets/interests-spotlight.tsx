import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ComponentPropsWithoutRef, useCallback } from 'react';

import { FadeOverlay } from '~ui/atoms/fade-overlay';
import { Typography } from '~ui/atoms/typography';
import { ParallaxMarquee } from '~ui/organisms/parallax-marquee';

import { cn } from '~utils/style';

/* -------------------------------------------------------------------------------------------------
 * InterestsSpotlight
 * -----------------------------------------------------------------------------------------------*/

interface InterestsSpotlightProps extends ComponentPropsWithoutRef<'div'> {}

const InterestsSpotlight = ({
  className,
  ...rest
}: InterestsSpotlightProps) => {
  const renderOuterItem = useCallback(
    (label: string) => <Typography key={label}>{label}</Typography>,
    []
  );

  const renderInnerItem = useCallback(
    (label: string) => (
      <Typography color='secondary' key={label}>
        {label}
      </Typography>
    ),
    []
  );

  return (
    <section className={cn('flex flex-col', className)} {...rest}>
      <div className='relative'>
        <VisuallyHidden aria-label='Interests spotlight'>
          {professional.map(renderInnerItem)}
        </VisuallyHidden>

        <FadeOverlay
          aria-hidden
          overlayProps={{ className: 'bg-gradient-to-r left-0 w-[40vw]' }}
        >
          <FadeOverlay
            overlayProps={{
              className: 'bg-gradient-to-l w-[40vw] left-[unset] right-0',
            }}
          >
            <ParallaxMarquee baseVelocity={1}>
              {professional.map(renderOuterItem)}
            </ParallaxMarquee>

            <ParallaxMarquee baseVelocity={-2}>
              {professional.map(renderInnerItem)}
            </ParallaxMarquee>

            <ParallaxMarquee baseVelocity={-2}>
              {personal.map(renderInnerItem)}
            </ParallaxMarquee>

            <ParallaxMarquee baseVelocity={1}>
              {personal.map(renderOuterItem)}
            </ParallaxMarquee>
          </FadeOverlay>
        </FadeOverlay>
      </div>
    </section>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const professional = [
  'Product Strategy',
  'Solution Architecture',
  'Web Platforms',
  'Mobile Apps',
  'Cloud Systems',
  'API Design',
  'React',
  'Next.js',
  'TypeScript',
  'Design Systems',
  'Automation',
  'Performance',
  'Accessibility',
  'Security',
  'DevOps',
  'Integrations',
  'Analytics',
  'QA',
  'Support',
];

const personal = [
  'B2B SaaS',
  'Operations',
  'Workflow Automation',
  'Client Portals',
  'Internal Tools',
  'Dashboards',
  'Team Productivity',
  'MVP Delivery',
  'Platform Modernization',
  'Growth Experiments',
  'Business Systems',
  'Long-term Partnerships',
];

/* -----------------------------------------------------------------------------------------------*/

export { InterestsSpotlight };
export type { InterestsSpotlightProps };
