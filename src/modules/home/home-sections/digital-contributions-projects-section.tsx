'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { SectionHeader } from '~ui/molecules/section/section-header';
import { SectionContainer } from '~ui/molecules/section/section-container';
import { Typography } from '~ui/atoms/typography';

/* -------------------------------------------------------------------------------------------------
 * DigitalContributionsProjects
 * -----------------------------------------------------------------------------------------------*/

const DigitalContributionsProjects = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

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

          const intro = section.querySelector('[data-services-intro]');
          const rows = gsap.utils.toArray<HTMLElement>('[data-service-row]', section);

          if (!intro || rows.length === 0) {
            return;
          }

          gsap.set([intro, ...rows], {
            opacity: 0,
            y: 56,
          });

          const timeline = gsap.timeline({
            defaults: {
              duration: 0.95,
              ease: 'power3.out',
            },
            scrollTrigger: {
              trigger: section,
              start: 'top 72%',
              once: true,
            },
          });

          timeline
            .to(intro, { opacity: 1, y: 0 })
            .to(
              rows,
              {
                opacity: 1,
                y: 0,
                stagger: 0.14,
                clearProps: 'transform,opacity',
              },
              '-=0.45'
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
    <SectionContainer
      id='projects'
      ref={sectionRef}
      className='relative overflow-hidden pt-8 sm:pt-12'
    >
      <div className='pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.045] via-white/[0.02] to-transparent blur-2xl' />
      <div className='pointer-events-none absolute inset-x-[14%] top-6 h-28 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05),_transparent_72%)] blur-3xl' />

      <div
        data-services-intro
        className='relative border-b border-white/10 pb-14 sm:pb-16'
      >
        <SectionHeader
          title='Services'
          subtitle='Strategy, product design, engineering, systems integration, and continuous improvement shaped into a lean operating model.'
          className='pb-0'
        />
      </div>

      <div className='divide-y divide-white/10'>
        {services.map((service) => (
          <article
            key={service.name}
            data-service-row
            className='group relative grid gap-8 py-10 transition-transform duration-500 ease-out hover:translate-x-1 sm:py-12 lg:grid-cols-[minmax(260px,0.95fr)_minmax(0,1.25fr)] lg:gap-16'
          >
            <div className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

            <div className='lg:sticky lg:top-24 lg:self-start'>
              <Typography
                variant='hero'
                weight='medium'
                prose={false}
                className='text-[3.2rem] leading-[0.94] tracking-tight transition-transform duration-500 ease-out group-hover:translate-x-2 sm:text-[4.8rem] lg:text-[6.6rem]'
              >
                {service.name}
              </Typography>
            </div>

            <div className='max-w-4xl'>
              <Typography
                variant='heading'
                weight='normal'
                prose={false}
                className='text-[1.15rem] leading-8 sm:text-[1.45rem] sm:leading-9'
              >
                {service.statement}
              </Typography>

              <div className='mt-6 flex flex-wrap gap-3'>
                {service.capabilities.map((capability) => (
                  <Link
                    key={capability}
                    href='/contact'
                    className='rounded-full border border-white/10 px-4 py-2 text-sm leading-6 text-ctx-primary-fg-secondary transition-all duration-300 hover:-translate-y-1 hover:border-ctx-accent-secondary hover:bg-white/[0.035] hover:text-ctx-primary-fg-primary'
                  >
                    {capability}
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionContainer>
  );
};

DigitalContributionsProjects.displayName = 'DigitalContributionsProjects';

const services = [
  {
    name: 'Strategy',
    statement:
      'Discovery, requirements shaping, delivery planning, and architecture direction that narrow the path from business need to buildable scope.',
    capabilities: [
      'Discovery workshops',
      'Requirements shaping',
      'Architecture direction',
      'Roadmap definition',
      'Delivery planning',
      'Technical due diligence',
    ],
  },
  {
    name: 'Design',
    statement:
      'Product UX, systems thinking, and interface refinement that remove ambiguity before implementation effort scales.',
    capabilities: [
      'Product UX',
      'Design systems',
      'Interface direction',
      'User journeys',
      'Interaction patterns',
      'Experience audits',
    ],
  },
  {
    name: 'Engineering',
    statement:
      'Custom platforms, internal systems, APIs, and frontend applications built with maintainability, performance, and release discipline in mind.',
    capabilities: [
      'Web applications',
      'Internal tools',
      'API design',
      'Platform architecture',
      'Automation workflows',
      'Frontend systems',
    ],
  },
  {
    name: 'Operations',
    statement:
      'Integrations, cloud-aligned workflows, QA hardening, and post-launch support that keep products reliable as teams and demands grow.',
    capabilities: [
      'Cloud integration',
      'Release hardening',
      'Performance tuning',
      'Accessibility QA',
      'Analytics feedback loops',
      'Embedded support',
    ],
  },
];

/* -----------------------------------------------------------------------------------------------*/

export { DigitalContributionsProjects };
