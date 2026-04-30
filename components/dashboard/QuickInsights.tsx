'use client';

import type { Metal } from './types';
import type { Theme } from './constants';

interface QuickInsightsProps {
  metal: Metal;
  theme: Theme;
}

const INSIGHTS: Record<Metal, { text: string; icon: string }[]> = {
  Gold: [
    { text: 'Gold is performing well in the Pakistani market',     icon: '📈' },
    { text: 'High investor confidence with bullish sentiment',      icon: '⭐' },
    { text: 'Consider long-term investment opportunities',          icon: '⚡' },
    { text: 'Monitor global economic indicators',                   icon: '🌍' },
  ],
  Silver: [
    { text: 'Silver showing strong industrial demand signals',      icon: '📈' },
    { text: 'Technical indicators suggest upward momentum',         icon: '⭐' },
    { text: 'Diversify portfolio with silver allocation',           icon: '⚡' },
    { text: 'Watch for US Fed policy announcements',                icon: '🌍' },
  ],
  Platinum: [
    { text: 'Platinum supply constraints from South Africa',        icon: '📈' },
    { text: 'EV transition may shift long-term demand',             icon: '⭐' },
    { text: 'Trading at historically rare gold discount',           icon: '⚡' },
    { text: 'Automotive sector recovery driving demand',            icon: '🌍' },
  ],
  Palladium: [
    { text: 'Palladium demand tied to ICE vehicle production',      icon: '📈' },
    { text: 'Russian supply risks creating short-term volatility',  icon: '⭐' },
    { text: 'Catalytic converter demand remains robust',            icon: '⚡' },
    { text: 'Consider position sizing carefully',                   icon: '🌍' },
  ],
};

export function QuickInsights({ metal, theme }: QuickInsightsProps) {
  const insights = INSIGHTS[metal];

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
        Quick Insights
      </p>

      <div className="flex-1 space-y-3">
        {insights.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div
              className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
              style={{ background: theme.badgeBg }}
            >
              {item.icon}
            </div>
            <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <button
        className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold text-center transition-all hover:opacity-80"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border:     `1px solid ${theme.cardBorder}`,
          color:      theme.accentText,
        }}
      >
        View Detailed Insights
      </button>
    </div>
  );
}
