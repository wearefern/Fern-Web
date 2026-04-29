import { NextResponse } from 'next/server';

import { getModelClient } from '~api/shared/model-client';
import { ResponseBodyError } from '~api/shared/types';
import { createStoreController } from '../../shared/controllers';
import { StoreProduct } from '../../shared/types';

export const dynamic = 'force-dynamic';

const client = getModelClient();

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
): Promise<NextResponse<StoreProduct | ResponseBodyError>> {
  try {
    const storeController = createStoreController(client);
    const product = await storeController.getProductBySlug(params.slug);
    if (!product) {
      return NextResponse.json(
        { error: `Product "${params.slug}" not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
