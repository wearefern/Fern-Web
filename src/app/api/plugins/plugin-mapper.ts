import { Plugin as DBPlugin } from '@prisma/client';

import { pluginsData } from '../../../data/plugins-data';
import { getPluginDemoControls } from '~modules/plugins/demo-controls';
import { Plugin } from '~modules/plugins/plugin-types';

const fallbackPlugin = pluginsData[0];

const normalizePreviewUrl = (value: string | null): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return undefined;
  }
  if (trimmed.startsWith('/')) {
    return trimmed;
  }
  if (trimmed.startsWith('audio/')) {
    return `/${trimmed}`;
  }
  return `/audio/${trimmed}`;
};

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
  const normalizedPreviewUrl = normalizePreviewUrl(plugin.previewUrl);

  return {
    id: plugin.id,
    slug: plugin.slug,
    name: plugin.name,
    status: plugin.status,
    priceCents: plugin.priceCents,
    previewUrl: normalizedPreviewUrl,
    fileKey: plugin.fileKey ?? undefined,
    demoControls: getPluginDemoControls(plugin.slug, plugin.demoControls),
    category: details.category,
    description: plugin.description ?? details.description,
    longDescription: details.longDescription,
    price: formatPrice(plugin.priceCents, plugin.status),
    duration: details.duration,
    audioUrl: normalizedPreviewUrl ?? details.audioUrl,
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
