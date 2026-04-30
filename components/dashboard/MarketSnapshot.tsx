'use client';

import type { Metal } from './types';
import type { Theme } from './constants';

interface MarketSnapshotProps {
  metal:        Metal;
  pricePerGram: number;
  pred:         number;
  ccy:          string;
  theme:        Theme;
}

export function MarketSnapshot({ metal, pricePerGram, pred, ccy, theme }: MarketSnapshotProps) {
  const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });

  const rows: { label: string; value: string; highlight?: boolean }[] = [
    { label: 'Spot Price (Per Gram)', value: `${fmt(pricePerGram)} ${ccy}`, highlight: true },
    ...(metal === 'Gold' ? [
      { label: '24K Gold', value: `${fmt(pricePerGram)} ${ccy}` },
      { label: '22K Gold', value: `${fmt(pricePerGram * (22 / 24))} ${ccy}` },
      { label: '18K Gold', value: `${fmt(pricePerGram * (18 / 24))} ${ccy}` },
    ] : []),
    { label: '30-Day Forecast', value: `${fmt(pred)} ${ccy}` },
    { label: 'Market Trend', value: '↑ Bullish', highlight: true, trend: true } as any,
  ];

  return (
    <div
      className="rounded-2xl p-5 flex flex-col"
      style={{
        background:     'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
        border:         `1px solid ${theme.cardBorder}`,
        boxShadow:      '0 4px 24px rgba(0,0,0,0.25)',
      }}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Market Snapshot
      </p>

      <div className="flex-1 space-y-2.5">
        {rows.map(row => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{row.label}</span>
            <span
              className="text-xs font-bold"
              style={{ color: (row as any).trend ? '#34d399' : row.highlight ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.75)' }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <button
        className="mt-5 w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-between px-4 transition-all hover:opacity-80"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border:     `1px solid ${theme.cardBorder}`,
          color:      theme.accentText,
        }}
      >
        <span className="flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
          View Detailed Analysis
        </span>
        <span>→</span>
      </button>
    </div>
  );
}
