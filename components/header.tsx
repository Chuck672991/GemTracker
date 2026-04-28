'use client';

import { motion } from 'framer-motion';
import { Gem, Sun, Moon, RefreshCw } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useRatesStore, BASE_CURRENCY_META, type BaseCurrency } from '@/store/rates';
import { cn } from '@/lib/utils';

const CURRENCIES: BaseCurrency[] = ['USD', 'INR', 'EUR'];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-8 w-8" />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-[--fg-subtle] transition-colors hover:bg-[--surface-hover] hover:text-[--fg-muted]"
      aria-label="Toggle theme"
    >
      {theme === 'dark'
        ? <Sun className="h-4 w-4" />
        : <Moon className="h-4 w-4" />}
    </button>
  );
}

function CurrencySwitcher() {
  const { baseCurrency, setBaseCurrency } = useRatesStore();

  return (
    <div
      className="relative flex items-center rounded-lg border border-[--border] bg-[--bg-subtle] p-0.5"
      role="group"
      aria-label="Base currency"
    >
      {CURRENCIES.map((code) => {
        const meta = BASE_CURRENCY_META[code];
        const isActive = baseCurrency === code;
        return (
          <button
            key={code}
            onClick={() => setBaseCurrency(code)}
            className={cn(
              'relative z-10 flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors',
              isActive
                ? 'text-[--fg]'
                : 'text-[--fg-subtle] hover:text-[--fg-muted]'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="currency-pill"
                className="absolute inset-0 rounded-md bg-[--surface] shadow-sm ring-1 ring-[--border]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">{meta.flag}</span>
            <span className="relative">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}

interface HeaderProps {
  isFetching?: boolean;
  lastUpdated?: string | null;
  onRefresh?: () => void;
}

export function Header({ isFetching, lastUpdated, onRefresh }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[--border] bg-[--bg]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 ring-1 ring-amber-500/25">
            <Gem className="h-4 w-4 text-[--gold]" />
          </div>
          <div className="leading-none">
            <span className="text-sm font-semibold tracking-tight text-[--fg]">GemTracker</span>
            <span className="ml-1.5 hidden rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400 sm:inline">
              LIVE
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="hidden text-xs text-[--fg-subtle] lg:block">
              {lastUpdated}
            </span>
          )}
          <CurrencySwitcher />
          <button
            onClick={onRefresh}
            disabled={isFetching}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[--fg-subtle] transition-colors hover:bg-[--surface-hover] hover:text-[--fg-muted] disabled:opacity-40"
            aria-label="Refresh rates"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
