import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "~lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(req: Request) {
  console.log("WEBHOOK HIT");

  const signature = headers().get("stripe-signature");

  if (!signature) {
    console.log("Missing signature");
    return new Response("Missing signature", { status: 400 });
  }

  let event: any;

  try {
    const body = await req.text();

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("EVENT TYPE:", event.type);
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return new Response("Webhook verification failed", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    console.log("SESSION:", session);
    console.log("METADATA:", session.metadata);

    const userId = session.metadata?.userId;
    const pluginIds =
      session.metadata?.pluginIds?.split(",").filter(Boolean) || [];

    if (!userId || pluginIds.length === 0) {
      console.log("Missing metadata");
      return new Response("Missing metadata", { status: 400 });
    }

    try {
      // prevent duplicate processing
      const existing = await prisma.order.findFirst({
        where: { stripeSessionId: session.id },
      });

      if (existing) {
        console.log("Already processed");
        return new Response("OK", { status: 200 });
      }

      const plugins = await prisma.plugin.findMany({
        where: { id: { in: pluginIds } },
      });

      const totalCents = plugins.reduce((sum: number, plugin) => sum + plugin.priceCents, 0);

      await prisma.$transaction(async (tx: any) => {
        const order = await tx.order.create({
          data: {
            userId,
            stripeSessionId: session.id,
            status: "PAID",
            totalCents,
          },
        });

        if (plugins.length > 0) {
          await tx.orderItem.createMany({
            data: plugins.map((plugin) => ({
              orderId: order.id,
              pluginId: plugin.id,
              quantity: 1,
              unitPriceCents: plugin.priceCents,
            })),
          });
        }

        for (const plugin of plugins) {
          await tx.purchase.upsert({
            where: {
              userId_pluginId: {
                userId,
                pluginId: plugin.id,
              },
            },
            update: { orderId: order.id },
            create: {
              userId,
              pluginId: plugin.id,
              orderId: order.id,
            },
          });
        }
      });

      console.log("Order + purchases created");
    } catch (error) {
      console.error("DB ERROR:", error);
      return new Response("Database error", { status: 500 });
    }
  }

  return new Response("OK", { status: 200 });
}
