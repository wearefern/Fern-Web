import { NextResponse } from 'next/server';
import { getDownloadUrl } from '~lib/r2';
import { getCurrentUser } from '~lib/auth/get-current-user';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: { fileKey: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileKey } = params;
    
    // Validate fileKey to prevent directory traversal
    if (fileKey.includes('..') || fileKey.includes('/') || fileKey.includes('\\')) {
      return NextResponse.json({ error: 'Invalid fileKey' }, { status: 400 });
    }

    const downloadUrl = await getDownloadUrl(fileKey);
    
    return NextResponse.json({ downloadUrl });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Unable to generate download link' }, { status: 500 });
  }
}
