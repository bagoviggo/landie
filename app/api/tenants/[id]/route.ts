import { NextResponse } from 'next/server';
import { fetchTenantById, updateTenant, deleteTenant } from '@/app/lib/data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const tenant = await fetchTenantById(id);

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tenant);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenant' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const {
      name,
      email,
      propertyId,
      moveInDate,
      unitOccupied,
      emergencyContact,
    } = body;

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
    return NextResponse.json(
      { error: 'Failed to update tenant' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await deleteTenant(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete tenant' },
      { status: 500 }
    );
  }
}

