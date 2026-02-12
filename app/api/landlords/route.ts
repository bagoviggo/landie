import { NextResponse } from 'next/server';
import { fetchFilteredLandlords, createLandlord } from '@/app/lib/data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';

    const landlords = await fetchFilteredLandlords(query);
    return NextResponse.json(landlords);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch landlords' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      password,
      companyName,
    } = body;

    // Validate required fields
    if (!name || !email || !companyName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const landlord = await createLandlord({
      name,
      email,
      password,
      companyName,
    });

    return NextResponse.json(landlord, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create landlord' },
      { status: 500 }
    );
  }
}
