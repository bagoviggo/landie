import React from 'react';
import { fetchLandlordById } from '@/app/lib/data';
import EditLandlordForm from '@/app/ui/landlords/edit-form';
import { lusitana } from '@/app/ui/fonts';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Landlord',
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const landlord = await fetchLandlordById(resolvedParams.id);

  if (!landlord) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Landlords', href: '/dashboard/landlords' },
          {
            label: 'Edit Landlord',
            href: `/dashboard/landlords/${resolvedParams.id}/edit`,
            active: true,
          },
        ]}
      />
      <div className="flex w-full flex-col items-center">
        <div className="w-full max-w-2xl">
          <h1 className={`${lusitana.className} mb-8 text-2xl`}>
            Edit Landlord
          </h1>
          <EditLandlordForm landlord={landlord} />
        </div>
      </div>
    </main>
  );
}

