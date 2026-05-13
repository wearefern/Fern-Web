import { Prisma } from '@prisma/client';

export interface PluginAdminPayload {
  name?: string;
  slug?: string;
  description?: string | null;
  priceCents?: number;
  status?: string;
  previewUrl?: string | null;
  fileKey?: string | null;
  demoControls?: unknown;
}

const normalizePreviewUrlInput = (
  value: string | null | undefined
): string | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('/')) return trimmed;
  if (trimmed.startsWith('audio/')) return `/${trimmed}`;
  return trimmed;
};

const toJsonValue = (value: unknown): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput => {
  if (value === null) {
    return Prisma.JsonNull;
  }
  return value as Prisma.InputJsonValue;
};

export const sanitizePluginPayload = (payload: PluginAdminPayload): Prisma.PluginUpdateInput => {
  const normalizedPreviewUrl = normalizePreviewUrlInput(payload.previewUrl);

  return {
    ...(payload.name !== undefined ? { name: payload.name } : {}),
    ...(payload.slug !== undefined ? { slug: payload.slug } : {}),
    ...(payload.description !== undefined
      ? { description: payload.description }
      : {}),
    ...(payload.priceCents !== undefined ? { priceCents: payload.priceCents } : {}),
    ...(payload.status !== undefined ? { status: payload.status } : {}),
    ...(normalizedPreviewUrl !== undefined ? { previewUrl: normalizedPreviewUrl } : {}),
    ...(payload.fileKey !== undefined ? { fileKey: payload.fileKey } : {}),
    ...(payload.demoControls !== undefined
      ? { demoControls: toJsonValue(payload.demoControls) }
      : {}),
  };
};

export const sanitizePluginCreatePayload = (
  payload: PluginAdminPayload
): Prisma.PluginCreateInput | null => {
  if (
    typeof payload.name !== 'string' ||
    typeof payload.slug !== 'string' ||
    typeof payload.priceCents !== 'number' ||
    typeof payload.status !== 'string'
  ) {
    return null;
  }

  const normalizedPreviewUrl = normalizePreviewUrlInput(payload.previewUrl);

  return {
    name: payload.name,
    slug: payload.slug,
    priceCents: payload.priceCents,
    status: payload.status,
    ...(payload.description !== undefined ? { description: payload.description } : {}),
    ...(normalizedPreviewUrl !== undefined ? { previewUrl: normalizedPreviewUrl } : {}),
    ...(payload.fileKey !== undefined ? { fileKey: payload.fileKey } : {}),
    ...(payload.demoControls !== undefined
      ? { demoControls: toJsonValue(payload.demoControls) }
      : {}),
  };
};
