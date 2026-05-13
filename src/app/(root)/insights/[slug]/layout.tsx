import { Metadata, ResolvingMetadata } from 'next';

import { BASE_URL, INSIGHTS_PATH } from '~constants/index';

import { getAllContent } from '~lib/content/provider';

interface MetadataProps {
  params: { slug: string };
}

export async function generateMetadata(
  { params }: MetadataProps,
  parent: ResolvingMetadata
) {
  const slug = params.slug;
  const data = await getAllContent();
  const content = data.find((entry) => entry.slug === slug);

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
      url: `${BASE_URL}${INSIGHTS_PATH}/${slug}`,
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

export default function InsightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
