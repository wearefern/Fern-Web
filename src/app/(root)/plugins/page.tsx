import { Metadata } from 'next';

import { PluginsSection } from '~modules/plugins/plugins-section';

export const metadata: Metadata = {
  title: 'Plugins',
  description: 'Fern-native professional audio plugins for modern production.',
};

export default function PluginsPage() {
  return <PluginsSection />;
}
