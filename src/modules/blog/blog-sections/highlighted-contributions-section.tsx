'use client';

import { useBlogContext } from '~modules/blog';
import {
  BlogFeatureItem,
  BlogSecondaryItem,
} from '~modules/blog/blog-item';

import { SectionContainer } from '~ui/molecules/section/section-container';
import { SectionHeader } from '~ui/molecules/section/section-header';

/* -------------------------------------------------------------------------------------------------
 * HighlightedContributionsSection
 * -----------------------------------------------------------------------------------------------*/

const HighlightedContributionsSection = () => {
  const { highlightedContents } = useBlogContext();
  const [featuredContent, ...secondaryContents] = highlightedContents;

  if (!featuredContent) {
    return null;
  }

  return (
    <SectionContainer>
      <SectionHeader title='Featured insights' />

      <div className='flex flex-col gap-5 sm:gap-6'>
        <BlogFeatureItem content={featuredContent} />

        {secondaryContents.length ? (
          <div className='grid gap-4 sm:grid-cols-2 sm:gap-6'>
            {secondaryContents.slice(0, 2).map((content) => (
              <BlogSecondaryItem content={content} key={content.slug} />
            ))}
          </div>
        ) : null}
      </div>
    </SectionContainer>
  );
};

HighlightedContributionsSection.displayName = 'HighlightedContributionsSection';

/* -----------------------------------------------------------------------------------------------*/

export { HighlightedContributionsSection };
