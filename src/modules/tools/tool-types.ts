export interface Tool {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  longDescription?: string | null;
  priceCents: number;
  status: string;
  category?: string | null;
  previewImageUrl?: string | null;
  fileKey?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export const formatToolPrice = (tool: Pick<Tool, 'status' | 'priceCents'>) => {
  if (tool.status === 'free') return 'Free';
  if (tool.status === 'coming_soon') return 'Coming Soon';
  return `$${(tool.priceCents / 100).toFixed(0)}`;
};
