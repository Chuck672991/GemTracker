'use client';

import { useMemo } from 'react';
import type { Metal, Country, UnitType } from './types';
import type { Theme } from './constants';
import { UNIT_LABELS } from './constants';
import { generateSeries } from './utils';

interface SpotPriceCardProps {
  metal:        Metal;
  country:      Country;
  unit:         UnitType;
  pricePerGram: number;
  predPerGram:  number;
  ccy:          string;
  chg:          string;
  theme:        Theme;
}

function MiniSparkline({ prices, color, gradId }: { prices: number[]; color: string; gradId: string }) {
  const w = 120; const h = 42;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const pts = prices.map((v, i) => ({
    x: (i / (prices.length - 1)) * w,
    y: h - 5 - ((v - min) / range) * (h - 12),
  }));
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.38" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SpotPriceCard({ metal, country, unit, pricePerGram, predPerGram, ccy, chg, theme }: SpotPriceCardProps) {
  const { prices, avg30, high30 } = useMemo(() => {
    const seed = (metal + country + '1M').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const series = generateSeries(pricePerGram, predPerGram, '1M', seed);
    const hist   = series.filter(p => !p.projected).map(p => p.price);
    return {
      prices: hist.slice(-14),
      avg30:  hist.reduce((a, b) => a + b, 0) / hist.length,
      high30: Math.max(...hist),
    };
  }, [metal, country, pricePerGram, predPerGram]);

  const isPositive = chg.startsWith('+');

  return (
    <div
      className="rounded-2xl p-5 flex flex-col justify-between"
      style={{
        background:     'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
        border:         `1px solid ${theme.cardBorder}`,
        boxShadow:      '0 4px 24px rgba(0,0,0,0.25)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Live Spot Price ({UNIT_LABELS[unit]})
        </p>
        <div className="flex items-center gap-1.5 rounded-full px-2 py-0.5" style={{ background: 'rgba(34,197,94,0.12)' }}>
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[10px] font-semibold text-emerald-400">Live</span>
        </div>
      </div>

      {/* Price + sparkline */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-[2.1rem] font-black tracking-tight text-white leading-none">
              {pricePerGram.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>{ccy}</span>
          </div>
          <span
            className="mt-1.5 inline-block text-xs font-bold px-2 py-0.5 rounded-md"
            style={{
              color:      isPositive ? '#34d399' : '#f87171',
              background: isPositive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
              border:     isPositive ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(239,68,68,0.2)',
            }}
          >
            {chg}
          </span>
        </div>
        <MiniSparkline prices={prices} color={theme.accent} gradId={`sg-spot-${metal}`} />
      </div>

      {/* 30-day stats */}
      <div className="flex gap-6 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <p className="text-[9px] uppercase tracking-widest font-bold mb-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>30-Day Avg</p>
          <p className="text-sm font-bold text-white">
            {avg30.toLocaleString('en-US', { maximumFractionDigits: 0 })} {ccy}
          </p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-widest font-bold mb-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>30-Day High</p>
          <p className="text-sm font-bold text-white">
            {high30.toLocaleString('en-US', { maximumFractionDigits: 0 })} {ccy}
          </p>
        </div>
      </div>
    </div>
  );
}
