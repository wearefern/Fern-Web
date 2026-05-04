import { notFound } from 'next/navigation';

import { getRequestOrigin } from '~lib/server/get-request-origin';
import { PluginDownloadPage } from '~modules/plugins/plugin-download-page';
import { Plugin } from '~modules/plugins/plugin-types';

interface PluginDownloadProps {
  params: {
    slug: string;
  };
}

export default async function PluginDownload({ params }: PluginDownloadProps) {
  const origin = getRequestOrigin();
  const response = await fetch(`${origin}/api/plugins/${params.slug}`, {
    cache: 'no-store',
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    notFound();
  }

  const plugin = (await response.json()) as Plugin;

  return <PluginDownloadPage plugin={plugin} />;
}
