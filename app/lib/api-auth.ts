import { NextResponse } from 'next/server';

/**
 * Auth has been removed app-wide for now. This always succeeds so every
 * API route that calls it continues to work without a session.
 * Re-introduce a real check here if auth is added back later.
 *
 * Usage:
 *   const session = await requireAuth();
 *   if (session instanceof NextResponse) return session;
 */
export async function requireAuth() {
  return { user: { id: 'public', role: 'admin' } };
}