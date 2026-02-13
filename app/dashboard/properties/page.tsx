import { Suspense } from 'react';
import { fetchPropertiesPages } from '@/app/lib/data';
import { CreateProperty } from '@/app/ui/properties/buttons';
import PropertiesTable from '@/app/ui/properties/table';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import { PropertiesTableSkeleton } from '@/app/ui/skeletons';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchPropertiesPages(query);

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
        <PropertiesTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        {/* Pagination can be added here if needed */}
      </div>
    </div>
  );
}
