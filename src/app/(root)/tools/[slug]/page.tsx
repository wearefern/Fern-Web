import { notFound } from 'next/navigation';

import { getRequestOrigin } from '~lib/server/get-request-origin';
import { ToolDetailPage } from '~modules/tools/tool-detail-page';
import { Tool } from '~modules/tools/tool-types';

interface ToolPageProps {
  params: {
    slug: string;
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const origin = getRequestOrigin();
  const response = await fetch(`${origin}/api/tools/${params.slug}`, {
    cache: 'no-store',
  });

  if (response.status === 404 || !response.ok) {
    notFound();
  }

  const tool = (await response.json()) as Tool;

  return <ToolDetailPage tool={tool} />;
}
