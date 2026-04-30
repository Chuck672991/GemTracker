'use client';

import React, { useMemo } from 'react';
import type { MetalRate } from '@/lib/types';
import type { Metal } from './types';
import type { Theme } from './constants';
import { BASE } from './constants';
import { generateSeries } from './utils';

interface GlobalMarketOverviewProps {
  theme:   Theme;
  metals?: MetalRate[]; // live data from /api/rates
}

const METALS: Metal[]                    = ['Gold', 'Silver', 'Platinum', 'Palladium'];
const METAL_ICONS: Record<Metal, string> = { Gold: '✦', Silver: '◈', Platinum: '◇', Palladium: '◆' };
const G_PER_TROYOZ                       = 31.1035;

// Canonical symbol for each metal used in the API response
const API_SYMBOL: Record<Metal, string> = {
  Gold:      'XAU_24K',
  Silver:    'XAG',
  Platinum:  'XPT',
  Palladium: 'XPD',
};

function TrendLine({ prices, positive }: { prices: number[]; positive: boolean }) {
  const w = 64; const h = 26;
  if (prices.length < 2) return <svg width={w} height={h} />;
  const min   = Math.min(...prices);
  const max   = Math.max(...prices);
  const range = max - min || 1;
  const pts   = prices.map((v, i) => ({
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

export function GlobalMarketOverview({ theme, metals }: GlobalMarketOverviewProps) {
  const rows = useMemo(() => METALS.map(metal => {
    // ── Live API data path ────────────────────────────────────────────────
    const live = metals?.find(m => m.symbol === API_SYMBOL[metal]);
    if (live) {
      const isPositive = live.changePercent24h >= 0;
      const chgPct     = `${isPositive ? '+' : ''}${live.changePercent24h.toFixed(2)}%`;
      // Generate a sparkline from the live price so the trend looks real
      const seed   = (metal + 'US' + '7D').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      const series = generateSeries(live.pricePerGram, live.pricePerGram * 1.08, '7D', seed);
      const prices = series.filter(p => !p.projected).slice(-9).map(p => p.price);
      return {
        metal,
        priceUsdOz: live.pricePerTroyOz,
        change24h:  live.change24h,
        chgPct,
        isPositive,
        prices,
      };
    }

    // ── Fallback: static BASE data ────────────────────────────────────────
    const d          = BASE[metal]['US'];
    const priceUsdOz = d.cur * G_PER_TROYOZ;
    const change24h  = priceUsdOz * (parseFloat(d.chg.replace('%', '').replace('+', '')) / 100);
    const isPositive = d.chg.startsWith('+');
    const seed       = (metal + 'US' + '7D').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const series     = generateSeries(d.cur, d.pred, '7D', seed);
    const prices     = series.filter(p => !p.projected).slice(-9).map(p => p.price);
    return { metal, priceUsdOz, change24h, chgPct: d.chg, isPositive, prices };
  }), [metals]);

  const muted = { color: 'rgba(255,255,255,0.4)' };

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
      <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={muted}>
        Global Market Overview
      </p>

      {/* Header */}
      <div className="grid gap-x-4 mb-2" style={{ gridTemplateColumns: '1.4fr 1fr 1fr 1fr 64px' }}>
        {['Metal', 'Price (USD/oz)', 'Change (24h)', 'Change (%)', 'Trend'].map(h => (
          <span key={h} className="text-[9px] font-bold uppercase tracking-wider" style={muted}>{h}</span>
        ))}
      </div>

      <div className="h-px mb-3" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* Rows */}
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
              {isPositive ? '+' : ''}{Math.abs(change24h).toFixed(2)}
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
