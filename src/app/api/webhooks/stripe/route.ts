/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import { headers } from "next/headers";
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "~lib/prisma";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

interface CheckoutSessionLike {
  id: string;
  metadata?: Record<string, string>;
  payment_intent?: string | null;
}

export async function POST(req: Request) {
  console.log("WEBHOOK HIT");

  const signature = headers().get("stripe-signature");

  if (!signature) {
    console.log("Missing signature");
    return NextResponse.json({ received: false, error: "Missing signature" }, { status: 400 });
  }

  let stripeEvent: ReturnType<typeof stripe.webhooks.constructEvent>;

  try {
    const body = await req.text();

    stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("EVENT TYPE:", stripeEvent.type);
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return NextResponse.json({ received: false, error: "Webhook verification failed" }, { status: 400 });
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object as CheckoutSessionLike;

    console.log("Stripe event type:", stripeEvent.type);
    console.log("Stripe session metadata:", session.metadata);

    const userId = session.metadata?.userId;
    const productType = session.metadata?.productType ?? "plugin";

    try {
      // Check for existing order to prevent duplicate processing
      const existingOrder = await prisma.order.findFirst({
        where: { stripeSessionId: session.id },
      });
      const existingToolOrder = await prisma.toolOrder.findFirst({
        where: { stripeSessionId: session.id },
      });

      if (existingOrder || existingToolOrder) {
        console.log("Already processed");
        return NextResponse.json({ received: true });
      }

      if (!userId) {
        console.error("Missing userId metadata");
        return NextResponse.json({ received: true });
      }

      // Handle mixed carts (both plugins and tools)
      if (productType === "mixed") {
        const pluginIds = (session.metadata?.pluginIds ?? "")
          .split(",")
          .filter((value) => Boolean(value));
        const toolIds = (session.metadata?.toolIds ?? "")
          .split(",")
          .filter((value) => Boolean(value));

        if (pluginIds.length === 0 && toolIds.length === 0) {
          console.error("Missing product metadata");
          return NextResponse.json({ received: true });
        }

        let totalCents = 0;

        // Process plugins
        if (pluginIds.length > 0) {
          const plugins = await prisma.plugin.findMany({
            where: { id: { in: pluginIds } },
          });
          totalCents += plugins.reduce((sum: number, plugin) => sum + plugin.priceCents, 0);

          await prisma.$transaction(async (tx) => {
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
        }

        // Process tools
        if (toolIds.length > 0) {
          const tools = await prisma.tool.findMany({
            where: { id: { in: toolIds } },
          });
          totalCents += tools.reduce((sum: number, tool) => sum + tool.priceCents, 0);

          for (const tool of tools) {
            await prisma.toolOrder.upsert({
              where: {
                userId_toolId: {
                  userId,
                  toolId: tool.id,
                },
              },
              update: {
                status: "paid",
                stripeSessionId: session.id,
                stripePaymentIntentId:
                  typeof session.payment_intent === "string"
                    ? session.payment_intent
                    : null,
                amountCents: tool.priceCents,
              },
              create: {
                userId,
                toolId: tool.id,
                status: "paid",
                stripeSessionId: session.id,
                stripePaymentIntentId:
                  typeof session.payment_intent === "string"
                    ? session.payment_intent
                    : null,
                amountCents: tool.priceCents,
              },
            });
          }
        }

        console.log("Created mixed order for:", productType, userId);
        return NextResponse.json({ received: true });
      }

      // Handle single tool purchases (legacy support)
      if (productType === "tool") {
        if (!session.metadata?.toolId) {
          console.error("Missing tool metadata");
          return NextResponse.json({ received: true });
        }

        const tool = await prisma.tool.findUnique({
          where: { id: session.metadata.toolId },
        });
        if (!tool) {
          return NextResponse.json({ received: true });
        }

        await prisma.toolOrder.upsert({
          where: {
            userId_toolId: {
              userId,
              toolId: tool.id,
            },
          },
          update: {
            status: "paid",
            stripeSessionId: session.id,
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
            amountCents: tool.priceCents,
          },
          create: {
            userId,
            toolId: tool.id,
            status: "paid",
            stripeSessionId: session.id,
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
            amountCents: tool.priceCents,
          },
        });

        console.log("Created tool order for:", productType, userId);
        return NextResponse.json({ received: true });
      }

      // Handle plugin purchases (legacy support)
      const pluginIds = (session.metadata?.pluginIds ?? "")
        .split(",")
        .filter((value) => Boolean(value));
      if (pluginIds.length === 0) {
        console.error("Missing plugin metadata");
        return NextResponse.json({ received: true });
      }

      const plugins = await prisma.plugin.findMany({
        where: { id: { in: pluginIds } },
      });

      const totalCents = plugins.reduce((sum: number, plugin) => sum + plugin.priceCents, 0);

      await prisma.$transaction(async (tx) => {
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

      console.log("Created plugin order for:", productType, userId);
    } catch (error) {
      console.error("DB ERROR:", error);
      return NextResponse.json({ received: false, error: "Database error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
