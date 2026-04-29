import { ModelClient } from '~api/shared/model-client';
import { getAllPlugins } from '../../../../data/plugins-data';

import { CheckoutRequestBody, StoreProduct } from './types';

const toPriceCents = (label: string): number | null => {
  if (label.toLowerCase() === 'free') {
    return 0;
  }
  if (label.toLowerCase().includes('coming soon')) {
    return null;
  }

  const parsed = Number(label.replace('$', '').trim());
  if (Number.isNaN(parsed)) {
    return null;
  }

  return Math.round(parsed * 100);
};

const toStoreProduct = (product: {
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
}): StoreProduct => ({
  id: product.id,
  slug: product.slug,
  name: product.name,
  category: product.category,
  description: product.description,
  longDescription: product.longDescription,
  priceLabel: product.priceLabel,
  priceCents: product.priceCents,
  isAvailable: product.isAvailable,
  format: product.format,
  version: product.version,
  fileSize: product.fileSize,
  compatibility: product.compatibility,
  audioUrl: product.audioUrl,
});

export const createStoreController = (client: ModelClient) => ({
  async syncProductsFromCatalog() {
    const plugins = getAllPlugins();

    await Promise.all(
      plugins.map((plugin) =>
        client.product.upsert({
          where: { id: plugin.id },
          create: {
            id: plugin.id,
            slug: plugin.slug,
            name: plugin.name,
            category: plugin.category,
            description: plugin.description,
            longDescription: plugin.longDescription,
            priceLabel: plugin.price,
            priceCents: toPriceCents(plugin.price),
            isAvailable: !plugin.price.toLowerCase().includes('coming soon'),
            format: plugin.format,
            version: plugin.version,
            fileSize: plugin.fileSize,
            compatibility: plugin.compatibility,
            audioUrl: plugin.audioUrl,
            macDownloadUrl: plugin.macDownloadUrl,
            windowsDownloadUrl: plugin.windowsDownloadUrl,
          },
          update: {
            slug: plugin.slug,
            name: plugin.name,
            category: plugin.category,
            description: plugin.description,
            longDescription: plugin.longDescription,
            priceLabel: plugin.price,
            priceCents: toPriceCents(plugin.price),
            isAvailable: !plugin.price.toLowerCase().includes('coming soon'),
            format: plugin.format,
            version: plugin.version,
            fileSize: plugin.fileSize,
            compatibility: plugin.compatibility,
            audioUrl: plugin.audioUrl,
            macDownloadUrl: plugin.macDownloadUrl,
            windowsDownloadUrl: plugin.windowsDownloadUrl,
          },
        })
      )
    );
  },

  async getAllProducts(): Promise<StoreProduct[]> {
    await this.syncProductsFromCatalog();

    const products = await client.product.findMany({
      orderBy: { name: 'asc' },
    });

    return products.map(toStoreProduct);
  },

  async getProductBySlug(slug: string): Promise<StoreProduct | null> {
    await this.syncProductsFromCatalog();

    const product = await client.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return null;
    }

    return toStoreProduct(product);
  },

  async checkout(input: CheckoutRequestBody) {
    const normalizedEmail = input.email.trim().toLowerCase();
    const cleanItems = input.items.filter((item) => item.quantity > 0);
    if (cleanItems.length === 0) {
      throw new Error('Checkout requires at least one item.');
    }

    await this.syncProductsFromCatalog();

    const products = await client.product.findMany({
      where: { id: { in: cleanItems.map((item) => item.productId) } },
    });
    const productsById = new Map(products.map((product) => [product.id, product]));

    const orderLines = cleanItems.map((item) => {
      const product = productsById.get(item.productId);
      if (!product) {
        throw new Error(`Unknown product "${item.productId}".`);
      }
      if (!product.isAvailable || product.priceCents === null) {
        throw new Error(`Product "${product.name}" is not currently purchasable.`);
      }

      const quantity = Math.max(1, Math.floor(item.quantity));
      const unitPriceCents = product.priceCents;
      const lineTotalCents = unitPriceCents * quantity;

      return { product, quantity, unitPriceCents, lineTotalCents };
    });

    const subtotalCents = orderLines.reduce(
      (sum, line) => sum + line.lineTotalCents,
      0
    );

    const user = await client.userAccount.upsert({
      where: { email: normalizedEmail },
      create: { email: normalizedEmail, name: input.name?.trim() || null },
      update: { name: input.name?.trim() || undefined },
    });

    const order = await client.order.create({
      data: {
        externalRef: `ORD-${Date.now()}`,
        status: 'completed',
        subtotalCents,
        totalCents: subtotalCents,
        currency: 'USD',
        paymentProvider: 'demo',
        paymentRef: `demo-${Date.now()}`,
        userId: user.id,
        items: {
          create: orderLines.map((line) => ({
            quantity: line.quantity,
            unitPriceCents: line.unitPriceCents,
            lineTotalCents: line.lineTotalCents,
            productId: line.product.id,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    await Promise.all(
      order.items.map((item) =>
        client.license.upsert({
          where: {
            userId_productId: {
              userId: user.id,
              productId: item.productId,
            },
          },
          create: {
            userId: user.id,
            productId: item.productId,
            orderItemId: item.id,
          },
          update: {},
        })
      )
    );

    return {
      orderId: order.id,
      externalRef: order.externalRef,
      status: order.status,
      totalCents: order.totalCents,
      currency: order.currency,
    };
  },

  async getAccountOrders(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await client.userAccount.findUnique({
      where: { email: normalizedEmail },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return [];
    }

    return user.orders.map((order) => ({
      id: order.id,
      externalRef: order.externalRef,
      status: order.status,
      totalCents: order.totalCents,
      currency: order.currency,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        slug: item.product.slug,
        quantity: item.quantity,
        lineTotalCents: item.lineTotalCents,
      })),
    }));
  },

  async getAccountDownloads(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await client.userAccount.findUnique({
      where: { email: normalizedEmail },
      include: {
        licenses: {
          include: {
            product: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      return [];
    }

    return user.licenses.map((license) => ({
      licenseId: license.id,
      productId: license.productId,
      slug: license.product.slug,
      name: license.product.name,
      version: license.product.version,
      fileSize: license.product.fileSize,
      macAvailable: Boolean(license.product.macDownloadUrl),
      windowsAvailable: Boolean(license.product.windowsDownloadUrl),
      createdAt: license.createdAt.toISOString(),
    }));
  },

  async createDownloadToken(email: string, productId: string, platform: 'mac' | 'windows') {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await client.userAccount.findUnique({
      where: { email: normalizedEmail },
    });
    if (!user) {
      throw new Error('User account not found.');
    }

    const license = await client.license.findFirst({
      where: {
        userId: user.id,
        productId,
      },
      include: {
        product: true,
      },
    });
    if (!license) {
      throw new Error('No license found for this product.');
    }

    const url =
      platform === 'mac'
        ? license.product.macDownloadUrl
        : license.product.windowsDownloadUrl;
    if (!url) {
      throw new Error(`No ${platform} download available.`);
    }

    await client.downloadEvent.create({
      data: {
        licenseId: license.id,
        platform,
      },
    });

    const token = Buffer.from(
      JSON.stringify({
        productId,
        platform,
        t: Date.now(),
      })
    ).toString('base64url');

    return { token, url };
  },
});
