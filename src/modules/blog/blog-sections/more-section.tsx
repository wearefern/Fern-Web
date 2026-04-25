'use client';

import {
  InlinePlatformRedirectTwitter,
  InlinePlatformRedirectGitHub,
} from '~ui/molecules/inline-platform-redirect-with-icon';
import { SectionContainer } from '~ui/molecules/section/section-container';
import { SectionHeader } from '~ui/molecules/section/section-header';
import { SectionHeadline } from '~ui/molecules/section/section-headline';

/* -------------------------------------------------------------------------------------------------
 * MoreSection
 * -----------------------------------------------------------------------------------------------*/

const MoreSection = () => {
  return (
    <SectionContainer>
      <SectionHeader
        title='More'
        subtitle='Follow Fern across the channels where we publish work and updates.'
      />

      <SectionHeadline>
        <span>
          Follow product updates on <InlinePlatformRedirectTwitter /> and review
          engineering work on <InlinePlatformRedirectGitHub />.
        </span>
      </SectionHeadline>
    </SectionContainer>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { MoreSection };
