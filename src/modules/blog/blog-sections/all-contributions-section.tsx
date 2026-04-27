'use client';

import { useMemo } from 'react';

import { useBlogContext } from '~modules/blog';
import { FilterableBlogItemsList } from '~modules/blog/blog-items-list';

import { SectionContainer } from '~ui/molecules/section/section-container';
import { SectionHeader } from '~ui/molecules/section/section-header';

export const AllContributionsSection = () => {
  const { contents, highlightedContents } = useBlogContext();
  const highlightedSlugs = useMemo(
    () => new Set(highlightedContents.map((content) => content.slug)),
    [highlightedContents]
  );
  const feedContents = useMemo(
    () => contents.filter((content) => !highlightedSlugs.has(content.slug)),
    [contents, highlightedSlugs]
  );

  return (
    <SectionContainer>
      <SectionHeader title='All insights' />

      <FilterableBlogItemsList items={feedContents} />
    </SectionContainer>
  );
};
