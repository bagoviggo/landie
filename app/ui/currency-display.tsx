'use client';

import { useCurrency } from '@/app/context/currency-context';
import { formatCurrency } from '@/app/lib/utils';

export default function CurrencyDisplay({ amount }: { amount: number }) {
  const { currency } = useCurrency();
  return <span>{formatCurrency(amount, currency)}</span>;
}

export function CurrencyToggle() {
  const { currency, toggleCurrency } = useCurrency();
  return (
    <button
      onClick={toggleCurrency}
      className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
    >
      {currency}
    </button>
  );
}