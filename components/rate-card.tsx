'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatPrice, formatRate, formatChange } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { MetalRate, CurrencyRate } from '@/lib/types';
import type { BaseCurrency } from '@/store/rates';

export const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.04, ease: 'easeOut' as const },
  }),
};

const METAL_STYLE: Record<string, { icon: string; glow: string; badge: string }> = {
  XAU_24K: {
    icon: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20',
    glow: 'hover:shadow-amber-500/5 hover:ring-amber-500/20',
    badge: 'Au 24K',
  },
  XAU_22K: {
    icon: 'bg-amber-500/8 text-amber-600/90 dark:text-amber-500 ring-1 ring-amber-500/15',
    glow: 'hover:shadow-amber-500/5 hover:ring-amber-500/15',
    badge: 'Au 22K',
  },
  XAU_18K: {
    icon: 'bg-amber-600/8 text-amber-700/90 dark:text-amber-600 ring-1 ring-amber-600/15',
    glow: 'hover:shadow-amber-600/5 hover:ring-amber-600/15',
    badge: 'Au 18K',
  },
  XAG: {
    icon: 'bg-slate-400/10 text-slate-500 dark:text-slate-400 ring-1 ring-slate-400/20',
    glow: 'hover:shadow-slate-400/5 hover:ring-slate-400/20',
    badge: 'Ag',
  },
};

const CURRENCY_FLAGS: Record<string, string> = {
  EUR: '🇪🇺', GBP: '🇬🇧', JPY: '🇯🇵', AUD: '🇦🇺',
  CAD: '🇨🇦', CHF: '🇨🇭', CNY: '🇨🇳', INR: '🇮🇳',
  SGD: '🇸🇬', HKD: '🇭🇰', NZD: '🇳🇿', TRY: '🇹🇷',
  BRL: '🇧🇷', KRW: '🇰🇷', SEK: '🇸🇪', NOK: '🇳🇴',
  USD: '🇺🇸',
};

function ChangeChip({ pct }: { pct: number }) {
  const abs = Math.abs(pct);
  const isFlat = abs < 0.01;
  const isUp = pct > 0;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums',
        isFlat && 'bg-[--border] text-[--fg-subtle]',
        !isFlat && isUp && 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
        !isFlat && !isUp && 'bg-red-500/10 text-red-700 dark:text-red-400'
      )}
    >
      {isFlat
        ? <Minus className="h-2.5 w-2.5" />
        : isUp
        ? <TrendingUp className="h-2.5 w-2.5" />
        : <TrendingDown className="h-2.5 w-2.5" />}
      {isFlat ? '0.00%' : formatChange(pct, true)}
    </span>
  );
}

interface MetalCardProps {
  item: MetalRate;
  convertedPrice: number;
  convertedGramPrice: number;
  baseCurrency: BaseCurrency;
  index: number;
}

export function MetalRateCard({ item, convertedPrice, convertedGramPrice, baseCurrency, index }: MetalCardProps) {
  const style = METAL_STYLE[item.symbol] ?? METAL_STYLE['XAG'];
  const purity = item.karat ? Math.round((parseInt(item.karat) / 24) * 100) : 100;

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-[--border] bg-[--surface] p-5',
        'backdrop-blur-xl transition-shadow duration-200',
        'hover:border-[--border-strong] hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30',
        style.glow,
        'ring-1 ring-transparent'
      )}
    >
      {/* Subtle top gradient shine */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/8" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold', style.icon)}>
            {style.badge}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[--fg]">{item.name}</h3>
            {item.karat && (
              <p className="text-[11px] text-[--fg-subtle]">
                {purity}% pure &middot; {item.karat}
              </p>
            )}
          </div>
        </div>
        <ChangeChip pct={item.changePercent24h} />
      </div>

      {/* Hero price */}
      <div className="mt-5">
        <p className="text-2xl font-bold tabular-nums tracking-tight text-[--fg]">
          {formatPrice(convertedPrice, baseCurrency)}
        </p>
        <p className="mt-0.5 text-xs text-[--fg-subtle]">per troy ounce</p>
      </div>

      {/* Secondary row */}
      <div className="mt-4 flex items-center justify-between border-t border-[--border] pt-3 text-xs text-[--fg-subtle]">
        <span>Per gram</span>
        <span className="font-mono tabular-nums text-[--fg-muted]">
          {formatPrice(convertedGramPrice, baseCurrency)}
        </span>
      </div>
    </motion.article>
  );
}

interface CurrencyCardProps {
  item: CurrencyRate;
  convertedRate: number;
  baseCurrency: BaseCurrency;
  index: number;
}

export function CurrencyRateCard({ item, convertedRate, baseCurrency, index }: CurrencyCardProps) {
  const flag = CURRENCY_FLAGS[item.symbol] ?? '🌐';

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -1, transition: { duration: 0.15 } }}
      className="group rounded-xl border border-[--border] bg-[--surface] p-4 backdrop-blur-xl transition-all duration-200 hover:border-[--border-strong] hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[--bg-subtle] text-base ring-1 ring-[--border]">
            {flag}
          </span>
          <div>
            <p className="text-sm font-semibold text-[--fg]">{item.symbol}</p>
            <p className="max-w-[130px] truncate text-[11px] text-[--fg-subtle]">{item.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-base font-bold tabular-nums tracking-tight text-[--fg]">
            {formatRate(convertedRate)}
          </p>
          <p className="text-[10px] text-[--fg-subtle]">
            1 {baseCurrency} = {formatRate(convertedRate)} {item.symbol}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
