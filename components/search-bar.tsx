'use client';

import { Search, X } from 'lucide-react';
import { useRatesStore } from '@/store/rates';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useRatesStore();

  return (
    <div className="relative w-full max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[--fg-subtle]" />
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Filter currencies..."
        className="h-9 w-full rounded-lg border border-[--border] bg-[--bg-subtle] pl-9 pr-8 text-sm text-[--fg] placeholder:text-[--fg-subtle] focus:border-[--border-strong] focus:outline-none focus:ring-2 focus:ring-[--ring]/20 transition-colors"
        aria-label="Filter currencies"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[--fg-subtle] hover:text-[--fg-muted] transition-colors"
          aria-label="Clear filter"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
