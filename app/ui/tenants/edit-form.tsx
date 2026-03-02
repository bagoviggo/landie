'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PropertyField } from '@/app/lib/types';
import { Button } from '@/app/ui/button';
import {
  HomeIcon,
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  HashtagIcon,
} from '@heroicons/react/24/outline';

export default function EditTenantForm({
  tenant,
  properties,
}: {
  tenant: any;
  properties: PropertyField[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // fetchTenantById includes { user: { name, email }, propertyId, unitOccupied, moveInDate, emergencyContact }
  const tenantName = tenant.user?.name ?? '';
  const tenantEmail = tenant.user?.email ?? '';
  const moveInDateValue = tenant.moveInDate
    ? new Date(tenant.moveInDate).toISOString().split('T')[0]
    : '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      propertyId: formData.get('propertyId') as string,
      unitOccupied: formData.get('unitOccupied') as string,
      moveInDate: formData.get('moveInDate') as string,
      emergencyContact: formData.get('emergencyContact') as string,
    };

    try {
      const response = await fetch(`/api/tenants/${tenant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update tenant');
      }

      router.push('/dashboard/tenants');
      router.refresh();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>
        )}

        {/* User Information */}
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-medium">User Information</h2>

          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">Full Name</label>
            <div className="relative">
              <input id="name" name="name" type="text" required
                defaultValue={tenantName}
                placeholder="Enter tenant's full name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500" />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">Email Address</label>
            <div className="relative">
              <input id="email" name="email" type="email" required
                defaultValue={tenantEmail}
                placeholder="Enter tenant's email"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500" />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Tenancy Details */}
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-medium">Tenancy Details</h2>

          {/* Property */}
          <div className="mb-4">
            <label htmlFor="propertyId" className="mb-2 block text-sm font-medium">Property</label>
            <div className="relative">
              <select id="propertyId" name="propertyId" required
                defaultValue={tenant.propertyId ?? ''}
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
                <option value="" disabled>Select a property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.address}{property.company_name ? ` (${property.company_name})` : ''}
                  </option>
                ))}
              </select>
              <HomeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Unit — free text */}
          <div className="mb-4">
            <label htmlFor="unitOccupied" className="mb-2 block text-sm font-medium">Unit Number</label>
            <div className="relative">
              <input id="unitOccupied" name="unitOccupied" type="text" required
                defaultValue={tenant.unitOccupied ?? ''}
                placeholder="e.g. 001, A2, GF-01"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500" />
              <HashtagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Move In Date */}
          <div className="mb-4">
            <label htmlFor="moveInDate" className="mb-2 block text-sm font-medium">Move In Date</label>
            <div className="relative">
              <input id="moveInDate" name="moveInDate" type="date" required
                defaultValue={moveInDateValue}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500" />
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mb-4">
            <label htmlFor="emergencyContact" className="mb-2 block text-sm font-medium">Emergency Contact</label>
            <div className="relative">
              <input id="emergencyContact" name="emergencyContact" type="text" required
                defaultValue={tenant.emergencyContact ?? ''}
                placeholder="Name and phone number"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500" />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link href="/dashboard/tenants"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Cancel
        </Link>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
