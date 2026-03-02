import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma';
import { lusitana } from '@/app/ui/fonts';
import { formatDateToLocal } from '@/app/lib/utils';
import {
  WrenchScrewdriverIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import CreateMaintenanceForm from '@/app/ui/maintenance/create-form';
import { StatusButtons, DeleteButton } from '@/app/ui/maintenance/buttons';

async function getData(landlordId: string | null) {
  const unitScope = landlordId ? { property: { landlordId } } : undefined;

  const [units, requests] = await Promise.all([
    prisma.unit.findMany({
      where: unitScope,
      include: { property: { select: { address: true } } },
      orderBy: [{ property: { address: 'asc' } }, { unitNumber: 'asc' }],
    }),
    prisma.maintenance.findMany({
      where: unitScope ? { unit: unitScope } : undefined,
      include: {
        unit: { include: { property: { select: { address: true } } } },
      },
      orderBy: { date: 'desc' },
    }),
  ]);

  return { units, requests };
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
      {
        'bg-red-100 text-red-700':     status === 'open',
        'bg-amber-100 text-amber-700': status === 'in_progress',
        'bg-green-100 text-green-700': status === 'resolved',
      },
    )}>
      {status === 'open'        && <ClockIcon className="h-3 w-3" />}
      {status === 'in_progress' && <ArrowPathIcon className="h-3 w-3" />}
      {status === 'resolved'    && <CheckCircleIcon className="h-3 w-3" />}
      {status === 'open' ? 'Open' : status === 'in_progress' ? 'In Progress' : 'Resolved'}
    </span>
  );
}

export default async function MaintenancePage() {
  const session = await auth();
  const landlordId = (session?.user as any)?.landlordId ?? null;

  const { units, requests } = await getData(landlordId);

  const counts = {
    open:        requests.filter((r) => r.status === 'open').length,
    in_progress: requests.filter((r) => r.status === 'in_progress').length,
    resolved:    requests.filter((r) => r.status === 'resolved').length,
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className={`${lusitana.className} text-2xl`}>Maintenance</h1>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
            <ClockIcon className="h-3.5 w-3.5" /> {counts.open} Open
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
            <ArrowPathIcon className="h-3.5 w-3.5" /> {counts.in_progress} In Progress
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            <CheckCircleIcon className="h-3.5 w-3.5" /> {counts.resolved} Resolved
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Log Request form */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
              <WrenchScrewdriverIcon className="h-5 w-5 text-gray-400" />
              Log Request
            </h2>
            {units.length === 0 ? (
              <p className="text-sm text-gray-400">
                No units found. Add a property with units first.
              </p>
            ) : (
              <CreateMaintenanceForm units={units} />
            )}
          </div>
        </div>

        {/* Requests list */}
        <div className="lg:col-span-2 space-y-3">
          {requests.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <WrenchScrewdriverIcon className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-500">No maintenance requests yet.</p>
            </div>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-400">
                      <span className="font-medium text-gray-500">{req.unit.property.address}</span>
                      <span>·</span>
                      <span className="font-mono">Unit {req.unit.unitNumber}</span>
                      <span>·</span>
                      <span>{formatDateToLocal(req.date.toString())}</span>
                    </div>
                    <p className="text-sm text-gray-800">{req.description}</p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                  <StatusButtons id={req.id} status={req.status} />
                  <DeleteButton id={req.id} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
