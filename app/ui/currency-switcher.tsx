'use client';

import { useCurrency } from '@/app/context/currency-context';

export default function CurrencySwitch() {
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