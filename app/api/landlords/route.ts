import { NextResponse } from 'next/server';
import { fetchFilteredLandlords, createLandlord } from '@/app/lib/data';
import { requireAuth } from '@/app/lib/api-auth';

export async function GET(request: Request) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';

    const landlords = await fetchFilteredLandlords(query);
    return NextResponse.json(landlords);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch landlords' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const body = await request.json();
    const { name, email, password, companyName } = body;

    if (!name || !email || !companyName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const landlord = await createLandlord({ name, email, password, companyName });
    return NextResponse.json(landlord, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create landlord' }, { status: 500 });
  }
}
