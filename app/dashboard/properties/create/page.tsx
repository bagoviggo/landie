import { fetchTenants } from '@/app/lib/data';
import { auth } from '@/auth';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import CreateInvoiceForm from '@/app/ui/invoices/create-form';
import { lusitana } from '@/app/ui/fonts';

export default async function Page() {
  const session = await auth();
  const landlordId = (session?.user as any)?.landlordId ?? null;

  // Landlords only see their own tenants in the dropdown
  const tenants = await fetchTenants(landlordId);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          { label: 'Create Invoice', href: '/dashboard/invoices/create', active: true },
        ]}
      />
      <div className="flex w-full flex-col items-center">
        <div className="w-full max-w-2xl">
          <h1 className={`${lusitana.className} mb-8 text-2xl`}>Create Invoice</h1>
          <CreateInvoiceForm tenants={tenants} />
        </div>
      </div>
    </main>
  );
}
