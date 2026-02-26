import { NextResponse } from 'next/server';
import { fetchTenantById, updateTenant, deleteTenant } from '@/app/lib/data';
import { requireAuth } from '@/app/lib/api-auth';

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const { id } = await props.params;
    const tenant = await fetchTenantById(id);

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    return NextResponse.json(tenant);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch tenant' }, { status: 500 });
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
    const { name, email, propertyId, moveInDate, unitOccupied, emergencyContact } = await request.json();

    const tenant = await updateTenant(id, {
      name,
      email,
      propertyId,
      moveInDate: moveInDate ? new Date(moveInDate) : undefined,
      unitOccupied,
      emergencyContact,
    });

    return NextResponse.json(tenant);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to update tenant' }, { status: 500 });
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
    await deleteTenant(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to delete tenant' }, { status: 500 });
  }
}
