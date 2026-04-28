'use client';

import { notFound } from 'next/navigation';
import { getPluginBySlug } from '../../../../data/plugins-data';
import { PluginDetailPage } from '../../../../modules/plugins/plugin-detail-page';

interface PluginPageProps {
  params: {
    slug: string;
  };
}

export default function PluginPage({ params }: PluginPageProps) {
  const plugin = getPluginBySlug(params.slug);

  if (!plugin) {
    notFound();
  }

  return <PluginDetailPage plugin={plugin} />;
}
