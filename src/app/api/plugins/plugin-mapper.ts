import { Plugin as DBPlugin } from '@prisma/client';

import { pluginsData } from '../../../data/plugins-data';
import { Plugin } from '~modules/plugins/plugin-types';

const fallbackPlugin = pluginsData[0];

const formatPrice = (priceCents: number, status: string) => {
  if (status === 'free') return 'Free';
  if (status === 'coming_soon') return 'Coming Soon';
  return `$${(priceCents / 100).toFixed(0)}`;
};

export const mapDBPluginToUIPlugin = (plugin: DBPlugin): Plugin => {
  if (!fallbackPlugin) {
    throw new Error('No fallback plugin data is available');
  }

  const details =
    pluginsData.find((item) => item.slug === plugin.slug) ?? fallbackPlugin;

  return {
    id: plugin.id,
    slug: plugin.slug,
    name: plugin.name,
    category: details.category,
    description: plugin.description ?? details.description,
    longDescription: details.longDescription,
    price: formatPrice(plugin.priceCents, plugin.status),
    duration: details.duration,
    audioUrl: plugin.previewUrl ?? details.audioUrl,
    format: details.format,
    version: details.version,
    fileSize: details.fileSize,
    compatibility: details.compatibility,
    features: details.features,
    includedItems: details.includedItems,
    systemRequirements: details.systemRequirements,
    licenseText: details.licenseText,
    macDownloadUrl: details.macDownloadUrl,
    windowsDownloadUrl: details.windowsDownloadUrl,
  };
};
