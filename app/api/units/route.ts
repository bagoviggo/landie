import { NextResponse } from 'next/server';
import { fetchUnitsByProperty } from '@/app/lib/data';
import { requireAuth } from '@/app/lib/api-auth';

export async function GET(request: Request) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const units = await fetchUnitsByProperty(propertyId);
    return NextResponse.json(units);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch units' }, { status: 500 });
  }
}
