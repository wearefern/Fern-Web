/* eslint-disable @typescript-eslint/no-explicit-any */
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "~lib/prisma";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

function csv(value?: string | null): string[] {
  if (!value) return [];

  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i);
}

function metadataList(
  metadata: Stripe.Metadata | null | undefined,
  singular: string,
  plural: string
): string[] {
  return csv([metadata?.[singular], metadata?.[plural]].filter(Boolean).join(","));
}

export async function POST(req: Request) {
  console.log("WEBHOOK START");

  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    console.error("WEBHOOK ERROR: Missing Stripe signature");
    return NextResponse.json({ received: false }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("WEBHOOK ERROR: Signature verification failed", error);
    return NextResponse.json({ received: false }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const stripeSessionId = session.id;
  const stripePaymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : null;

  const userId = session.metadata?.userId ?? null;
  const productType = session.metadata?.productType ?? "plugin";

  const pluginIds = metadataList(session.metadata, "pluginId", "pluginIds");
  const pluginSlugs = metadataList(session.metadata, "pluginSlug", "pluginSlugs");

  const toolIds = metadataList(session.metadata, "toolId", "toolIds");
  const toolSlugs = metadataList(session.metadata, "toolSlug", "toolSlugs");

  console.log("SESSION ID:", stripeSessionId);
  console.log("PAYMENT INTENT:", stripePaymentIntentId);
  console.log("USER ID:", userId);
  console.log("PRODUCT TYPE:", productType);
  console.log("PLUGIN IDS:", pluginIds);
  console.log("PLUGIN SLUGS:", pluginSlugs);
  console.log("TOOL IDS:", toolIds);
  console.log("TOOL SLUGS:", toolSlugs);

  if (!userId) {
    console.error("WEBHOOK ERROR: Missing userId metadata");
    return NextResponse.json({ received: false }, { status: 400 });
  }

  if (
    pluginIds.length === 0 &&
    pluginSlugs.length === 0 &&
    toolIds.length === 0 &&
    toolSlugs.length === 0
  ) {
    console.error("WEBHOOK ERROR: No product metadata found");
    return NextResponse.json({ received: false }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const existingPluginOrder = await tx.order.findFirst({
        where: { stripeSessionId },
      });

      const existingToolOrder = await tx.toolOrder.findFirst({
        where: { stripeSessionId },
      });

      if (existingPluginOrder || existingToolOrder) {
        console.log("WEBHOOK SKIPPED: Stripe session already processed");
        return;
      }

      const shouldProcessPlugins =
        productType === "plugin" || productType === "mixed" || pluginIds.length > 0 || pluginSlugs.length > 0;

      const shouldProcessTools =
        productType === "tool" || productType === "mixed" || toolIds.length > 0 || toolSlugs.length > 0;

      if (shouldProcessPlugins) {
        console.log("FETCHING PLUGINS...");

        const plugins = await tx.plugin.findMany({
          where: {
            OR: [
              pluginIds.length > 0 ? { id: { in: pluginIds } } : undefined,
              pluginSlugs.length > 0 ? { slug: { in: pluginSlugs } } : undefined,
            ].filter(Boolean) as any,
          },
        });

        console.log("FOUND PLUGINS:", plugins.length);

        if ((pluginIds.length > 0 || pluginSlugs.length > 0) && plugins.length === 0) {
          throw new Error(
            `Plugin lookup failed. pluginIds=${pluginIds.join(",")} pluginSlugs=${pluginSlugs.join(",")}`
          );
        }

        if (plugins.length > 0) {
          const totalCents =
            typeof session.amount_total === "number"
              ? session.amount_total
              : plugins.reduce((sum, plugin) => sum + plugin.priceCents, 0);

          console.log("CREATING ORDER...");

          const order = await tx.order.create({
            data: {
              userId,
              stripeSessionId,
              status: "PAID",
              totalCents,
            },
          });

          console.log("ORDER CREATED:", order.id);

          await tx.orderItem.createMany({
            data: plugins.map((plugin) => ({
              orderId: order.id,
              pluginId: plugin.id,
              quantity: 1,
              unitPriceCents: plugin.priceCents,
            })),
          });

          console.log("ORDER ITEMS CREATED:", plugins.length);

          for (const plugin of plugins) {
            await tx.purchase.upsert({
              where: {
                userId_pluginId: {
                  userId,
                  pluginId: plugin.id,
                },
              },
              update: {
                orderId: order.id,
              },
              create: {
                userId,
                pluginId: plugin.id,
                orderId: order.id,
              },
            });
          }

          console.log("PURCHASES CREATED:", plugins.length);
        }
      }

      if (shouldProcessTools) {
        console.log("FETCHING TOOLS...");

        const tools = await tx.tool.findMany({
          where: {
            OR: [
              toolIds.length > 0 ? { id: { in: toolIds } } : undefined,
              toolSlugs.length > 0 ? { slug: { in: toolSlugs } } : undefined,
            ].filter(Boolean) as any,
          },
        });

        console.log("FOUND TOOLS:", tools.length);

        if ((toolIds.length > 0 || toolSlugs.length > 0) && tools.length === 0) {
          throw new Error(
            `Tool lookup failed. toolIds=${toolIds.join(",")} toolSlugs=${toolSlugs.join(",")}`
          );
        }

        for (const tool of tools) {
          await tx.toolOrder.upsert({
            where: {
              userId_toolId: {
                userId,
                toolId: tool.id,
              },
            },
            update: {
              status: "paid",
              stripeSessionId,
              stripePaymentIntentId,
              amountCents: tool.priceCents,
            },
            create: {
              userId,
              toolId: tool.id,
              status: "paid",
              stripeSessionId,
              stripePaymentIntentId,
              amountCents: tool.priceCents,
            },
          });
        }

        console.log("TOOL ORDERS CREATED:", tools.length);
      }
    });

    console.log("WEBHOOK SUCCESS");
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("WEBHOOK PROCESSING FAILED:", error);
    return NextResponse.json(
      { received: false, error: "Processing failed" },
      { status: 500 }
    );
  }
}