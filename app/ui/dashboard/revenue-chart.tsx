// app/ui/dashboard/revenue-chart.tsx
import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { Revenue } from '@/app/lib/types';
import { fetchRevenue } from '@/app/lib/data';

export default async function RevenueChart() {
  const revenue = await fetchRevenue();
  const chartHeight = 350;

  // Generate y-axis labels and scaling factor
  const { yAxisLabels, topLabel } = generateYAxis(
    revenue.map((month) => ({ revenue: month.total_revenue }))
  );

  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  // Sort months in chronological order by year and month
  const sortedRevenue = revenue.sort((a, b) => {
    const [yearA, monthA] = a.month.split('-').map(Number);
    const [yearB, monthB] = b.month.split('-').map(Number);

    // Compare by year first, then by month
    return yearA === yearB ? monthA - monthB : yearA - yearB;
  });

  return (
    <div className="w-full md:col-span-4 hidden sm:block">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Revenue
      </h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          {/* Y-Axis Labels */}
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{
              height: `${chartHeight}px`,
              marginRight: '2rem', // Increased margin for better spacing
            }}
          >
            {yAxisLabels.reverse().map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {/* Bars for Each Month */}
          {sortedRevenue.map((month) => (
            <div key={month.month} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: `${(chartHeight / topLabel) * month.total_revenue}px`,
                }}
              ></div>
              <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                {new Date(`${month.month}-01`).toLocaleDateString('en-US', {
                  month: 'short',
                })}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}