import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "~lib/prisma";
import { getCurrentUser } from "~lib/auth/get-current-user";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

interface CheckoutItem {
  pluginId?: unknown;
  quantity?: unknown;
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => null)) as { items?: CheckoutItem[] } | null;
    const items = Array.isArray(body?.items) ? body.items : [];
    const pluginIds = items
      .map((item) => (typeof item?.pluginId === "string" ? item.pluginId : null))
      .filter((id): id is string => Boolean(id));

    if (pluginIds.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const plugins = await prisma.plugin.findMany({
      where: {
        id: { in: pluginIds },
      },
    });

    const purchasablePlugins = plugins.filter(
      (plugin) => plugin.status !== "coming_soon" && plugin.status !== "free"
    );

    if (purchasablePlugins.length === 0) {
      return NextResponse.json({ error: "No valid plugins found" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: purchasablePlugins.map((plugin) => ({
        price_data: {
          currency: "usd",
          product_data: { name: plugin.name },
          unit_amount: plugin.priceCents,
        },
        quantity: 1,
      })),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/downloads?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?checkout=cancelled`,
      metadata: {
        productType: "plugin",
        userId: user.clerkId,
        pluginId: purchasablePlugins[0]?.id ?? "",
        pluginIds: purchasablePlugins.map((plugin) => plugin.id).join(","),
      },
    });

    console.log("Creating Stripe session metadata:", {
      productType: "plugin",
      userId: user.clerkId,
      pluginId: purchasablePlugins[0]?.id ?? null,
      pluginIds: purchasablePlugins.map((plugin) => plugin.id),
      toolId: null,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
