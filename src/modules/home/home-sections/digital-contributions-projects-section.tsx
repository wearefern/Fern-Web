'use client';

import { ContentCard, ContentCardContainer } from '~ui/molecules/content-card';
import { SectionContainer } from '~ui/molecules/section/section-container';
import { SectionHeader } from '~ui/molecules/section/section-header';
import { SectionHeadline } from '~ui/molecules/section/section-headline';

/* -------------------------------------------------------------------------------------------------
 * DigitalContributionsProjects
 * -----------------------------------------------------------------------------------------------*/

const DigitalContributionsProjects = () => {
  return (
    <SectionContainer id='projects'>
      <SectionHeader
        title='Services'
        subtitle='A general software-industry hierarchy built around delivery.'
      />

      <SectionHeadline>
        Fern helps organizations move from planning to release with strategy,
        engineering, user experience, cloud integration, and ongoing product
        support.
      </SectionHeadline>

      <ContentCardContainer>
        {services.map((service) => (
          <ContentCard
            key={service.label}
            href={service.href}
            label={service.label}
            title={service.title}
          />
        ))}
      </ContentCardContainer>
    </SectionContainer>
  );
};

DigitalContributionsProjects.displayName = 'DigitalContributionsProjects';

const services = [
  {
    href: '/#contact',
    label: 'Strategy',
    title:
      'Discovery workshops, requirements shaping, delivery planning, and architecture direction.',
  },
  {
    href: '/#contact',
    label: 'Engineering',
    title:
      'Custom platforms, SaaS applications, APIs, and internal systems built for maintainability.',
  },
  {
    href: '/#contact',
    label: 'Design',
    title:
      'Interface design, design systems, UX refinement, and customer journeys that reduce friction.',
  },
  {
    href: '/#contact',
    label: 'Cloud',
    title:
      'Infrastructure alignment, integrations, automation, and workflows that support growth.',
  },
  {
    href: '/#contact',
    label: 'Optimization',
    title:
      'Performance, accessibility, QA, and release hardening for production-grade software.',
  },
  {
    href: '/#contact',
    label: 'Support',
    title:
      'Long-term iteration, product improvement, analytics feedback loops, and embedded delivery support.',
  },
];

/* -----------------------------------------------------------------------------------------------*/

export { DigitalContributionsProjects };
