'use client';

import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useEffect } from 'react';
import { AlertCircle, Gem, DollarSign } from 'lucide-react';
import { MetalRateCard, CurrencyRateCard } from '@/components/rate-card';
import { MetalCardSkeleton, CurrencyCardSkeleton } from '@/components/rate-card-skeleton';
import { SearchBar } from '@/components/search-bar';
import { Header } from '@/components/header';
import { useRatesStore, BASE_CURRENCY_META } from '@/store/rates';
import { convertPrice, crossRate, formatTimestamp } from '@/lib/utils';
import type { RatesResponse } from '@/lib/types';

async function fetchRates(): Promise<RatesResponse> {
  const res = await fetch('/api/rates', { cache: 'no-store' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export function Dashboard({ initialData }: { initialData?: RatesResponse }) {
  const { baseCurrency, searchQuery } = useRatesStore();

  const { data, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['rates'],
    queryFn: fetchRates,
    initialData,
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
  });

  // Build a flat fxRates map: { EUR: 0.92, INR: 83.5, ... }
  const fxRates = useMemo(() => {
    const map: Record<string, number> = {};
    data?.currencies.forEach((c) => { map[c.symbol] = c.rate; });
    return map;
  }, [data?.currencies]);

  // Dynamic document title based on base currency
  useEffect(() => {
    const meta = BASE_CURRENCY_META[baseCurrency];
    document.title = `Gold & Silver Rates in ${meta.label} (${meta.symbol}) | GemTracker`;
  }, [baseCurrency]);

  // Metals with base-currency converted prices
  const convertedMetals = useMemo(() => {
    if (!data?.metals) return [];
    return data.metals.map((m) => ({
      ...m,
      convertedPrice: convertPrice(m.pricePerTroyOz, baseCurrency, fxRates),
      convertedGramPrice: convertPrice(m.pricePerGram, baseCurrency, fxRates),
    }));
  }, [data?.metals, baseCurrency, fxRates]);

  // Currencies filtered by search + cross-rate computed
  const filteredCurrencies = useMemo(() => {
    if (!data?.currencies) return [];
    const q = searchQuery.trim().toLowerCase();

    return data.currencies
      .filter((c) => c.symbol !== baseCurrency) // hide base from the list
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
      .map((c) => ({
        ...c,
        convertedRate: crossRate(c.rate, baseCurrency, fxRates),
      }));
  }, [data?.currencies, baseCurrency, fxRates, searchQuery]);

  const isLoading = !data && !isError;
  const lastUpdated = data?.lastUpdated ? formatTimestamp(data.lastUpdated) : null;

  return (
    <div className="relative min-h-screen bg-[--bg]">
      <Header
        isFetching={isFetching}
        lastUpdated={lastUpdated}
        onRefresh={() => refetch()}
      />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* Error banner */}
        <AnimatePresence>
          {isError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-600 dark:text-red-400"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error instanceof Error ? error.message : 'Failed to load rates. Retrying…'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Precious Metals ────────────────────────────── */}
        <section aria-label="Precious metals" className="mb-10">
          <div className="mb-5 flex items-center gap-2">
            <Gem className="h-4 w-4 text-[--gold]" />
            <h2 className="text-sm font-semibold text-[--fg]">Precious Metals</h2>
            <span className="text-xs text-[--fg-subtle]">
              · prices in {BASE_CURRENCY_META[baseCurrency].symbol}{BASE_CURRENCY_META[baseCurrency].label}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <MetalCardSkeleton key={i} />)
              : convertedMetals.map((item, i) => (
                  <MetalRateCard
                    key={item.symbol}
                    item={item}
                    convertedPrice={item.convertedPrice}
                    convertedGramPrice={item.convertedGramPrice}
                    baseCurrency={baseCurrency}
                    index={i}
                  />
                ))}
          </div>
        </section>

        {/* ── Currencies ─────────────────────────────────── */}
        <section aria-label="Currency exchange rates">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[--fg-subtle]" />
              <h2 className="text-sm font-semibold text-[--fg]">Exchange Rates</h2>
              {!isLoading && (
                <span className="text-xs text-[--fg-subtle]">
                  · {filteredCurrencies.length} pairs vs {baseCurrency}
                </span>
              )}
            </div>
            <SearchBar />
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: 12 }).map((_, i) => <CurrencyCardSkeleton key={i} />)
              : filteredCurrencies.map((item, i) => (
                  <CurrencyRateCard
                    key={item.symbol}
                    item={item}
                    convertedRate={item.convertedRate}
                    baseCurrency={baseCurrency}
                    index={i}
                  />
                ))}
          </div>

          {!isLoading && !isError && filteredCurrencies.length === 0 && searchQuery && (
            <div className="py-16 text-center">
              <p className="text-sm text-[--fg-subtle]">No currencies matching &ldquo;{searchQuery}&rdquo;</p>
              <button
                onClick={() => useRatesStore.getState().setSearchQuery('')}
                className="mt-2 text-xs text-[--gold] hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-12 border-t border-[--border]">
        <p className="py-6 text-center text-xs text-[--fg-subtle]">
          Gold &amp; silver spot prices via GoldAPI.io &middot; Exchange rates via ECB / Frankfurter &middot; For
          informational purposes only, not financial advice.
        </p>
      </footer>
    </div>
  );
}
