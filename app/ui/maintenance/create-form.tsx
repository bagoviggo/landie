'use client';

import { useActionState } from 'react';
import { createMaintenanceRequest } from '@/app/lib/actions';

type Unit = {
  id: string;
  unitNumber: string;
  property: { address: string };
};

export default function CreateMaintenanceForm({ units }: { units: Unit[] }) {
  const [error, formAction, isPending] = useActionState(createMaintenanceRequest, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {/* Unit */}
      <div>
        <label htmlFor="unitId" className="mb-1.5 block text-xs font-medium text-gray-600">
          Unit
        </label>
        <select
          id="unitId"
          name="unitId"
          required
          defaultValue=""
          className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-2 focus:border-blue-500"
        >
          <option value="" disabled>Select a unit</option>
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.property.address} — Unit {unit.unitNumber}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="mb-1.5 block text-xs font-medium text-gray-600">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          placeholder="Describe the issue in detail…"
          className="block w-full resize-none rounded-md border border-gray-200 px-3 py-2 text-sm outline-2 placeholder:text-gray-400 focus:border-blue-500"
        />
      </div>

      {/* Initial status */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600">
          Initial Status
        </label>
        <div className="flex gap-4">
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="radio"
              name="status"
              value="open"
              defaultChecked
              className="h-4 w-4 border-gray-300 text-red-600"
            />
            <span className="text-xs font-medium text-red-600">Open</span>
          </label>
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="radio"
              name="status"
              value="in_progress"
              className="h-4 w-4 border-gray-300 text-amber-600"
            />
            <span className="text-xs font-medium text-amber-600">In Progress</span>
          </label>
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
      >
        {isPending ? 'Logging…' : 'Log Request'}
      </button>
    </form>
  );
}
