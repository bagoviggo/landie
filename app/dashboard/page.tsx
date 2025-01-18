'use client';
import { useState } from 'react';
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { revenue, invoices } from '../lib/placeholder-data';

const totalPaidInvoices = invoices.filter(invoice => invoice.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0);
const totalPendingInvoices = invoices.filter(invoice => invoice.status === 'pending').reduce((sum, invoice) => sum + invoice.amount, 0);
const numberOfInvoices = invoices.length;
const numberOfCustomers = new Set(invoices.map(invoice => invoice.tenant_id)).size;

export default function Page() {
  const [range, setRange] = useState([0, revenue.length - 1]);

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card title="Total Customers" value={numberOfCustomers} type="tenants" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue.slice(range[0], range[1] + 1)} />
<<<<<<< HEAD
        {/*<LatestInvoices latestInvoices={invoices} />*/}
=======
        {/*<LatestInvoices latestInvoices={invoices} />/*}
>>>>>>> a5f12bf644bc84e43f63cb6748462ebf0505dcd3
      </div>
      <div className="mt-6">
        <input
          type="range"
          min="0"
          max={revenue.length - 1}
          value={range[0]}
          onChange={(e) => setRange([Number(e.target.value), range[1]])}
          className="mr-2"
          aria-label="Start range"
        />
        <input
          type="range"
          min="0"
          max={revenue.length - 1}
          value={range[1]}
          onChange={(e) => setRange([range[0], Number(e.target.value)])}
          aria-label="End range"
        />
      </div>
    </main>
  );
}
