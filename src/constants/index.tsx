import { ContentType } from '~lib/content/provider';

export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://fern.so';

export const BLOG_PATH = '/blog';
export const BLOG_PATH_WITH_CATEGORY = (category: ContentType) =>
  `${BLOG_PATH}?content=${category}`;

export const PLUGINS_PATH = '/plugins';

export const SOCIALS = {
  mail: {
    url: 'hello@fern.so',
    handle: 'hello@fern.so',
  },
  linkedin: {
    url: 'https://www.linkedin.com/company/fern-software',
    handle: 'fern-software',
  },
  github: {
    url: 'https://github.com/fern-software',
    handle: 'github.com/fern-software',
  },
  twitter: {
    url: 'https://x.com/fernsoftware',
    handle: '@fernsoftware',
  },
  youtube: {
    url: 'https://www.youtube.com/@fernsoftware',
    handle: '@fernsoftware',
  },
};

export const PORTFOLIO_GITHUB_REPOSITORY_URL =
  'https://github.com/fern-software/fern-web';
