'use client';

import { notFound } from 'next/navigation';
import { getPluginBySlug } from '../../../../../data/plugins-data';
import { PluginDownloadPage } from '../../../../../modules/plugins/plugin-download-page';

interface PluginDownloadPageProps {
  params: {
    slug: string;
  };
}

export default function PluginDownload({ params }: PluginDownloadPageProps) {
  const plugin = getPluginBySlug(params.slug);

  if (!plugin) {
    notFound();
  }

  return <PluginDownloadPage plugin={plugin} />;
}
