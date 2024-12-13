// app/ui/dashboard/revenue-chart.tsx
import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { Revenue } from '@/app/lib/types';

interface RevenueChartProps {
  revenue: Revenue[];
}

export default function RevenueChart({ revenue }: RevenueChartProps) {
  const chartHeight = 350;

  // Find the maximum revenue to determine the scaling factor
  const maxRevenue = Math.max(...revenue.map((r) => r.revenue));
  const scalingFactor = maxRevenue > 10000 ? maxRevenue / 10000 : 1;

  // Normalize the revenue data
  const normalizedRevenue = revenue.map((r) => ({
    ...r,
    revenue: r.revenue / scalingFactor,
  }));

  const { yAxisLabels, topLabel } = generateYAxis(normalizedRevenue);

  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Revenue
      </h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {normalizedRevenue.map((month) => (
            <div key={month.month} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: `${(chartHeight / topLabel) * month.revenue}px`,
                }}
              ></div>
              <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                {month.month}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last {revenue.length} months</h3>
        </div>
      </div>
    </div>
  );
}