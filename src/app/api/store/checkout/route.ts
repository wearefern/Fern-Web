import { NextRequest, NextResponse } from 'next/server';

import { getModelClient } from '~api/shared/model-client';
import { ResponseBodyError } from '~api/shared/types';
import { createStoreController } from '../shared/controllers';
import { CheckoutRequestBody } from '../shared/types';

export const dynamic = 'force-dynamic';

const client = getModelClient();

export async function POST(
  req: NextRequest
): Promise<NextResponse<ResponseBodyError | Record<string, unknown>>> {
  try {
    const body = (await req.json()) as CheckoutRequestBody;
    if (!body.email || !Array.isArray(body.items)) {
      return NextResponse.json(
        { error: 'Required fields: email, items[]' },
        { status: 400 }
      );
    }

    const storeController = createStoreController(client);
    const result = await storeController.checkout(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
