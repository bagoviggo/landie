import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';
import { Suspense } from 'react';
import { RevenueChartSkeleton, LatestInvoicesSkeleton } from '@/app/ui/skeletons';
import { CurrencyToggle } from '@/app/ui/currency-display';
import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();
  const landlordId = (session?.user as any)?.landlordId ?? null;

  const {
    numberOfInvoices,
    numberOfTenants,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData(landlordId);

  return (
    <main>
      <div className="flex justify-between items-center mb-4">
        <h1 className={`${lusitana.className} text-xl md:text-2xl`}>
          Dashboard
        </h1>
        <CurrencyToggle />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card title="Total Tenants" value={numberOfTenants} type="tenants" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart landlordId={landlordId} />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices landlordId={landlordId} />
        </Suspense>
      </div>
    </main>
  );
}
