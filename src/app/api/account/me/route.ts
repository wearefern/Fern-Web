import { NextResponse } from 'next/server';

import { getCurrentUser } from '~lib/auth/get-current-user';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Failed to load current user', error);
    return NextResponse.json({ error: 'Unable to load user' }, { status: 500 });
  }
}
