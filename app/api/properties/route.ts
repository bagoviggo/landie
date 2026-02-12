import { NextRequest, NextResponse } from 'next/server';
import { fetchFilteredProperties, fetchPropertiesPages, createProperty } from '@/app/lib/data';
import { CreatePropertyPayload } from '@/app/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const page = searchParams.get('page') || '1';

    const [properties, totalPages] = await Promise.all([
      fetchFilteredProperties(query),
      fetchPropertiesPages(query),
    ]);

    return NextResponse.json({
      properties,
      totalPages: Number(totalPages),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePropertyPayload = await request.json();

    if (!body.address || !body.totalUnits || !body.landlordId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const property = await createProperty({
      address: body.address,
      totalUnits: body.totalUnits,
      landlordId: body.landlordId,
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
