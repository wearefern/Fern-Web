import { notFound } from 'next/navigation';

import { getCurrentUser } from '~lib/auth/get-current-user';
import { getRequestOrigin } from '~lib/server/get-request-origin';
import { PluginDetailPage } from '~modules/plugins/plugin-detail-page';
import { Plugin } from '~modules/plugins/plugin-types';

interface PluginPageProps {
  params: {
    slug: string;
  };
}

export default async function PluginPage({ params }: PluginPageProps) {
  const currentUser = await getCurrentUser();
  const isAdmin = currentUser?.role === 'ADMIN';
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

  return <PluginDetailPage plugin={plugin} isAdmin={isAdmin} />;
}
