import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import CreatePropertyForm from '@/app/ui/properties/create-form';
import { lusitana } from '@/app/ui/fonts';

export const metadata: Metadata = {
  title: 'Create Property',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Properties', href: '/dashboard/properties' },
          {
            label: 'Create Property',
            href: '/dashboard/properties/create',
            active: true,
          },
        ]}
      />
      <div className="flex w-full flex-col items-center">
        <div className="w-full max-w-2xl">
          <h1 className={`${lusitana.className} mb-8 text-2xl`}>
            Create Property
          </h1>
          <CreatePropertyForm />
        </div>
      </div>
    </main>
  );
}

