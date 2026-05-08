import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';

import { BASE_URL, BLOG_PATH } from '~constants/index';

import { getAllContent } from '~lib/content/provider';

import { Button } from '~ui/atoms/button';

interface MetadataProps {
  params: { slug: string };
}

export async function generateMetadata(
  { params }: MetadataProps,
  parent: ResolvingMetadata
) {
  const slug = params.slug;
  const data = await getAllContent();
  const content = data.find((content) => content.slug === slug);

  const parentMetadata = (await parent) as Metadata;

  if (!content) {
    return parentMetadata;
  }

  const openGraph = parentMetadata.openGraph!;
  const twitter = parentMetadata.twitter!;

  return {
    title: content.title,
    description: content.description,
    openGraph: {
      ...openGraph,
      url: `${BASE_URL}${BLOG_PATH}/${slug}`,
      title: content.title,
      description: content.description,
      images: [content.thumbnail],
    },
    twitter: {
      ...twitter,
      title: content.title,
      description: content.description,
      images: [content.thumbnail],
    },
  } satisfies Metadata;
}

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className='layout-width-limiter layout-padding pt-6'>
        <Button variant='outline' className='rounded-lg px-4 py-2 text-sm' asChild>
          <Link href='/'>← Back to Home</Link>
        </Button>
      </div>
      {children}
    </>
  );
}
