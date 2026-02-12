import React from 'react';
import { fetchTenantById, fetchProperties } from '@/app/lib/data';
import EditTenantForm from '@/app/ui/tenants/edit-form';
import { lusitana } from '@/app/ui/fonts';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const tenant = await fetchTenantById(params.id);

  if (!tenant) {
    notFound();
  }

  const properties = await fetchProperties();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Edit Tenant
      </h1>
      <EditTenantForm tenant={tenant} properties={properties} />
    </main>
  );
}

