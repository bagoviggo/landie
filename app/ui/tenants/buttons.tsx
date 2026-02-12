'use client';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function CreateTenantButton() {
  return (
    <Link
      href="/dashboard/tenants/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Tenant</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function EditTenantButton({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/tenants/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteTenantButton({ id }: { id: string }) {
  const router = useRouter();

  const deleteTenant = async () => {
    if (confirm('Are you sure you want to delete this tenant?')) {
      try {
        await fetch(`/api/tenants/${id}`, {
          method: 'DELETE',
        });
        router.refresh();
      } catch (error) {
        console.error('Failed to delete tenant:', error);
      }
    }
  };

  return (
    <button
      onClick={deleteTenant}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <TrashIcon className="w-5" />
    </button>
  );
}

