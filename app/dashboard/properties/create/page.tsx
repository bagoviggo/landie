import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import CreatePropertyForm from '@/app/ui/properties/create-form';
import { lusitana } from '@/app/ui/fonts';
import { auth } from '@/auth';
import { fetchFilteredLandlords } from '@/app/lib/data';

export const metadata: Metadata = { title: 'Create Property' };

export default async function Page() {
  const session = await auth();
  const user = session?.user as any;
  const role = user?.role as string;
  const landlordId = user?.landlordId as string | null;

  const landlords = role === 'admin' ? await fetchFilteredLandlords('') : [];

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Properties', href: '/dashboard/properties' },
          { label: 'Create Property', href: '/dashboard/properties/create', active: true },
        ]}
      />
      <div className="flex w-full flex-col items-center">
        <div className="w-full max-w-2xl">
          <h1 className={`${lusitana.className} mb-8 text-2xl`}>Create Property</h1>
          <CreatePropertyForm role={role} landlordId={landlordId} landlords={landlords} />
        </div>
      </div>
    </main>
  );
}import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import CreatePropertyForm from '@/app/ui/properties/create-form';
import { lusitana } from '@/app/ui/fonts';
import { auth } from '@/auth';
import { fetchFilteredLandlords } from '@/app/lib/data';

export const metadata: Metadata = { title: 'Create Property' };

export default async function Page() {
  const session = await auth();
  const user = session?.user as any;
  const role = user?.role as string;
  const landlordId = user?.landlordId as string | null;

  const landlords = role === 'admin' ? await fetchFilteredLandlords('') : [];

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label::Ex 'Properties', href: '/dashboard/properties' },
          { label: 'Create Property', href: '/dashboard/properties/create', active: true },
        ]}
      />
      <div className="flex w-full flex-col items-center">
        <div className="w-full max-w-2xl">
          <h1 className={`${lusitana.className} mb-8 text-2xl`}>Create Property</h1>
          <CreatePropertyForm role={role} landlordId={landlordId} landlords={landlords} />
        </div>
      </div>
    </main>
  );
}
