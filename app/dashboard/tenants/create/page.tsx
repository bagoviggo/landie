import React from 'react';
import { fetchProperties } from '@/app/lib/data';
import CreateTenantForm from '@/app/ui/tenants/create-form';
import { lusitana } from '@/app/ui/fonts';

export default async function Page() {
  const properties = await fetchProperties();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Create New Tenant
      </h1>
      <CreateTenantForm properties={properties} />
    </main>
  );
}

