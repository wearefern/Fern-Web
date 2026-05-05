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
  amount_total?: number;
}

// Helper function to normalize metadata arrays
function normalizeMetadataArray(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .filter((item, index, arr) => arr.indexOf(item) === index); // dedupe
}

// Helper function to get metadata field supporting both singular and plural forms
function getMetadataField(metadata: Record<string, string> | undefined, singularKey: string, pluralKey: string): string[] {
  const singularValue = metadata?.[singularKey];
  const pluralValue = metadata?.[pluralKey];
  
  if (singularValue && pluralValue) {
    // If both exist, combine them
    return normalizeMetadataArray(`${singularValue},${pluralValue}`);
  }
  
  return normalizeMetadataArray(pluralValue || singularValue);
}

export async function POST(req: Request) {
  const signature = headers().get("stripe-signature");

  if (!signature) {
    console.error("Webhook: Missing signature");
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
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return NextResponse.json({ received: false, error: "Webhook verification failed" }, { status: 400 });
  }

  if (stripeEvent.type === "checkout.session.completed") {
    console.log("WEBHOOK START");
    
    const session = stripeEvent.data.object as CheckoutSessionLike;
    const stripeSessionId = session.id;
    const stripePaymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : null;

    console.log("SESSION ID:", session.id);
    console.log("USER ID:", session.metadata?.userId);
    console.log("PRODUCT TYPE:", session.metadata?.productType);
    console.log("PLUGIN IDS:", session.metadata?.pluginIds);
    console.log("TOOL IDS:", session.metadata?.toolIds);
    
    // Extract and normalize metadata
    const userId = session.metadata?.userId;
    const productType = session.metadata?.productType ?? "plugin";
    
    // Hard validation
    if (!userId) {
      console.error("VALIDATION ERROR: Missing userId metadata");
      return NextResponse.json({ received: false, error: "Missing userId" }, { status: 400 });
    }
    
    // Support both singular and plural metadata fields
    const pluginIds = getMetadataField(session.metadata, "pluginId", "pluginIds");
    const pluginSlugs = getMetadataField(session.metadata, "pluginSlug", "pluginSlugs");
    const toolIds = getMetadataField(session.metadata, "toolId", "toolIds");
    const toolSlugs = getMetadataField(session.metadata, "toolSlug", "toolSlugs");

    console.log("PARSED pluginIds:", pluginIds);
    console.log("PARSED toolIds:", toolIds);
    
    // Hard validation
    if (pluginIds.length === 0 && toolIds.length === 0) {
      console.error("VALIDATION ERROR: Both pluginIds and toolIds are empty");
      return NextResponse.json({ received: false, error: "No products specified" }, { status: 400 });
    }

    try {
      // Check for existing orders to prevent duplicate processing
      console.log("CHECKING DUPLICATES...");
      let existingOrder = null;
      let existingToolOrder = null;
      
      try {
        existingOrder = await prisma.order.findFirst({
          where: { stripeSessionId },
        });
        console.log("EXISTING ORDER CHECK:", existingOrder ? "FOUND" : "NONE");
      } catch (e) {
        console.error("DB STEP FAILED - existingOrder check:", e);
        throw e;
      }
      
      try {
        existingToolOrder = await prisma.toolOrder.findFirst({
          where: { stripeSessionId },
        });
        console.log("EXISTING TOOL ORDER CHECK:", existingToolOrder ? "FOUND" : "NONE");
      } catch (e) {
        console.error("DB STEP FAILED - existingToolOrder check:", e);
        throw e;
      }

      // For mixed carts, check if we need to process the missing side
      if (productType === "mixed") {
        const hasPluginOrder = existingOrder !== null;
        const hasToolOrder = existingToolOrder !== null;
        
        if (hasPluginOrder && hasToolOrder) {
                    return NextResponse.json({ received: true });
        }
        
        if (hasPluginOrder && pluginIds.length === 0) {
                    // Continue to process tools only
        }
        
        if (hasToolOrder && toolIds.length === 0) {
                    // Continue to process plugins only
        }
      } else {
        // For non-mixed carts, if any order exists, we're done
        if (existingOrder || existingToolOrder) {
                    return NextResponse.json({ received: true });
        }
      }

      // Handle mixed carts (both plugins and tools)
      if (productType === "mixed") {
        console.log("PROCESSING MIXED CART");
        
        // Process plugins if present and not already processed
        if (pluginIds.length > 0 && !existingOrder) {
          console.log("FETCHING plugins...");
          let plugins = [];
          
          try {
            plugins = await prisma.plugin.findMany({
              where: {
                OR: [
                  { id: { in: pluginIds } },
                  { slug: { in: pluginSlugs.length > 0 ? pluginSlugs : pluginIds } },
                ],
              },
            });
            console.log("FOUND plugins:", plugins.length);
          } catch (e) {
            console.error("DB STEP FAILED - plugin fetch:", e);
            throw e;
          }

          // Hard validation
          if (plugins.length === 0 && pluginIds.length > 0) {
            console.error("DB MISMATCH ERROR: pluginIds exist but no plugins found:", { pluginIds, pluginSlugs });
            return NextResponse.json({ received: false, error: "Plugin lookup failed" }, { status: 500 });
          }

          if (plugins.length > 0) {
            const totalCents = plugins.reduce((sum: number, plugin) => sum + plugin.priceCents, 0);

            console.log("CREATING ORDER...");
            let order = null;
            
            try {
              order = await prisma.order.create({
                data: {
                  userId,
                  stripeSessionId,
                  status: "PAID",
                  totalCents,
                },
              });
              console.log("Order created:", order.id);
            } catch (e) {
              console.error("DB STEP FAILED - order creation:", e);
              throw e;
            }

            // Verify order exists before proceeding
            try {
              const verifyOrder = await prisma.order.findUnique({
                where: { id: order.id },
              });
              
              if (!verifyOrder) {
                throw new Error("Order creation verification failed");
              }
              console.log("Order verification passed");
            } catch (e) {
              console.error("DB STEP FAILED - order verification:", e);
              throw e;
            }

            // Create order items
            console.log("CREATING ORDER ITEMS...");
            try {
              const orderItemsResult = await prisma.orderItem.createMany({
                data: plugins.map((plugin) => ({
                  orderId: order.id,
                  pluginId: plugin.id,
                  quantity: 1,
                  unitPriceCents: plugin.priceCents,
                })),
              });
              console.log("Order items created:", orderItemsResult.count);
              
              if (orderItemsResult.count !== plugins.length) {
                throw new Error(`Order items creation mismatch: expected ${plugins.length}, got ${orderItemsResult.count}`);
              }
            } catch (e) {
              console.error("DB STEP FAILED - order items creation:", e);
              throw e;
            }

            // Create purchases one-by-one for better error handling
            console.log("CREATING PURCHASES...");
            let purchaseCount = 0;
            
            try {
              for (const plugin of plugins) {
                await prisma.purchase.upsert({
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
                purchaseCount++;
              }
              console.log("Purchases created:", purchaseCount);
            } catch (e) {
              console.error("DB STEP FAILED - purchases creation:", e);
              throw e;
            }
          }
        }

        // Process tools if present and not already processed
        if (toolIds.length > 0 && !existingToolOrder) {
          console.log("FETCHING tools...");
          let tools = [];
          
          try {
            tools = await prisma.tool.findMany({
              where: {
                OR: [
                  { id: { in: toolIds } },
                  { slug: { in: toolSlugs.length > 0 ? toolSlugs : toolIds } },
                ],
              },
            });
            console.log("FOUND tools:", tools.length);
          } catch (e) {
            console.error("DB STEP FAILED - tool fetch:", e);
            throw e;
          }

          // Hard validation
          if (tools.length === 0 && toolIds.length > 0) {
            console.error("DB MISMATCH ERROR: toolIds exist but no tools found:", { toolIds, toolSlugs });
            return NextResponse.json({ received: false, error: "Tool lookup failed" }, { status: 500 });
          }

          if (tools.length > 0) {
            // Create tool orders one-by-one
            console.log("CREATING TOOL ORDERS...");
            let toolOrderCount = 0;
            
            try {
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
                toolOrderCount++;
              }
              console.log("Tool orders created:", toolOrderCount);
            } catch (e) {
              console.error("DB STEP FAILED - tool orders creation:", e);
              throw e;
            }
          }
        }

        console.log("MIXED CART PROCESSING COMPLETED");
        return NextResponse.json({ received: true });
      }

      // Handle single tool purchases (legacy support)
      if (productType === "tool") {
        console.log("PROCESSING SINGLE TOOL PURCHASE");
        
        // Hard validation
        if (toolIds.length === 0 && toolSlugs.length === 0) {
          console.error("VALIDATION ERROR: Tool purchase missing tool metadata");
          return NextResponse.json({ received: false, error: "Missing tool metadata" }, { status: 400 });
        }

        console.log("FETCHING tools...");
        let tools = [];
        
        try {
          tools = await prisma.tool.findMany({
            where: {
              OR: [
                { id: { in: toolIds } },
                { slug: { in: toolSlugs.length > 0 ? toolSlugs : toolIds } },
              ],
            },
          });
          console.log("FOUND tools:", tools.length);
        } catch (e) {
          console.error("DB STEP FAILED - tool fetch:", e);
          throw e;
        }

        // Hard validation
        if (tools.length === 0 && toolIds.length > 0) {
          console.error("DB MISMATCH ERROR: toolIds exist but no tools found:", { toolIds, toolSlugs });
          return NextResponse.json({ received: false, error: "Tool lookup failed" }, { status: 500 });
        }

        if (tools.length > 0) {
          // Create tool orders one-by-one
          console.log("CREATING TOOL ORDERS...");
          let toolOrderCount = 0;
          
          try {
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
              toolOrderCount++;
            }
            console.log("Tool orders created:", toolOrderCount);
          } catch (e) {
            console.error("DB STEP FAILED - tool orders creation:", e);
            throw e;
          }
        }
        
        console.log("SINGLE TOOL PURCHASE COMPLETED");
        return NextResponse.json({ received: true });
      }

      // Handle plugin purchases (legacy support)
      console.log("PROCESSING LEGACY PLUGIN PURCHASE");
      
      // Hard validation
      if (pluginIds.length === 0 && pluginSlugs.length === 0) {
        console.error("VALIDATION ERROR: Plugin purchase missing plugin metadata");
        return NextResponse.json({ received: false, error: "Missing plugin metadata" }, { status: 400 });
      }

      console.log("FETCHING plugins...");
      let plugins = [];
      
      try {
        plugins = await prisma.plugin.findMany({
          where: {
            OR: [
              { id: { in: pluginIds } },
              { slug: { in: pluginSlugs.length > 0 ? pluginSlugs : pluginIds } },
            ],
          },
        });
        console.log("FOUND plugins:", plugins.length);
      } catch (e) {
        console.error("DB STEP FAILED - plugin fetch:", e);
        throw e;
      }

      // Hard validation
      if (plugins.length === 0 && pluginIds.length > 0) {
        console.error("DB MISMATCH ERROR: pluginIds exist but no plugins found:", { pluginIds, pluginSlugs });
        return NextResponse.json({ received: false, error: "Plugin lookup failed" }, { status: 500 });
      }

      if (plugins.length > 0) {
        const totalCents = plugins.reduce((sum: number, plugin) => sum + plugin.priceCents, 0);

        console.log("CREATING ORDER...");
        let order = null;
        
        try {
          order = await prisma.order.create({
            data: {
              userId,
              stripeSessionId,
              status: "PAID",
              totalCents,
            },
          });
          console.log("Order created:", order.id);
        } catch (e) {
          console.error("DB STEP FAILED - order creation:", e);
          throw e;
        }

        // Verify order exists before proceeding
        try {
          const verifyOrder = await prisma.order.findUnique({
            where: { id: order.id },
          });
          
          if (!verifyOrder) {
            throw new Error("Order creation verification failed");
          }
          console.log("Order verification passed");
        } catch (e) {
          console.error("DB STEP FAILED - order verification:", e);
          throw e;
        }

        // Create order items
        console.log("CREATING ORDER ITEMS...");
        try {
          const orderItemsResult = await prisma.orderItem.createMany({
            data: plugins.map((plugin) => ({
              orderId: order.id,
              pluginId: plugin.id,
              quantity: 1,
              unitPriceCents: plugin.priceCents,
            })),
          });
          console.log("Order items created:", orderItemsResult.count);
          
          if (orderItemsResult.count !== plugins.length) {
            throw new Error(`Order items creation mismatch: expected ${plugins.length}, got ${orderItemsResult.count}`);
          }
        } catch (e) {
          console.error("DB STEP FAILED - order items creation:", e);
          throw e;
        }

        // Create purchases one-by-one for better error handling
        console.log("CREATING PURCHASES...");
        let purchaseCount = 0;
        
        try {
          for (const plugin of plugins) {
            await prisma.purchase.upsert({
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
            purchaseCount++;
          }
          console.log("Purchases created:", purchaseCount);
        } catch (e) {
          console.error("DB STEP FAILED - purchases creation:", e);
          throw e;
        }
      }
      
      console.log("LEGACY PLUGIN PURCHASE COMPLETED");
    } catch (error) {
      console.error("WEBHOOK PROCESSING FAILED:", error);
      return NextResponse.json({ received: false, error: "Processing failed" }, { status: 500 });
    }
    
    console.log("SUCCESS COMPLETE");
  }

  console.log("WEBHOOK END - No action taken");
  return NextResponse.json({ received: true });
}
