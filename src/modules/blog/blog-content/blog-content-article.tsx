import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';

import { BlogMarkdown } from '~modules/blog/blog-markdown';

export interface BlogContentArticle {
  body: string;
}

function BlogContentArticle({ body }: BlogContentArticle) {
  return (
    <article>
      <MDXRemote
        source={body}
        components={BlogMarkdown}
        options={{
          mdxOptions: {
            remarkPlugins: [],
            //@ts-expect-error https://github.com/hashicorp/next-mdx-remote/issues/86
            rehypePlugins: [[rehypeHighlight, {}]],
            development: process.env.NODE_ENV === 'development',
          },
        }}
      />
    </article>
  );
}

export { BlogContentArticle };
