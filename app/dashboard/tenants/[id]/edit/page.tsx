import React from 'react';
import { fetchTenantById, fetchProperties } from '@/app/lib/data';
import EditTenantForm from '@/app/ui/tenants/edit-form';
import { lusitana } from '@/app/ui/fonts';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { auth } from '@/auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Tenant',
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const landlordId = (session?.user as any)?.landlordId ?? null;

  const [tenant, properties] = await Promise.all([
    fetchTenantById(id),
    fetchProperties(landlordId),
  ]);

  if (!tenant) notFound();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Tenants', href: '/dashboard/tenants' },
          { label: 'Edit Tenant', href: `/dashboard/tenants/${id}/edit`, active: true },
        ]}
      />
      <div className="flex w-full flex-col items-center">
        <div className="w-full max-w-2xl">
          <h1 className={`${lusitana.className} mb-8 text-2xl`}>Edit Tenant</h1>
          <EditTenantForm tenant={tenant} properties={properties} />
        </div>
      </div>
    </main>
  );
}
