import { Suspense } from 'react';
import { fetchPropertiesPages } from '@/app/lib/data';
import { CreateProperty } from '@/app/ui/properties/buttons';
import PropertiesTable from '@/app/ui/properties/table';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import { PropertiesTableSkeleton } from '@/app/ui/skeletons';
import { auth } from '@/auth';
import Pagination from '@/app/ui/invoices/pagination';

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
  const totalPages = await fetchPropertiesPages(query, landlordId);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Properties</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search properties..." />
        <CreateProperty />
      </div>
      <Suspense key={query + currentPage} fallback={<PropertiesTableSkeleton />}>
        <PropertiesTable query={query} currentPage={currentPage} landlordId={landlordId} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
