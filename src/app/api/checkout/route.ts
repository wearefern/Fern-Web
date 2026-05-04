import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "~lib/prisma";
import { pluginsData } from "../../../data/plugins-data";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

interface CheckoutItem {
  productType?: 'plugin' | 'tool';
  pluginId?: unknown;
  toolId?: unknown;
  slug?: unknown;
  quantity?: unknown;
}

export async function POST(req: Request) {
  try {
   const { userId } = await auth();;

if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
    const body = (await req.json().catch(() => null)) as { items?: CheckoutItem[] } | null;
    const items = Array.isArray(body?.items) ? body.items : [];
    const normalizedItems = items
      .map((item) => {
        const productType = item.productType === 'tool' ? 'tool' : 'plugin';

const id = typeof (item as any)?.id === "string" ? (item as any).id : null;
const pluginId = typeof item?.pluginId === "string" ? item.pluginId : null;
const toolId = typeof item?.toolId === "string" ? item.toolId : null;
const slug = typeof item?.slug === "string" ? item.slug : null;
        const quantity =
          typeof item?.quantity === "number" && Number.isFinite(item.quantity) && item.quantity > 0
            ? Math.floor(item.quantity)
            : 1;
        return {
  productType,
  pluginId: pluginId ?? (productType === "plugin" ? id : null),
  toolId: toolId ?? (productType === "tool" ? id : null),
  slug,
  quantity,
};
      })
      .filter((item) => item.pluginId || item.toolId || item.slug);

    if (normalizedItems.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const identifiers = Array.from(
      new Set(
        normalizedItems.flatMap((item) => [item.pluginId, item.toolId, item.slug]).filter((value): value is string => Boolean(value))
      )
    );

    const quantityByIdentifier = new Map<string, number>();
    for (const item of normalizedItems) {
      if (item.pluginId) {
        quantityByIdentifier.set(item.pluginId, (quantityByIdentifier.get(item.pluginId) ?? 0) + item.quantity);
      }
      if (item.toolId) {
        quantityByIdentifier.set(item.toolId, (quantityByIdentifier.get(item.toolId) ?? 0) + item.quantity);
      }
      if (item.slug) {
        quantityByIdentifier.set(item.slug, (quantityByIdentifier.get(item.slug) ?? 0) + item.quantity);
      }
    }

    let purchasableLineItems: Array<{ id: string; slug: string; name: string; priceCents: number; quantity: number }> = [];

    try {
      // Fetch plugins
      const dbPlugins = await prisma.plugin.findMany({
        where: {
          OR: [{ id: { in: identifiers } }, { slug: { in: identifiers } }],
        },
      });

      // Fetch tools
      const dbTools = await prisma.tool.findMany({
        where: {
          OR: [{ id: { in: identifiers } }, { slug: { in: identifiers } }],
        },
      });

      // Combine plugins and tools
      const allDbItems = [
        ...dbPlugins
          .filter((plugin) => plugin.status !== "coming_soon" && plugin.status !== "free" && plugin.priceCents > 0)
          .map((plugin) => ({
            id: plugin.id,
            slug: plugin.slug,
            name: plugin.name,
            priceCents: plugin.priceCents,
            quantity:
              quantityByIdentifier.get(plugin.id) ??
              quantityByIdentifier.get(plugin.slug) ??
              1,
          })),
        ...dbTools
          .filter((tool) => tool.status !== "coming_soon" && tool.status !== "free" && tool.priceCents > 0)
          .map((tool) => ({
            id: tool.id,
            slug: tool.slug,
            name: tool.name,
            priceCents: tool.priceCents,
            quantity:
              quantityByIdentifier.get(tool.id) ??
              quantityByIdentifier.get(tool.slug) ??
              1,
          }))
      ];

      purchasableLineItems = allDbItems;
    } catch (error) {
      console.warn("Checkout DB lookup failed, using static plugin fallback:", error);
    }

   if (purchasableLineItems.length === 0) {
  purchasableLineItems = pluginsData
    .filter((plugin) =>
      identifiers.includes(String(plugin.id)) ||
      identifiers.includes(String(plugin.slug))
    )
    .map((plugin) => {
      const normalizedPrice = plugin.price.replace(/[^0-9.]/g, "");
      const priceDollars = Number.parseFloat(normalizedPrice);
      const priceCents = Number.isFinite(priceDollars)
        ? Math.round(priceDollars * 100)
        : 0;

      return {
        id: String(plugin.id),
        slug: plugin.slug,
        name: plugin.name,
        priceCents,
        quantity:
          quantityByIdentifier.get(String(plugin.id)) ??
          quantityByIdentifier.get(plugin.slug) ??
          1,
      };
    })
    .filter((plugin) => plugin.priceCents > 0);
}

    if (purchasableLineItems.length === 0) {
      return NextResponse.json({ error: "No valid plugins found" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: purchasableLineItems.map((plugin) => ({
        price_data: {
          currency: "usd",
          product_data: { name: plugin.name },
          unit_amount: plugin.priceCents,
        },
        quantity: plugin.quantity,
      })),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/downloads?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?checkout=cancelled`,
      metadata: {
        productType: "mixed",
        userId,
        pluginId: purchasableLineItems[0]?.id ?? "",
        pluginIds: purchasableLineItems.map((item) => item.id).join(","),
        pluginSlugs: purchasableLineItems.map((item) => item.slug).join(","),
      },
    });

    console.log("Creating Stripe session metadata:", {
      productType: "mixed",
      userId,
      pluginId: purchasableLineItems[0]?.id ?? null,
      pluginIds: purchasableLineItems.map((item) => item.id),
      pluginSlugs: purchasableLineItems.map((item) => item.slug),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
