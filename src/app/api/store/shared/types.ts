export interface StoreProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  priceLabel: string;
  priceCents: number | null;
  isAvailable: boolean;
  format: string;
  version: string;
  fileSize: string;
  compatibility: string;
  audioUrl: string;
}

export interface CheckoutItemInput {
  productId: string;
  quantity: number;
}

export interface CheckoutRequestBody {
  email: string;
  name?: string;
  items: CheckoutItemInput[];
}

export interface DownloadTokenRequestBody {
  email: string;
  productId: string;
  platform: 'mac' | 'windows';
}
