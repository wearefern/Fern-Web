'use client';

import { Content, ContentType } from '~lib/content/provider';

import { Typography } from '~ui/atoms/typography';

export interface BlogItemsListHeaderProps {
  contents: Content[];
  currentSegment: ContentType;
  onSegmentChange?: (segment: ContentType) => void;
}

export const BlogItemsListHeader = () => {
  return (
    <header>
      <Typography variant='hero' asChild>
        <h1>
          {'Practical writing, talks, and ideas from Fern on building software that scales.'}
        </h1>
      </Typography>
    </header>
  );
};
