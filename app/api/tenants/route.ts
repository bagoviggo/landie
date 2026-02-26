import { NextResponse } from 'next/server';
import { fetchFilteredTenants, createTenant } from '@/app/lib/data';
import { requireAuth } from '@/app/lib/api-auth';

export async function GET(request: Request) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';

    const tenants = await fetchFilteredTenants(query);
    return NextResponse.json(tenants);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch tenants' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const body = await request.json();
    const { name, email, password, propertyId, moveInDate, unitOccupied, emergencyContact } = body;

    if (!name || !email || !propertyId || !moveInDate || !unitOccupied || !emergencyContact) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tenant = await createTenant({
      name,
      email,
      password,
      propertyId,
      moveInDate: new Date(moveInDate),
      unitOccupied,
      emergencyContact,
    });

    return NextResponse.json(tenant, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create tenant' }, { status: 500 });
  }
}
