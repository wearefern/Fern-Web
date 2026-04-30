import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    const plugins = items.map((i: any) => ({
      id: i.pluginId,
      name: "Test Plugin",
      priceCents: 7900,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: plugins.map((p) => ({
        price_data: {
          currency: "usd",
          product_data: { name: p.name },
          unit_amount: p.priceCents,
        },
        quantity: 1,
      })),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/downloads`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}