import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPluginBySlug, plugins } from '../../../../data/plugins-data';
import { PluginDetail } from '~modules/plugins/plugin-detail';

interface PluginPageProps {
  params: {
    slug: string;
  };
}

export const generateStaticParams = () =>
  plugins.map((plugin) => ({ slug: plugin.slug }));

export const generateMetadata = ({ params }: PluginPageProps): Metadata => {
  const plugin = getPluginBySlug(params.slug);

  return {
    title: plugin?.name ?? 'Plugin',
    description: plugin?.description,
  };
};

export default function PluginPage({ params }: PluginPageProps) {
  const plugin = getPluginBySlug(params.slug);

  if (!plugin) {
    notFound();
  }

  return <PluginDetail plugin={plugin} />;
}
