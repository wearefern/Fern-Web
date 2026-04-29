import { NextRequest, NextResponse } from 'next/server';

import { getModelClient } from '~api/shared/model-client';
import { ResponseBodyError } from '~api/shared/types';
import { createStoreController } from '../../shared/controllers';

export const dynamic = 'force-dynamic';

const client = getModelClient();

export async function GET(
  req: NextRequest
): Promise<NextResponse<ResponseBodyError | unknown[]>> {
  const email = req.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json(
      { error: 'Query param "email" is required.' },
      { status: 400 }
    );
  }

  try {
    const storeController = createStoreController(client);
    const orders = await storeController.getAccountOrders(email);
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
