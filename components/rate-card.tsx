'use client';

import { motion } from 'framer-motion';
import { formatPrice, formatRate } from '@/lib/utils';
import type { MetalRate, CurrencyRate } from '@/lib/types';
import type { BaseCurrency } from '@/store/rates';

/* ─────────────────────────────────────────────────────────────
   Per-metal gradient themes – gradient + gloss shine overlay
   ───────────────────────────────────────────────────────────── */
const METAL_THEMES = {
  XAU_24K: {
    gradient:
      'radial-gradient(ellipse at 40% 60%, #C8FF00 0%, #52B814 32%, #1B6B24 62%, #0A3D15 100%)',
    shine:
      'radial-gradient(circle at 28% 26%, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.07) 42%, transparent 66%)',
  },
  XAU_22K: {
    gradient:
      'radial-gradient(ellipse at 40% 60%, #FFE050 0%, #D49210 32%, #8B6000 62%, #4A3300 100%)',
    shine:
      'radial-gradient(circle at 28% 26%, rgba(255,255,230,0.38) 0%, rgba(255,210,40,0.07) 42%, transparent 66%)',
  },
  XAU_18K: {
    gradient:
      'radial-gradient(ellipse at 40% 60%, #FFBE52 0%, #D46514 32%, #8B3A00 62%, #4A1E00 100%)',
    shine:
      'radial-gradient(circle at 28% 26%, rgba(255,248,228,0.38) 0%, rgba(255,160,40,0.07) 42%, transparent 66%)',
  },
  XAG: {
    gradient:
      'radial-gradient(ellipse at 40% 60%, #D6E4EE 0%, #7A9CB2 32%, #385870 62%, #1A303E 100%)',
    shine:
      'radial-gradient(circle at 28% 26%, rgba(255,255,255,0.40) 0%, rgba(210,228,240,0.07) 42%, transparent 66%)',
  },
} as const;

type MetalSymbol = keyof typeof METAL_THEMES;

/* ─────────────────────────────────────────────────────────────
   Toggle pill – shows trend direction (matches image exactly)
   ───────────────────────────────────────────────────────────── */
function TogglePill({ pct }: { pct: number }) {
  const isUp   = pct >  0.01;
  const isDown = pct < -0.01;

  const trackBg = isDown
    ? 'rgba(239,68,68,0.75)'
    : isUp
    ? '#22c55e'
    : 'rgba(255,255,255,0.18)';

  return (
    <div
      className="flex items-center rounded-full px-[3px] transition-colors duration-300"
      style={{ width: 44, height: 24, backgroundColor: trackBg }}
    >
      <div
        className="h-[18px] w-[18px] rounded-full bg-white shadow-md transition-[margin] duration-300"
        style={{ marginLeft: isUp ? 'auto' : 0 }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MetalRateCard — pixel-perfect match to the provided design
   ───────────────────────────────────────────────────────────── */
interface MetalCardProps {
  item:               MetalRate;
  convertedPrice:     number;
  convertedGramPrice: number;
  baseCurrency:       BaseCurrency;
  index:              number;
}

export function MetalRateCard({
  item,
  convertedPrice,
  convertedGramPrice,
  baseCurrency,
  index,
}: MetalCardProps) {
  const theme = METAL_THEMES[item.symbol as MetalSymbol] ?? METAL_THEMES.XAG;
  const purity = item.karat ? `${item.karat} · ${Math.round((parseInt(item.karat) / 24) * 100)}% Pure` : 'Pure Silver';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.07, duration: 0.45, ease: 'easeOut' },
      }}
      whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } }}
      /* Card shell */
      className="relative overflow-hidden"
      style={{
        aspectRatio: '8 / 5',
        borderRadius: 22,
        backgroundColor: '#0c0c0c',
        boxShadow: '0 0 0 1.5px rgba(0,0,0,0.85), 0 20px 40px rgba(0,0,0,0.4)',
      }}
    >
      {/* ── Colored top panel with elliptical bottom curve ── */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: 0,
          left: '-6%',
          right: '-6%',
          height: '64%',
          background: theme.gradient,
          /* The elliptical border-radius creates the soft curved divider */
          borderRadius: '0 0 50% 50% / 0 0 30px 30px',
        }}
      >
        {/* Glossy shine reflection */}
        <div className="absolute inset-0" style={{ background: theme.shine }} />
      </div>

      {/* ── Two overlapping semi-transparent circles (chip motif) ── */}
      <div className="absolute left-4 top-4 flex items-center">
        <div
          className="h-9 w-9 rounded-full ring-1 ring-white/25"
          style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(6px)' }}
        />
        <div
          className="h-9 w-9 -ml-3.5 rounded-full ring-1 ring-white/15"
          style={{ background: 'rgba(255,255,255,0.13)', backdropFilter: 'blur(6px)' }}
        />
      </div>

      {/* ── Price — the hero ── */}
      <div className="absolute right-4 top-3.5 text-right">
        <p
          className="font-bold leading-none tracking-tight text-white tabular-nums"
          style={{ fontSize: 26, textShadow: '0 1px 8px rgba(0,0,0,0.25)' }}
        >
          {formatPrice(convertedPrice, baseCurrency)}
        </p>
        <p className="mt-[5px] font-semibold uppercase text-white/55" style={{ fontSize: 9, letterSpacing: '0.16em' }}>
          Per Troy Oz
        </p>
      </div>

      {/* ── Dark bottom content ── */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-end justify-between"
        style={{ top: '58%', paddingLeft: 16, paddingRight: 16, paddingBottom: 14 }}
      >
        <div>
          <p className="font-semibold text-white" style={{ fontSize: 14, lineHeight: 1.3 }}>
            {item.name}
          </p>
          <p className="mt-0.5 text-white/38" style={{ fontSize: 11 }}>
            {purity} &middot;{' '}
            <span className="text-white/55">{formatPrice(convertedGramPrice, baseCurrency)}/g</span>
          </p>
        </div>

        <TogglePill pct={item.changePercent24h} />
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────────────────────
   Currency flags
   ───────────────────────────────────────────────────────────── */
const CURRENCY_FLAGS: Record<string, string> = {
  EUR: '🇪🇺', GBP: '🇬🇧', JPY: '🇯🇵', AUD: '🇦🇺',
  CAD: '🇨🇦', CHF: '🇨🇭', CNY: '🇨🇳', INR: '🇮🇳',
  SGD: '🇸🇬', HKD: '🇭🇰', NZD: '🇳🇿', TRY: '🇹🇷',
  BRL: '🇧🇷', KRW: '🇰🇷', SEK: '🇸🇪', NOK: '🇳🇴',
  USD: '🇺🇸',
};

/* ─────────────────────────────────────────────────────────────
   CurrencyRateCard — dark-glass style matching the theme
   ───────────────────────────────────────────────────────────── */
interface CurrencyCardProps {
  item:          CurrencyRate;
  convertedRate: number;
  baseCurrency:  BaseCurrency;
  index:         number;
}

export function CurrencyRateCard({ item, convertedRate, baseCurrency, index }: CurrencyCardProps) {
  const flag = CURRENCY_FLAGS[item.symbol] ?? '🌐';

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.035, duration: 0.4, ease: 'easeOut' },
      }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="relative overflow-hidden rounded-2xl border border-[--border] bg-[--surface]"
      style={{ padding: '14px 16px' }}
    >
      {/* Subtle top edge shine */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)' }}
      />

      <div className="flex items-center justify-between gap-3">
        {/* Flag + name */}
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg"
            style={{ background: 'rgba(255,255,255,0.05)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
          >
            {flag}
          </span>
          <div>
            <p className="text-sm font-semibold text-[--fg]">{item.symbol}</p>
            <p className="max-w-[130px] truncate text-[11px] text-[--fg-subtle]">{item.name}</p>
          </div>
        </div>

        {/* Rate */}
        <div className="text-right">
          <p className="text-base font-bold tabular-nums tracking-tight text-[--fg]">
            {formatRate(convertedRate)}
          </p>
          <p className="text-[10px] text-[--fg-subtle]">
            1 {baseCurrency} = {item.symbol}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
