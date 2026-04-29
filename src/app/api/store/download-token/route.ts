import { NextRequest, NextResponse } from 'next/server';

import { getModelClient } from '~api/shared/model-client';
import { ResponseBodyError } from '~api/shared/types';
import { createStoreController } from '../shared/controllers';
import { DownloadTokenRequestBody } from '../shared/types';

export const dynamic = 'force-dynamic';

const client = getModelClient();

export async function POST(
  req: NextRequest
): Promise<NextResponse<ResponseBodyError | { token: string; url: string }>> {
  try {
    const body = (await req.json()) as DownloadTokenRequestBody;
    if (!body.email || !body.productId || !body.platform) {
      return NextResponse.json(
        { error: 'Required fields: email, productId, platform' },
        { status: 400 }
      );
    }

    if (body.platform !== 'mac' && body.platform !== 'windows') {
      return NextResponse.json(
        { error: 'platform must be "mac" or "windows"' },
        { status: 400 }
      );
    }

    const storeController = createStoreController(client);
    const result = await storeController.createDownloadToken(
      body.email,
      body.productId,
      body.platform
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
