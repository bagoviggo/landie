import { lusitana } from '@/app/ui/fonts';
import { prisma } from '@/app/lib/prisma';
import { approveLandlord, rejectLandlord } from '@/app/lib/actions';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

async function getPendingLandlords() {
  return prisma.landlord.findMany({
    where: { approvedAt: null },
    include: {
      user: {
        select: { name: true, email: true, phone: true, createdAt: true },
      },
    },
    orderBy: { user: { createdAt: 'asc' } },
  });
}

async function getApprovedLandlords() {
  return prisma.landlord.findMany({
    where: { approvedAt: { not: null } },
    include: {
      user: {
        select: { name: true, email: true, createdAt: true },
      },
      properties: true,
    },
    orderBy: { approvedAt: 'desc' },
  });
}

export default async function AdminPage() {


  const [pending, approved] = await Promise.all([
    getPendingLandlords(),
    getApprovedLandlords(),
  ]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className={`${lusitana.className} text-2xl`}>Admin Panel</h1>
        <div className="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700">
          <ClockIcon className="h-4 w-4" />
          {pending.length} pending approval{pending.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Pending Approvals */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-700 flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-amber-500" />
          Pending Approvals
        </h2>

        {pending.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="text-sm text-gray-500">No pending approvals — you're all caught up.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Registered</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pending.map((landlord) => (
                  <tr key={landlord.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {landlord.user.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {landlord.user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {landlord.user.phone || '—'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(landlord.user.createdAt).toLocaleDateString('en-KE', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <form action={approveLandlord.bind(null, landlord.id)}>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-500 transition-colors"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                            Approve
                          </button>
                        </form>
                        <form action={rejectLandlord.bind(null, landlord.id)}>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500 transition-colors"
                          >
                            <XCircleIcon className="h-4 w-4" />
                            Reject
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Approved Landlords */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-700 flex items-center gap-2">
          <UserGroupIcon className="h-5 w-5 text-green-500" />
          Approved Landlords ({approved.length})
        </h2>

        {approved.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="text-sm text-gray-500">No approved landlords yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Properties</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Approved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {approved.map((landlord) => (
                  <tr key={landlord.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {landlord.user.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {landlord.user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {landlord.companyName || '—'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {landlord.properties.length}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {landlord.approvedAt
                        ? new Date(landlord.approvedAt).toLocaleDateString('en-KE', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
