import { Metadata } from 'next';
import CreateLandlordForm from '@/app/ui/landlords/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { lusitana } from '@/app/ui/fonts';

export const metadata: Metadata = {
  title: 'Create Landlord',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Landlords', href: '/dashboard/landlords' },
          {
            label: 'Create Landlord',
            href: '/dashboard/landlords/create',
            active: true,
          },
        ]}
      />
      <div className="flex w-full flex-col items-center">
        <div className="w-full max-w-2xl">
          <h1 className={`${lusitana.className} mb-8 text-2xl`}>
            Create Landlord
          </h1>
          <CreateLandlordForm />
        </div>
      </div>
    </main>
  );
}
