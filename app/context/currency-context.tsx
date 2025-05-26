'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type CurrencyType = 'USD' | 'KES';

interface CurrencyContextType {
  currency: CurrencyType;
  toggleCurrency: () => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyType>('USD');

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'USD' ? 'KES' : 'USD');
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}