'use client';

import { create } from 'zustand';

export type BaseCurrency = 'USD' | 'INR' | 'EUR';

export const BASE_CURRENCY_META: Record<BaseCurrency, { symbol: string; label: string; flag: string }> = {
  USD: { symbol: '$', label: 'USD', flag: '🇺🇸' },
  INR: { symbol: '₹', label: 'INR', flag: '🇮🇳' },
  EUR: { symbol: '€', label: 'EUR', flag: '🇪🇺' },
};

interface RatesStore {
  baseCurrency: BaseCurrency;
  setBaseCurrency: (currency: BaseCurrency) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const useRatesStore = create<RatesStore>((set) => ({
  baseCurrency: 'USD',
  setBaseCurrency: (baseCurrency) => set({ baseCurrency }),
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
