import { fetchFilteredLandlords } from '@/app/lib/data';
import { formatCurrency } from '@/app/lib/utils';
import { DeleteLandlord, UpdateLandlord } from './buttons';
import { LandlordsTableType } from '@/app/lib/types';

export default async function LandlordsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const landlords = await fetchFilteredLandlords(query);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {landlords?.map((landlord) => (
              <div
                key={landlord.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{landlord.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{landlord.email}</p>
                    <p className="text-sm text-gray-500">{landlord.company_name}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {landlord.total_properties} properties
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateLandlord id={landlord.id} />
                    <DeleteLandlord id={landlord.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Company
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Properties
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {landlords?.map((landlord) => (
                <tr
                  key={landlord.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{landlord.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {landlord.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {landlord.company_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {landlord.total_properties}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateLandlord id={landlord.id} />
                      <DeleteLandlord id={landlord.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
