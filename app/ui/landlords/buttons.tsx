'use client';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function CreateLandlord() {
  return (
    <Link
      href="/dashboard/landlords/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Landlord</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateLandlord({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/landlords/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteLandlord({ id }: { id: string }) {
  const router = useRouter();

  const deleteLandlord = async () => {
    if (confirm('Are you sure you want to delete this landlord?')) {
      try {
        await fetch(`/api/landlords/${id}`, {
          method: 'DELETE',
        });
        router.refresh();
      } catch (error) {
        console.error('Failed to delete landlord:', error);
      }
    }
  };

  return (
    <button
      onClick={deleteLandlord}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-5" />
    </button>
  );
}
