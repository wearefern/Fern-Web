import { NextResponse } from 'next/server';

import { getModelClient } from '../../shared/model-client';
import { requireAdmin, AdminAccessError } from '~lib/auth/require-admin';

export const dynamic = 'force-dynamic';

type ProductType = 'Plugin' | 'Tool';

interface AdminDownloadRecord {
  id: string;
  customerName: string | null;
  customerEmail: string | null;
  productType: ProductType;
  productName: string | null;
  productSlugOrId: string | null;
  priceCents: number | null;
  paymentStatus: string | null;
  purchaseOrDownloadStatus: string | null;
  stripeId: string | null;
  createdAt: string;
}

export async function GET() {
  try {
    await requireAdmin();
    const prisma = getModelClient();

    const [pluginPurchases, toolOrders, toolDownloads, toolDownloadTokens] = await Promise.all([
      prisma.purchase.findMany({
        include: {
          plugin: true,
          order: true,
          downloadTokens: {
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      prisma.toolOrder.findMany({
        include: {
          tool: true,
        },
      }),
      prisma.toolDownload.findMany(),
      prisma.toolDownloadToken.findMany({
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const userIds = new Set<string>();
    for (const purchase of pluginPurchases) userIds.add(String(purchase.userId));
    for (const order of toolOrders) userIds.add(String(order.userId));

    const users = await prisma.user.findMany({
      where: {
        clerkId: {
          in: Array.from(userIds),
        },
      },
      select: {
        clerkId: true,
        name: true,
        email: true,
      },
    });

    const userMap = new Map<string, { name: string | null; email: string | null }>(
      users
        .filter((user) => Boolean(user.clerkId))
        .map((user) => [user.clerkId!, { name: user.name, email: user.email }] as const)
    );

    const toolDownloadCountMap = new Map<string, number>();
    for (const download of toolDownloads) {
      const key = `${download.userId}:${download.toolId}`;
      toolDownloadCountMap.set(key, (toolDownloadCountMap.get(key) ?? 0) + 1);
    }

    const toolTokenMap = new Map<string, { total: number; used: number }>();
    for (const token of toolDownloadTokens) {
      const key = `${token.userId}:${token.toolId}`;
      const current = toolTokenMap.get(key) ?? { total: 0, used: 0 };
      current.total += 1;
      if (token.usedAt) {
        current.used += 1;
      }
      toolTokenMap.set(key, current);
    }

    const pluginRecords: AdminDownloadRecord[] = pluginPurchases.map((purchase) => {
      const user = userMap.get(purchase.userId);
      const tokenCount = purchase.downloadTokens.length;
      const usedTokenCount = purchase.downloadTokens.filter((token) => Boolean(token.usedAt)).length;

      return {
        id: `plugin:${purchase.id}`,
        customerName: user?.name ?? null,
        customerEmail: user?.email ?? null,
        productType: 'Plugin',
        productName: purchase.plugin?.name ?? null,
        productSlugOrId: purchase.plugin?.slug ?? purchase.pluginId ?? null,
        priceCents: purchase.order?.totalCents ?? purchase.plugin?.priceCents ?? null,
        paymentStatus: purchase.order?.status ?? null,
        purchaseOrDownloadStatus:
          tokenCount === 0
            ? 'purchased'
            : usedTokenCount > 0
              ? `downloaded (${usedTokenCount}/${tokenCount} tokens used)`
              : `link generated (${tokenCount} token${tokenCount === 1 ? '' : 's'})`,
        stripeId: purchase.order?.stripeSessionId ?? null,
        createdAt: purchase.createdAt.toISOString(),
      };
    });

    const toolRecords: AdminDownloadRecord[] = toolOrders.map((order) => {
      const user = userMap.get(order.userId);
      const key = `${order.userId}:${order.toolId}`;
      const downloadCount = toolDownloadCountMap.get(key) ?? 0;
      const tokenInfo = toolTokenMap.get(key);

      let downloadStatus: string;
      if (downloadCount > 0) {
        downloadStatus = `downloaded (${downloadCount})`;
      } else if ((tokenInfo?.used ?? 0) > 0) {
        downloadStatus = `downloaded (${tokenInfo?.used ?? 0} token uses)`;
      } else if ((tokenInfo?.total ?? 0) > 0) {
        downloadStatus = `link generated (${tokenInfo?.total ?? 0} token${(tokenInfo?.total ?? 0) === 1 ? '' : 's'})`;
      } else {
        downloadStatus = 'purchased';
      }

      return {
        id: `tool:${order.id}`,
        customerName: user?.name ?? null,
        customerEmail: user?.email ?? null,
        productType: 'Tool',
        productName: order.tool?.name ?? null,
        productSlugOrId: order.tool?.slug ?? order.toolId ?? null,
        priceCents: order.amountCents ?? null,
        paymentStatus: order.status ?? null,
        purchaseOrDownloadStatus: downloadStatus,
        stripeId: order.stripePaymentIntentId ?? order.stripeSessionId ?? null,
        createdAt: order.createdAt.toISOString(),
      };
    });

    const combined = [...pluginRecords, ...toolRecords].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(combined);
  } catch (error) {
    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Failed to load admin downloads', error);
    return NextResponse.json({ error: 'Unable to load total downloads' }, { status: 500 });
  }
}
