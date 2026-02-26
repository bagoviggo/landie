import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import EditPropertyForm from '@/app/ui/properties/edit-form';
import { fetchPropertyById } from '@/app/lib/data';
import { lusitana } from '@/app/ui/fonts';

export const metadata: Metadata = {
  title: 'Edit Property',
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await fetchPropertyById(id);

  if (!property) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Properties', href: '/dashboard/properties' },
          {
            label: 'Edit Property',
            href: `/dashboard/properties/${id}/edit`,
            active: true,
          },
        ]}
      />
      <div className="flex w-full flex-col items-center">
        <div className="w-full max-w-2xl">
          <h1 className={`${lusitana.className} mb-8 text-2xl`}>
            Edit Property
          </h1>
          <EditPropertyForm
            property={{
              id: property.id,
              address: property.address,
              totalUnits: property.totalUnits,
              landlordId: property.landlordId,
            }}
          />
        </div>
      </div>
    </main>
  );
}
