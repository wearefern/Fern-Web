'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { BLOG_PATH } from '~constants/index';

import { Content } from '~lib/content/provider';

import { useHomeContext } from '~modules/home';

import { Typography } from '~ui/atoms/typography';
import { ContentIcon } from '~ui/molecules/content-icon';
import { SectionContainer } from '~ui/molecules/section/section-container';
import { SectionHeader } from '~ui/molecules/section/section-header';
import { SectionHeadline } from '~ui/molecules/section/section-headline';

/* -------------------------------------------------------------------------------------------------
 * DigitalContributionsKnowledgeSharing
 * -----------------------------------------------------------------------------------------------*/

const DigitalContributionsKnowledgeSharing = () => {
  const context = useHomeContext();

  const article = useMemo(
    () => context.blogContent.find((content) => content.type === 'article'),
    [context.blogContent]
  );

  const youtubeVideo = useMemo(
    () =>
      context.blogContent.find((content) => content.type === 'youtube-video'),
    [context.blogContent]
  );

  const talk = useMemo(
    () => context.blogContent.find((content) => content.type === 'talk'),
    [context.blogContent]
  );

  const contents = useMemo(
    () =>
      [
        {
          content: article,
          label: 'Performance note',
          title: 'Keep product interfaces responsive as usage grows',
          href: article ? `${BLOG_PATH}/${article.slug}` : BLOG_PATH,
        },
        {
          content: youtubeVideo,
          label: 'Systems walkthrough',
          title: 'Automation patterns for teams replacing manual work',
          href: youtubeVideo ? `${BLOG_PATH}/${youtubeVideo.slug}` : BLOG_PATH,
        },
        {
          content: talk,
          label: 'Architecture talk',
          title: 'Frontend architecture choices that stay maintainable',
          href: talk ? `${BLOG_PATH}/${talk.slug}` : BLOG_PATH,
        },
      ].filter(
        (
          entry
        ): entry is {
          content: Content;
          label: string;
          title: string;
          href: string;
        } => Boolean(entry.content)
      ),
    [article, talk, youtubeVideo]
  );

  return (
    <SectionContainer>
      <SectionHeader
        title='Insights'
        subtitle='Short technical perspectives on product engineering, interface performance, delivery systems, and maintainable software architecture.'
      />

      <div className='mx-auto grid w-full max-w-6xl gap-4 sm:grid-cols-3 sm:gap-6'>
        {contents.map((entry) => (
          <Link
            className='group flex min-h-56 flex-col rounded-2xl border border-ctx-primary-fg-hint bg-ctx-primary p-5 transition-colors hover:border-ctx-primary-fg-secondary sm:p-6'
            href={entry.href}
            key={entry.content.slug}
          >
            <Typography
              className='uppercase'
              variant='sm'
              color='secondary'
              weight='bold'
            >
              {entry.label}
            </Typography>

            <Typography
              className='mt-4 text-lg leading-7 underline-offset-4 group-hover:underline'
              asChild
              prose={false}
              balance
            >
              <h3>
                <ContentIcon
                  className='mr-2 inline align-middle'
                  contentType={entry.content.type}
                />
                {entry.title}
              </h3>
            </Typography>

            <Typography
              className='mt-4 line-clamp-4'
              variant='body-sm'
              color='secondary'
              weight='normal'
            >
              {entry.content.description}
            </Typography>

            <Typography className='mt-auto pt-6' variant='sm' color='hint'>
              Read insight
            </Typography>
          </Link>
        ))}
      </div>

      <SectionHeadline className='mt-content'>
        Explore how Fern approaches performance, automation workflows,
        frontend architecture, and the operating habits behind reliable
        software delivery.
      </SectionHeadline>
    </SectionContainer>
  );
};

DigitalContributionsKnowledgeSharing.displayName =
  'DigitalContributionsKnowledgeSharing';

/* -----------------------------------------------------------------------------------------------*/

export { DigitalContributionsKnowledgeSharing };
