import { Content } from '~lib/content/provider';

import { BlogContentArticle } from '~modules/blog/blog-content/blog-content-article';
import { BlogContentHeader } from '~modules/blog/blog-content/blog-content-header';
import { BlogTwoPaneContainer } from '~modules/blog/blog-two-pane-container';

import { GsapReveal } from '~ui/atoms/gsap-reveal';

export interface BlogContentProps {
  content: Content;
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <BlogTwoPaneContainer
      leadingClassName='sm:max-w-[35%]'
      leading={
        <GsapReveal start='top 85%' y={40}>
          <BlogContentHeader content={content} />
        </GsapReveal>
      }
      trailing={
        <>
          <GsapReveal start='top 88%' y={40}>
            <BlogContentArticle body={content.body} />
          </GsapReveal>

        </>
      }
    />
  );
}
