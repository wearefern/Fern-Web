'use client';

import { useEffect, useRef } from 'react';

import { useScrollThemeToggle } from '~hooks/use-scroll-theme-toggle';

import { ContentCard, ContentCardContainer } from '~ui/molecules/content-card';
import { SectionContainer } from '~ui/molecules/section/section-container';
import { SectionHeader } from '~ui/molecules/section/section-header';
import { SectionHeadline } from '~ui/molecules/section/section-headline';

/* -------------------------------------------------------------------------------------------------
 * DigitalContributionsProjects
 * -----------------------------------------------------------------------------------------------*/

const DigitalContributionsProjects = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useScrollThemeToggle({ targetRef: sectionRef });

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const run = async () => {
      try {
        const gsapModule = await import('gsap');
        const scrollTriggerModule = await import('gsap/ScrollTrigger');

        const gsap = gsapModule.gsap;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
          const section = sectionRef.current;
          if (!section) {
            return;
          }

          const header = section.querySelector('[data-services-header]');
          const headline = section.querySelector('[data-services-headline]');
        const cards = gsap.utils.toArray<HTMLElement>(
          '[data-services-card]',
          section
        );

          if (!header || !headline || cards.length === 0) {
            return;
          }

          gsap.set([header, headline, ...cards], {
            opacity: 0,
            y: 48,
          });

          const timeline = gsap.timeline({
            defaults: {
              duration: 0.9,
              ease: 'power3.out',
            },
            scrollTrigger: {
              trigger: section,
              start: 'top 72%',
              once: true,
            },
          });

          timeline
            .to(header, { opacity: 1, y: 0 })
            .to(headline, { opacity: 1, y: 0 }, '-=0.5')
            .to(
              cards,
              {
                opacity: 1,
                y: 0,
                stagger: 0.12,
                clearProps: 'transform,opacity',
              },
              '-=0.4'
            );
        }, sectionRef);

        cleanup = () => ctx.revert();
      } catch {
        cleanup = undefined;
      }
    };

    void run();

    return () => cleanup?.();
  }, []);

  return (
    <SectionContainer id='projects' ref={sectionRef}>
      <SectionHeader
        data-services-header
        title='Services'
        subtitle='A general software-industry hierarchy built around delivery.'
      />

      <SectionHeadline data-services-headline>
        Fern helps organizations move from planning to release with strategy,
        engineering, user experience, cloud integration, and ongoing product
        support.
      </SectionHeadline>

      <ContentCardContainer>
        {services.map((service) => (
          <ContentCard
            key={service.label}
            data-services-card
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
