import { PrismaClient } from '@prisma/client';
// Prisma client already has your schema types defined

const prisma = new PrismaClient();

export const formatCurrency = (
  amount: number,
  currency: 'USD' | 'KES' = 'USD',
) => {
  const rate = currency === 'KES' ? 138.5 : 1; // Example exchange rate
  const value = amount * rate;

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

// Using Prisma's type for revenue data
export const generateYAxis = (revenue: { revenue: number }[]) => {
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const interval = Math.ceil(highestRecord / 5 / 1000) * 1000; // Divide into 5 intervals, rounded to the nearest 1000
  const topLabel = Math.ceil(highestRecord / interval) * interval; // Round up to the nearest interval

  for (let i = 0; i <= topLabel; i += interval) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export const formatMonth = (month: { month: string }) => {
  if (!/^\d{4}-\d{2}$/.test(month.month)) {
    console.error(`Invalid month format: ${month.month}`);
    return 'Invalid';
  }

  return new Date(`${month.month}-01`).toLocaleDateString('en-US', {
    month: 'short',
  });
};
