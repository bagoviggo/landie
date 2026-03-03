
import { prisma } from '@/app/lib/prisma';
import HousesClient from '@/app/ui/houses/houses-client';
import LandieLogo from '@/app/ui/landie-logo';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find a Home | Landie',
  description: 'Browse available rental properties and vacant units near you.',
};

export type VacantListing = {
  propertyId: string;
  address: string;
  companyName: string;
  vacantUnits: { id: string; unitNumber: string }[];
  totalUnits: number;
  occupiedCount: number;
};

async function fetchVacantListings(): Promise<VacantListing[]> {
  const properties = await prisma.property.findMany({
    where: {
      landlord: { approvedAt: { not: null } },
      units: { some: { status: 'available' } },
    },
    include: {
      landlord: { include: { user: { select: { name: true } } } },
      units: true,
    },
    orderBy: { address: 'asc' },
  });

  return properties.map((p) => ({
    propertyId: p.id,
    address: p.address,
    companyName: p.landlord.companyName,
    vacantUnits: p.units
      .filter((u) => u.status === 'available')
      .map((u) => ({ id: u.id, unitNumber: u.unitNumber })),
    totalUnits: p.totalUnits,
    occupiedCount: p.units.filter((u) => u.status === 'occupied').length,
  }));
}

export default async function HousesPage() {
  const listings = await fetchVacantListings();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-blue-950 shadow-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <LandieLogo />
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="rounded-lg border border-white px-4 py-2 text-sm text-white transition hover:bg-white hover:text-blue-950"
            >
              Tenant Login
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-300">
            Find Your Next Home
          </p>
          <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl">
            Discover Available Rentals
          </h1>
          <p className="mb-8 text-lg text-blue-200">
            Browse verified listings from approved landlords. Filter by location, availability, and more.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-blue-300">
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400"></span>
              {listings.reduce((acc, l) => acc + l.vacantUnits.length, 0)} units available
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-400"></span>
              {listings.length} properties listed
            </span>
          </div>
        </div>
      </section>

      {/* Listings */}
      <HousesClient listings={listings} />

      {/* Footer */}
      <footer className="mt-16 border-t bg-white px-4 py-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Landie. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4">
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
