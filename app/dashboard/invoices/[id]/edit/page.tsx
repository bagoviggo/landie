import { fetchInvoiceById, fetchTenants } from '@/app/lib/data';
import { auth } from '@/auth';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import EditInvoiceForm from '@/app/ui/invoices/edit-form';
import { lusitana } from '@/app/ui/fonts';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const landlordId = (session?.user as any)?.landlordId ?? null;

  const [invoice, tenants] = await Promise.all([
    fetchInvoiceById(id),
    fetchTenants(landlordId),
  ]);

  if (!invoice) notFound();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          { label: 'Edit Invoice', href: `/dashboard/invoices/${id}/edit`, active: true },
        ]}
      />
      <div className="flex w-full flex-col items-center">
        <div className="w-full max-w-2xl">
          <h1 className={`${lusitana.className} mb-8 text-2xl`}>Edit Invoice</h1>
          <EditInvoiceForm invoice={invoice} tenants={tenants} />
        </div>
      </div>
    </main>
  );
}
