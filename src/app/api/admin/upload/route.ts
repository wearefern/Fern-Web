import { NextResponse } from 'next/server';
import { getCurrentUser } from '~lib/auth/get-current-user';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { fileKey, entityType, entityId } = body as {
      fileKey?: string;
      entityType?: 'plugin' | 'tool';
      entityId?: string;
    };

    if (!fileKey || !entityType || !entityId) {
      return NextResponse.json({ error: 'fileKey, entityType, and entityId are required' }, { status: 400 });
    }

    // Update entity with fileKey
    const endpoint = entityType === 'tool' ? 'tools' : 'plugins';
    const response = await fetch(`/api/admin/${endpoint}/${entityId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileKey }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to update entity' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'FileKey updated successfully',
      fileKey,
    });
  } catch (error: unknown) {
    console.error('FileKey update error:', error);
    return NextResponse.json({ error: 'FileKey update failed' }, { status: 500 });
  }
}
