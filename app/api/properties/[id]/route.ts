import { NextRequest, NextResponse } from 'next/server';
import { fetchPropertyById, updateProperty, deleteProperty } from '@/app/lib/data';
import { UpdatePropertyPayload } from '@/app/lib/types';
import { requireAuth } from '@/app/lib/api-auth';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const { id } = await props.params;
    const property = await fetchPropertyById(id);

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const { id } = await props.params;
    const body: UpdatePropertyPayload = await request.json();

    const property = await updateProperty(id, body);
    return NextResponse.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const { id } = await props.params;
    await deleteProperty(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
