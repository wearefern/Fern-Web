import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { getModelClient } from '../../shared/model-client';
import { getCurrentUser } from '~lib/auth/get-current-user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as { toolId?: unknown } | null;
    const toolId = typeof body?.toolId === 'string' ? body.toolId : '';
    if (!toolId) {
      return NextResponse.json({ error: 'toolId is required' }, { status: 400 });
    }

    const prisma = getModelClient();
    const tool = await prisma.tool.findUnique({ where: { id: toolId } });

    if (!tool || tool.status !== 'active' || tool.priceCents <= 0) {
      return NextResponse.json({ error: 'Only active paid tools can be purchased' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: tool.name },
            unit_amount: tool.priceCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/tools/downloads?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tools?cancelled=1`,
      metadata: {
        productType: 'tool',
        toolId: tool.id,
        userId: user.clerkId,
      },
    });

    console.log('Creating Stripe session metadata:', {
      productType: 'tool',
      userId: user.clerkId,
      pluginId: null,
      toolId: tool.id,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Tools checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
