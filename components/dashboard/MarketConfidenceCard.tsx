'use client';

import type { Theme } from './constants';

interface MarketConfidenceCardProps {
  theme: Theme;
}

const BAR_SEGMENTS = [
  { color: '#ef4444' },
  { color: '#f97316' },
  { color: '#eab308' },
  { color: '#84cc16' },
  { color: '#22c55e' },
  { color: '#16a34a', dot: true },
];

export function MarketConfidenceCard({ theme }: MarketConfidenceCardProps) {
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
      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Market Confidence
      </p>

      <p className="text-[1.9rem] font-black mb-5 leading-none" style={{ color: theme.accentText }}>
        High Score
      </p>

      {/* Segmented confidence bar */}
      <div className="flex gap-1 mb-3">
        {BAR_SEGMENTS.map((seg, i) => (
          <div
            key={i}
            className="h-2.5 flex-1 rounded-full relative"
            style={{ background: seg.color }}
          >
            {seg.dot && (
              <div
                className="absolute -right-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white"
                style={{ border: '2.5px solid #16a34a', boxShadow: '0 0 8px rgba(22,163,74,0.9)' }}
              />
            )}
          </div>
        ))}
      </div>

      <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Strong positive sentiment in the market
      </p>
    </div>
  );
}
