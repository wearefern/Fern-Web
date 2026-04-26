'use client';

import { useEffect, useRef, useState } from 'react';

import { Typography } from '~ui/atoms/typography';
import { SectionContainer } from '~ui/molecules/section/section-container';
import { SectionHeader } from '~ui/molecules/section/section-header';

const CARD_TRANSITION =
  'transform 760ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms cubic-bezier(0.22, 1, 0.36, 1), filter 420ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 520ms cubic-bezier(0.22, 1, 0.36, 1), border-color 520ms cubic-bezier(0.22, 1, 0.36, 1)';
const CARD_ACTIVE_SHADOW = '0 30px 80px rgba(0, 0, 0, 0.28)';

/* -------------------------------------------------------------------------------------------------
 * AboutSection
 * -----------------------------------------------------------------------------------------------*/

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);

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

          const sectionHeader = section.querySelector('[data-process-header]');
          const intro = section.querySelector('[data-process-intro]');
          const rail = section.querySelector('[data-process-rail]');
          const cards = gsap.utils.toArray<HTMLElement>(
            '[data-process-card]',
            section
          );

          if (!sectionHeader || !intro || cards.length === 0) {
            return;
          }

          gsap.set([sectionHeader, intro, ...cards], {
            opacity: 0,
            y: 42,
          });

          if (rail) {
            gsap.set(rail, {
              scaleX: 0,
              transformOrigin: 'left center',
              opacity: 0.5,
            });
          }

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
            .to(sectionHeader, { opacity: 1, y: 0 })
            .to(intro, { opacity: 1, y: 0 }, '-=0.55');

          if (rail) {
            timeline.to(
              rail,
              {
                scaleX: 1,
                opacity: 1,
                duration: 1.1,
              },
              '-=0.45'
            );
          }

          timeline.to(
            cards,
            {
              opacity: 1,
              y: 0,
              stagger: 0.12,
              clearProps: 'transform,opacity',
            },
            '-=0.65'
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
    <div id='process'>
      <SectionContainer
        ref={sectionRef}
        className='relative isolate overflow-hidden pt-12 sm:pt-16 xl:pt-20'
      >
        <div className='pointer-events-none absolute inset-x-[10%] top-12 -z-10 h-40 rounded-full bg-[radial-gradient(circle_at_center,_rgba(168,198,255,0.16),_transparent_68%)] blur-3xl' />
        <div className='pointer-events-none absolute right-[8%] top-32 -z-10 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,_rgba(193,255,214,0.12),_transparent_72%)] blur-3xl' />

        <SectionHeader
          data-process-header
          title='Process'
          subtitle='How Fern moves from planning to reliable delivery.'
          className='pb-16 sm:pb-24'
        />

        <Typography
          data-process-intro
          className='mx-auto max-w-5xl text-center text-xl leading-9 sm:text-2xl sm:leading-10'
          balance
          asChild
        >
          <h3>
            A lean delivery process built to reduce ambiguity, keep momentum,
            and turn product decisions into maintainable software.
          </h3>
        </Typography>

        <div className='relative mt-16 sm:mt-24 xl:mt-28'>
          <div
            data-process-rail
            className='pointer-events-none absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-transparent via-white/20 to-transparent xl:block'
          />

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-4 xl:gap-10'>
            {steps.map((step, index) => (
              <button
                key={step.title}
                type='button'
                data-process-card
                aria-pressed={activeCard === index}
                aria-expanded={activeCard === index}
                onClick={() =>
                  setActiveCard((current) => (current === index ? null : index))
                }
                className='group relative h-[25rem] w-full text-left sm:h-[26rem]'
                style={{ perspective: '1600px' }}
              >
                <div
                  className='relative h-full w-full rounded-[1.75rem]'
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div
                    className='absolute inset-0 overflow-hidden rounded-[1.75rem] border border-ctx-primary-fg-hint bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] px-6 py-7 backdrop-blur-sm group-hover:border-ctx-accent-secondary sm:px-8 sm:py-9'
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform:
                        activeCard === index
                          ? 'rotateY(-14deg) translateX(-12px) scale(0.985)'
                          : 'rotateY(0deg) translateX(0) scale(1)',
                      transition: CARD_TRANSITION,
                      opacity: activeCard === index ? 0 : 1,
                      filter: activeCard === index ? 'blur(2px)' : 'blur(0px)',
                      boxShadow:
                        activeCard === index
                          ? CARD_ACTIVE_SHADOW
                          : undefined,
                      pointerEvents: activeCard === index ? 'none' : 'auto',
                      willChange: 'transform, opacity, filter',
                    }}
                  >
                    <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_42%)] opacity-70 transition-opacity duration-500 group-hover:opacity-100' />
                    <div className='pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60' />

                    <Typography
                      variant='sm'
                      color='secondary'
                      weight='bold'
                      prose={false}
                      className='relative uppercase tracking-[0.2em] text-ctx-accent-secondary'
                    >
                      {`0${index + 1}`}
                    </Typography>

                    <Typography
                      variant='heading'
                      weight='medium'
                      prose={false}
                      className='relative mt-6 text-[1.35rem] leading-8 transition-transform duration-500 group-hover:translate-x-1'
                    >
                      {step.title}
                    </Typography>

                    <Typography
                      color='secondary'
                      className='relative mt-4 leading-8 transition-colors duration-500 group-hover:text-ctx-primary-fg-primary'
                    >
                      {step.description}
                    </Typography>

                    <Typography
                      variant='sm'
                      color='secondary'
                      className='absolute bottom-7 right-6 text-xs uppercase tracking-[0.2em] sm:right-8'
                    >
                      Click to expand
                    </Typography>
                  </div>

                  <div
                    className='absolute inset-0 flex flex-col overflow-hidden rounded-[1.75rem] border border-white/16 bg-black px-6 py-7 shadow-[0_30px_80px_rgba(0,0,0,0.28)] sm:px-8 sm:py-9'
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform:
                        activeCard === index
                          ? 'rotateY(0deg) translateX(0) scale(1)'
                          : 'rotateY(14deg) translateX(12px) scale(0.985)',
                      transition: CARD_TRANSITION,
                      opacity: activeCard === index ? 1 : 0,
                      filter: activeCard === index ? 'blur(0px)' : 'blur(2px)',
                      boxShadow:
                        activeCard === index ? CARD_ACTIVE_SHADOW : undefined,
                      pointerEvents: activeCard === index ? 'auto' : 'none',
                      willChange: 'transform, opacity, filter',
                    }}
                  >
                    <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_48%)]' />
                    <div className='pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-90' />

                    <Typography
                      variant='sm'
                      weight='bold'
                      prose={false}
                      className='relative uppercase tracking-[0.2em] text-white/72'
                    >
                      {step.backLabel}
                    </Typography>

                    <Typography
                      variant='heading'
                      weight='medium'
                      prose={false}
                      className='relative mt-6 text-[1.3rem] leading-8 text-white'
                    >
                      {step.backTitle}
                    </Typography>

                    <div className='relative mt-5 flex-1 space-y-3'>
                      {step.points.map((point) => (
                        <div key={point.title}>
                          <Typography
                            variant='sm'
                            weight='bold'
                            prose={false}
                            className='text-sm uppercase tracking-[0.14em] text-white'
                          >
                            {point.title}
                          </Typography>
                          <Typography
                            className='mt-1 leading-6 text-white/72 sm:leading-7'
                          >
                            {point.description}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};

AboutSection.displayName = 'AboutSection';

interface ProcessStep {
  title: string;
  description: string;
  backLabel: string;
  backTitle: string;
  points: {
    title: string;
    description: string;
  }[];
}

const steps: ProcessStep[] = [
  {
    title: 'Discover',
    description:
      'We align on the product goal, business constraints, users, and the shortest path to a useful release.',
    backLabel: 'Inputs',
    backTitle: 'What happens in discovery',
    points: [
      {
        title: 'Scope',
        description: 'We define the problem, success metric, and release boundary.',
      },
      {
        title: 'Risk',
        description: 'We surface technical and product unknowns before build work expands.',
      },
    ],
  },
  {
    title: 'Design',
    description:
      'We shape the experience, define system behavior, and remove ambiguity before engineering effort scales.',
    backLabel: 'Blueprint',
    backTitle: 'What design locks in',
    points: [
      {
        title: 'Flow',
        description: 'We map user journeys, screens, and edge cases that affect delivery.',
      },
      {
        title: 'System',
        description: 'We align interface rules and component behavior before implementation.',
      },
    ],
  },
  {
    title: 'Build',
    description:
      'We implement the product with clear architecture, tight feedback loops, and production-focused engineering.',
    backLabel: 'Execution',
    backTitle: 'What build focuses on',
    points: [
      {
        title: 'Delivery',
        description: 'We ship in small validated slices instead of hiding progress in long phases.',
      },
      {
        title: 'Quality',
        description: 'We keep performance, maintainability, and release safety in view from day one.',
      },
    ],
  },
  {
    title: 'Refine',
    description:
      'We optimize, stabilize, and iterate after launch so the product keeps improving as the business grows.',
    backLabel: 'Growth',
    backTitle: 'What refinement improves',
    points: [
      {
        title: 'Learning',
        description: 'We use usage signals and stakeholder feedback to guide the next decisions.',
      },
      {
        title: 'Hardening',
        description: 'We improve reliability, polish rough edges, and remove friction after launch.',
      },
    ],
  },
];

/* -----------------------------------------------------------------------------------------------*/

export { AboutSection };
