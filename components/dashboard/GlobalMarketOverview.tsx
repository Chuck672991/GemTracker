'use client';

import React, { useMemo } from 'react';
import type { Metal } from './types';
import type { Theme } from './constants';
import { BASE } from './constants';
import { generateSeries } from './utils';

interface GlobalMarketOverviewProps {
  theme: Theme;
}

const METALS: Metal[]             = ['Gold', 'Silver', 'Platinum', 'Palladium'];
const METAL_ICONS: Record<Metal, string> = { Gold: '✦', Silver: '◈', Platinum: '◇', Palladium: '◆' };
const G_PER_TROYOZ = 31.1035;

function TrendLine({ prices, positive }: { prices: number[]; positive: boolean }) {
  const w = 64; const h = 26;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const pts = prices.map((v, i) => ({
    x: (i / (prices.length - 1)) * w,
    y: h - 4 - ((v - min) / range) * (h - 8),
  }));
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={path} fill="none" stroke={positive ? '#34d399' : '#f87171'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GlobalMarketOverview({ theme }: GlobalMarketOverviewProps) {
  const rows = useMemo(() => METALS.map(metal => {
    const d    = BASE[metal]['US'];
    const priceUsdOz = d.cur * G_PER_TROYOZ;
    const change24h  = priceUsdOz * (parseFloat(d.chg.replace('%', '').replace('+', '')) / 100);
    const isPositive = d.chg.startsWith('+');
    const seed  = (metal + 'US' + '7D').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const series = generateSeries(d.cur, d.pred, '7D', seed);
    const prices = series.filter(p => !p.projected).slice(-9).map(p => p.price);
    return { metal, priceUsdOz, change24h, chgPct: d.chg, isPositive, prices };
  }), []);

  const cellStyle = { color: 'rgba(255,255,255,0.4)' };

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background:     'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
        border:         `1px solid ${theme.cardBorder}`,
        boxShadow:      '0 4px 24px rgba(0,0,0,0.25)',
      }}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={cellStyle}>
        Global Market Overview
      </p>

      {/* Header row */}
      <div className="grid gap-x-4 mb-2" style={{ gridTemplateColumns: '1.4fr 1fr 1fr 1fr 64px' }}>
        {['Metal', 'Price (USD/oz)', 'Change (24h)', 'Change (%)', 'Trend'].map(h => (
          <span key={h} className="text-[9px] font-bold uppercase tracking-wider" style={cellStyle}>{h}</span>
        ))}
      </div>

      <div className="h-px mb-3" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* Data rows */}
      <div className="space-y-3">
        {rows.map(({ metal, priceUsdOz, change24h, chgPct, isPositive, prices }) => (
          <div key={metal} className="grid items-center gap-x-4" style={{ gridTemplateColumns: '1.4fr 1fr 1fr 1fr 64px' }}>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: theme.accent }}>{METAL_ICONS[metal]}</span>
              <span className="text-sm font-semibold text-white">{metal}</span>
            </div>
            <span className="text-sm font-bold text-white tabular-nums">
              {priceUsdOz.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-sm font-bold tabular-nums" style={{ color: isPositive ? '#34d399' : '#f87171' }}>
              {isPositive ? '+' : ''}{change24h.toFixed(2)}
            </span>
            <span className="text-sm font-bold tabular-nums" style={{ color: isPositive ? '#34d399' : '#f87171' }}>
              {chgPct}
            </span>
            <TrendLine prices={prices} positive={isPositive} />
          </div>
        ))}
      </div>
    </div>
  );
}
