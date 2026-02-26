'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BuildingOfficeIcon,
  HomeIcon,
  HashtagIcon,
} from '@heroicons/react/24/outline';

type LandlordOption = {
  id: string;
  name: string;
  company_name: string;
};

export default function CreatePropertyForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [landlords, setLandlords] = useState<LandlordOption[]>([]);
  const [loadingLandlords, setLoadingLandlords] = useState(true);

  useEffect(() => {
    async function fetchLandlords() {
      try {
        const res = await fetch('/api/landlords');
        if (res.ok) {
          const data = await res.json();
          setLandlords(data);
        }
      } catch (err) {
        console.error('Failed to fetch landlords:', err);
      } finally {
        setLoadingLandlords(false);
      }
    }
    fetchLandlords();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      address: formData.get('address') as string,
      totalUnits: Number(formData.get('totalUnits')),
      landlordId: formData.get('landlordId') as string,
    };

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Failed to create property');
        return;
      }

      router.push('/dashboard/properties');
    } catch (err) {
      console.error('Error creating property:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Address */}
      <div>
        <label htmlFor="address" className="mb-2 block text-sm font-medium">
          Address
        </label>
        <div className="relative">
          <input
            id="address"
            name="address"
            type="text"
            required
            placeholder="e.g. 123 Main Street, Nairobi"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          />
          <HomeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>

      {/* Total Units */}
      <div>
        <label htmlFor="totalUnits" className="mb-2 block text-sm font-medium">
          Total Units
        </label>
        <div className="relative">
          <input
            id="totalUnits"
            name="totalUnits"
            type="number"
            min="1"
            required
            placeholder="e.g. 12"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          />
          <HashtagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>

      {/* Landlord */}
      <div>
        <label htmlFor="landlordId" className="mb-2 block text-sm font-medium">
          Landlord
        </label>
        <div className="relative">
          <select
            id="landlordId"
            name="landlordId"
            required
            defaultValue=""
            disabled={loadingLandlords}
            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 disabled:opacity-50"
          >
            <option value="" disabled>
              {loadingLandlords ? 'Loading landlords...' : 'Select a landlord'}
            </option>
            {landlords.map((landlord) => (
              <option key={landlord.id} value={landlord.id}>
                {landlord.name} — {landlord.company_name}
              </option>
            ))}
          </select>
          <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
        {!loadingLandlords && landlords.length === 0 && (
          <p className="mt-1 text-xs text-amber-600">
            No landlords found. Please{' '}
            <Link href="/dashboard/landlords/create" className="underline">
              create a landlord
            </Link>{' '}
            first.
          </p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Link
          href="/dashboard/properties"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isLoading || loadingLandlords}
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Property'}
        </button>
      </div>
    </form>
  );
}

