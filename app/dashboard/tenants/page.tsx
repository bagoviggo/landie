import React from 'react';
import { Suspense } from 'react';
import { fetchFilteredTenants, fetchFilteredTenantsPages } from '@/app/lib/data';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import TenantsTable from '@/app/ui/tenants/table';
import Pagination from '@/app/ui/invoices/pagination';
import { CreateTenantButton } from '@/app/ui/tenants/buttons';
import { auth } from '@/auth';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const session = await auth();
  const landlordId = (session?.user as any)?.landlordId ?? null;

  const params = await searchParams;
  const query = params?.query || '';
  const currentPage = Number(params?.page) || 1;

  const tenants = await fetchFilteredTenants(query, landlordId);
  const totalPages = await fetchFilteredTenantsPages(query, landlordId);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Tenants</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search tenants..." />
        <CreateTenantButton />
      </div>
      <Suspense key={query + currentPage} fallback={<div>Loading tenants...</div>}>
        <TenantsTable tenants={tenants} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
