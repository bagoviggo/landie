'use client';

import { lusitana } from '@/app/ui/fonts';
import { useTransition } from 'react';
import { logout } from '@/app/lib/actions';
import { ClockIcon } from '@heroicons/react/24/outline';

export default function PendingApprovalPage() {
  const [isPending, startTransition] = useTransition();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md text-center">
        <div className="flex justify-center mb-4">
          <ClockIcon className="h-16 w-16 text-yellow-500" />
        </div>
        <h1 className={`${lusitana.className} mb-3 text-2xl text-gray-900`}>
          Account Pending Approval
        </h1>
        <p className="text-sm text-gray-600 mb-2">
          Your landlord account has been created and is currently awaiting
          approval from an administrator.
        </p>
        <p className="text-sm text-gray-600 mb-8">
          You'll have full access to the dashboard once your account has been
          approved. This usually takes 1–2 business days.
        </p>
        <button
          onClick={() => startTransition(() => logout())}
          disabled={isPending}
          className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-50"
        >
          {isPending ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    </main>
  );
}
