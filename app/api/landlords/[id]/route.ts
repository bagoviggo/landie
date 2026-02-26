import { NextResponse } from 'next/server';
import { fetchLandlordById, updateLandlord, deleteLandlord } from '@/app/lib/data';
import { requireAuth } from '@/app/lib/api-auth';

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const { id } = await props.params;
    const landlord = await fetchLandlordById(id);

    if (!landlord) {
      return NextResponse.json({ error: 'Landlord not found' }, { status: 404 });
    }

    return NextResponse.json(landlord);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch landlord' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const { id } = await props.params;
    const { name, email, companyName } = await request.json();

    const landlord = await updateLandlord(id, { name, email, companyName });
    return NextResponse.json(landlord);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to update landlord' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const { id } = await props.params;
    await deleteLandlord(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to delete landlord' }, { status: 500 });
  }
}
