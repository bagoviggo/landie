import { auth } from '@/auth';
import { NextResponse } from 'next/server';

/**
 * Call this at the top of any API route handler that requires authentication.
 * Returns the session if valid, or a 401 NextResponse if not.
 *
 * Usage:
 *   const session = await requireAuth();
 *   if (session instanceof NextResponse) return session;
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return session;
}
