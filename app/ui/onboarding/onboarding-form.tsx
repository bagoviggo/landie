'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { completeOnboarding } from '@/app/lib/actions';
import {
  BuildingOfficeIcon,
  PhoneIcon,
  MapPinIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60"
    >
      {pending ? 'Saving…' : 'Submit for Review →'}
    </button>
  );
}

export default function OnboardingForm({ token }: { token: string }) {
  const [error, dispatch] = useActionState(completeOnboarding, undefined);

  return (
    <form action={dispatch} className="space-y-4">
      {/* Hidden token */}
      <input type="hidden" name="token" value={token} />

      {/* Company name */}
      <div>
        <label htmlFor="companyName" className="mb-1.5 block text-sm font-medium text-gray-700">
          Company / Trading name
        </label>
        <div className="relative">
          <input
            id="companyName"
            name="companyName"
            type="text"
            required
            placeholder="e.g. Wanjiku Properties Ltd"
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          <BuildingOfficeIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
          Phone number
        </label>
        <div className="relative">
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="e.g. +254 712 345 678"
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          <PhoneIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Operating area */}
      <div>
        <label htmlFor="operatingArea" className="mb-1.5 block text-sm font-medium text-gray-700">
          Where do you operate?
        </label>
        <div className="relative">
          <input
            id="operatingArea"
            name="operatingArea"
            type="text"
            required
            placeholder="e.g. Nairobi, Westlands & Kilimani"
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          <MapPinIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Town, county, or specific neighbourhoods
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
          <ExclamationCircleIcon className="h-4 w-4 shrink-0 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="pt-1">
        <SubmitButton />
      </div>

      <p className="text-center text-xs text-gray-400">
        Your account will be reviewed within 24 hours. You'll receive an email once approved.
      </p>
    </form>
  );
}
