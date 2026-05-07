import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Prisma } from '@prisma/client';

import { prisma } from '~lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is missing');
  }

  return new Stripe(key, {
    apiVersion: '2026-04-22.dahlia',
  });
}

// utils
function csv(value?: string | null): string[] {
  if (!value) return [];

  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i);
}

function getSessionMetadata(
  session: Stripe.Checkout.Session
): Record<string, string> | null {
  if (!session.metadata) return null;

  // Ensure all metadata values are strings
  const metadata: Record<string, string> = {};
  const rawMetadata = session.metadata ?? {};
  const entries = Object.entries(rawMetadata as Record<string, string>);
  for (const [key, value] of entries) {
    if (typeof value === 'string') {
      metadata[key] = value;
    }
  }
  return metadata;
}

function metadataList(
  metadata: Record<string, string> | null | undefined,
  singular: string,
  plural: string
): string[] {
  return csv(
    [metadata?.[singular], metadata?.[plural]]
      .filter(Boolean)
      .join(',')
  );
}

export async function POST(req: Request) {
  console.log('WEBHOOK START');

  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    console.error('WEBHOOK ERROR: Missing Stripe signature');
    return NextResponse.json({ received: false }, { status: 400 });
  }

  if (!webhookSecret) {
    console.error('WEBHOOK ERROR: Missing Stripe webhook secret');
    return NextResponse.json({ received: false }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('WEBHOOK ERROR: Signature verification failed', error);
    return NextResponse.json({ received: false }, { status: 400 });
  }

  console.log('WEBHOOK EVENT TYPE:', event.type);

  if (event.type !== 'checkout.session.completed') {
    console.log('WEBHOOK SKIPPED: Not checkout.session.completed');
    return NextResponse.json({ received: true });
  }

  const session = event.data.object;

  const stripeSessionId = session.id;
  const stripePaymentIntentId =
    typeof session.payment_intent === 'string' ? session.payment_intent : null;

  const metadata = getSessionMetadata(session);
  const userId = metadata?.userId ?? null;
  const productType = metadata?.productType ?? 'plugin';

  const pluginIds = metadataList(metadata, 'pluginId', 'pluginIds');
  const pluginSlugs = metadataList(metadata, 'pluginSlug', 'pluginSlugs');
  const toolIds = metadataList(metadata, 'toolId', 'toolIds');
  const toolSlugs = metadataList(metadata, 'toolSlug', 'toolSlugs');

  console.log('WEBHOOK SESSION ID:', stripeSessionId);
  console.log('WEBHOOK USER ID:', userId);
  console.log('WEBHOOK PRODUCT TYPE:', productType);
  console.log('WEBHOOK TOOL IDS:', toolIds);
  console.log('WEBHOOK PLUGIN IDS:', pluginIds);

  if (!userId) {
    console.error('WEBHOOK ERROR: Missing userId metadata');
    return NextResponse.json({ received: false }, { status: 400 });
  }

  if (
    pluginIds.length === 0 &&
    pluginSlugs.length === 0 &&
    toolIds.length === 0 &&
    toolSlugs.length === 0
  ) {
    console.error('WEBHOOK ERROR: No product metadata found');
    return NextResponse.json({ received: false }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const existingPluginOrder = await tx.order.findFirst({
        where: { stripeSessionId },
      });

      const existingToolOrder = await tx.toolOrder.findFirst({
        where: { stripeSessionId },
      });

      if (existingPluginOrder || existingToolOrder) {
        console.log('WEBHOOK SKIPPED: Already processed');
        return;
      }

      const shouldProcessPlugins =
        productType === 'plugin' ||
        productType === 'mixed' ||
        pluginIds.length > 0 ||
        pluginSlugs.length > 0;

      const shouldProcessTools =
        productType === 'tool' ||
        productType === 'mixed' ||
        toolIds.length > 0 ||
        toolSlugs.length > 0;

      // -------- Plugins --------
      if (shouldProcessPlugins) {
        const plugins = await tx.plugin.findMany({
          where: {
            OR: [
              pluginIds.length > 0 ? { id: { in: pluginIds } } : undefined,
              pluginSlugs.length > 0
                ? { slug: { in: pluginSlugs } }
                : undefined,
            ].filter((condition): condition is { id: { in: string[] } } | { slug: { in: string[] } } => condition !== undefined),
          },
        });

        if (plugins.length > 0) {
          const totalCents =
            typeof session.amount_total === 'number'
              ? session.amount_total
              : plugins.reduce((sum: number, p: { priceCents: number }) => sum + p.priceCents, 0);

          const order = await tx.order.create({
            data: {
              userId,
              stripeSessionId,
              status: 'completed',
              totalCents,
            },
          });

          await tx.orderItem.createMany({
            data: plugins.map((plugin: { id: string; priceCents: number }) => ({
              orderId: order.id,
              pluginId: plugin.id,
              quantity: 1,
              unitPriceCents: plugin.priceCents,
            })),
          });

          for (const plugin of plugins) {
            await tx.purchase.upsert({
              where: {
                userId_pluginId: { userId, pluginId: plugin.id },
              },
              update: { orderId: order.id },
              create: {
                userId,
                pluginId: plugin.id,
                orderId: order.id,
              },
            });
          }
          console.log('WEBHOOK DB WRITE SUCCESS: Created plugin order and purchases');
        }
      }

      // -------- Tools --------
      if (shouldProcessTools) {
        const tools = await tx.tool.findMany({
          where: {
            OR: [
              toolIds.length > 0 ? { id: { in: toolIds } } : undefined,
              toolSlugs.length > 0 ? { slug: { in: toolSlugs } } : undefined,
            ].filter((condition): condition is { id: { in: string[] } } | { slug: { in: string[] } } => condition !== undefined),
          },
        });

        for (const tool of tools) {
          await tx.toolOrder.upsert({
            where: {
              userId_toolId: { userId, toolId: tool.id },
            },
            update: {
              status: 'paid',
              stripeSessionId,
              stripePaymentIntentId,
              amountCents: tool.priceCents,
            },
            create: {
              userId,
              toolId: tool.id,
              status: 'paid',
              stripeSessionId,
              stripePaymentIntentId,
              amountCents: tool.priceCents,
            },
          });
        }
        console.log('WEBHOOK DB WRITE SUCCESS: Created/upserted tool orders');
      }
    });

    console.log('WEBHOOK SUCCESS');
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('WEBHOOK DB WRITE FAILED:', error);
    return NextResponse.json({ received: false }, { status: 500 });
  }
}
