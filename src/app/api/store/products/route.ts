import { NextResponse } from 'next/server';

import { getModelClient } from '~api/shared/model-client';
import { ResponseBodyError } from '~api/shared/types';
import { createStoreController } from '../shared/controllers';
import { StoreProduct } from '../shared/types';

export const dynamic = 'force-dynamic';

const client = getModelClient();

export async function GET(): Promise<
  NextResponse<StoreProduct[] | ResponseBodyError>
> {
  try {
    const storeController = createStoreController(client);
    const products = await storeController.getAllProducts();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
