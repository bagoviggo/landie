'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BuildingOfficeIcon,
  HomeIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

type LandlordOption = {
  id: string;
  name: string;
  company_name: string;
};

type Props = {
  role: string;
  landlordId: string | null;
  landlords: LandlordOption[];
};

type Scheme = 'numeric' | 'floor' | 'prefix' | 'manual';

function generateUnits(scheme: Scheme, opts: {
  count: number;
  floors: string;
  unitsPerFloor: number;
  prefix: string;
  manual: string[];
}): string[] {
  switch (scheme) {
    case 'numeric':
      return Array.from({ length: opts.count }, (_, i) =>
        String(i + 1).padStart(3, '0'),
      );

    case 'floor': {
      const floorLabels = opts.floors
        .split(',')
        .map((f) => f.trim().toUpperCase())
        .filter(Boolean);
      const units: string[] = [];
      for (const floor of floorLabels) {
        for (let u = 1; u <= opts.unitsPerFloor; u++) {
          units.push(`${floor}${u}`);
        }
      }
      return units;
    }

    case 'prefix':
      return Array.from({ length: opts.count }, (_, i) =>
        `${opts.prefix}${String(i + 1).padStart(2, '0')}`,
      );

    case 'manual':
      return opts.manual.filter(Boolean);

    default:
      return [];
  }
}

export default function CreatePropertyForm({ role, landlordId, landlords }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [scheme, setScheme] = useState<Scheme>('numeric');
  const [unitCount, setUnitCount] = useState(10);
  const [floors, setFloors] = useState('A, B, C');
  const [unitsPerFloor, setUnitsPerFloor] = useState(4);
  const [prefix, setPrefix] = useState('');
  const [manualUnits, setManualUnits] = useState<string[]>(['']);

  const preview = useMemo(
    () => generateUnits(scheme, { count: unitCount, floors, unitsPerFloor, prefix, manual: manualUnits }),
    [scheme, unitCount, floors, unitsPerFloor, prefix, manualUnits],
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const resolvedLandlordId =
      role === 'admin' ? (formData.get('landlordId') as string) : landlordId;

    if (!resolvedLandlordId) {
      setError('Landlord ID is missing. Please try again.');
      setIsLoading(false);
      return;
    }
    if (preview.length === 0) {
      setError('Please configure at least one unit.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: formData.get('address') as string,
          totalUnits: preview.length,
          landlordId: resolvedLandlordId,
          unitNames: preview,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Failed to create property');
        return;
      }

      router.push('/dashboard/properties');
      router.refresh();
    } catch (err) {
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
        <label htmlFor="address" className="mb-2 block text-sm font-medium">Address</label>
        <div className="relative">
          <input id="address" name="address" type="text" required
            placeholder="e.g. 123 Main Street, Nairobi"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500" />
          <HomeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>

      {/* Unit Naming */}
      <div>
        <label className="mb-2 block text-sm font-medium">Unit Naming</label>

        {/* Scheme picker */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {([
            { value: 'numeric',  label: 'Numeric',      example: '001, 002…' },
            { value: 'floor',    label: 'Floor + Unit', example: 'A1, A2, B1…' },
            { value: 'prefix',   label: 'Prefix',       example: 'GF-01, FF-01…' },
            { value: 'manual',   label: 'Manual',       example: 'Type each one' },
          ] as const).map((s) => (
            <button key={s.value} type="button" onClick={() => setScheme(s.value)}
              className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                scheme === s.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}>
              <div className="font-medium">{s.label}</div>
              <div className="mt-0.5 text-xs text-gray-400">{s.example}</div>
            </button>
          ))}
        </div>

        {/* Options per scheme */}
        <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
          {scheme === 'numeric' && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Number of units</label>
              <input type="number" min="1" max="500" value={unitCount}
                onChange={(e) => setUnitCount(Number(e.target.value))}
                className="w-32 rounded-md border border-gray-200 px-3 py-1.5 text-sm" />
            </div>
          )}

          {scheme === 'floor' && (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Floor labels (comma-separated)
                </label>
                <input type="text" value={floors} onChange={(e) => setFloors(e.target.value)}
                  placeholder="e.g. GF, A, B, C  or  1, 2, 3"
                  className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Units per floor</label>
                <input type="number" min="1" max="100" value={unitsPerFloor}
                  onChange={(e) => setUnitsPerFloor(Number(e.target.value))}
                  className="w-32 rounded-md border border-gray-200 px-3 py-1.5 text-sm" />
              </div>
            </div>
          )}

          {scheme === 'prefix' && (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Prefix (e.g. GF-, FF-, Block-A-)
                </label>
                <input type="text" value={prefix} onChange={(e) => setPrefix(e.target.value)}
                  placeholder="e.g. GF-"
                  className="w-40 rounded-md border border-gray-200 px-3 py-1.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Number of units</label>
                <input type="number" min="1" max="500" value={unitCount}
                  onChange={(e) => setUnitCount(Number(e.target.value))}
                  className="w-32 rounded-md border border-gray-200 px-3 py-1.5 text-sm" />
              </div>
            </div>
          )}

          {scheme === 'manual' && (
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-600">Unit names</label>
              <div className="space-y-2">
                {manualUnits.map((unit, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="text" value={unit}
                      onChange={(e) => setManualUnits((prev) => prev.map((u, idx) => idx === i ? e.target.value : u))}
                      placeholder={`Unit ${i + 1}`}
                      className="flex-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm" />
                    <button type="button" disabled={manualUnits.length === 1}
                      onClick={() => setManualUnits((prev) => prev.filter((_, idx) => idx !== i))}
                      className="rounded p-1 text-gray-400 hover:text-red-500 disabled:opacity-30">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button type="button"
                  onClick={() => setManualUnits((prev) => [...prev, ''])}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-500">
                  <PlusIcon className="h-3.5 w-3.5" /> Add unit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live preview */}
        {preview.length > 0 && (
          <div className="mt-3">
            <p className="mb-1.5 text-xs font-medium text-gray-500">
              Preview — {preview.length} unit{preview.length !== 1 ? 's' : ''}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {preview.slice(0, 30).map((u) => (
                <span key={u} className="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-xs text-blue-700">
                  {u}
                </span>
              ))}
              {preview.length > 30 && (
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
                  +{preview.length - 30} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Landlord — admins only */}
      {role === 'admin' && (
        <div>
          <label htmlFor="landlordId" className="mb-2 block text-sm font-medium">Landlord</label>
          <div className="relative">
            <select id="landlordId" name="landlordId" required defaultValue=""
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2">
              <option value="" disabled>Select a landlord</option>
              {landlords.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} — {l.company_name || 'No company'}
                </option>
              ))}
            </select>
            <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Link href="/dashboard/properties"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Cancel
        </Link>
        <button type="submit" disabled={isLoading || preview.length === 0}
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50">
          {isLoading ? 'Creating…' : `Create Property (${preview.length} units)`}
        </button>
      </div>
    </form>
  );
}
