'use client';

import type { Theme } from './constants';

interface MarketNewsProps {
  theme: Theme;
}

const NEWS = [
  {
    title: 'Gold prices surge amid global economic uncertainty',
    time:  '2 hours ago',
    bg:    'linear-gradient(135deg, #78350f 0%, #92400e 100%)',
    icon:  '📈',
  },
  {
    title: 'Pakistan gold demand increases by 15% this month',
    time:  '5 hours ago',
    bg:    'linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)',
    icon:  '🇵🇰',
  },
  {
    title: 'Experts predict bullish trend for Gold in Q3',
    time:  '1 day ago',
    bg:    'linear-gradient(135deg, #78350f 0%, #a16207 100%)',
    icon:  '⚡',
  },
];

export function MarketNews({ theme }: MarketNewsProps) {
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
        Market News
      </p>

      <div className="flex-1 space-y-3">
        {NEWS.map((item, i) => (
          <div key={i} className="flex gap-3 items-start group cursor-pointer">
            <div
              className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-xl"
              style={{ background: item.bg }}
            >
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white leading-snug group-hover:opacity-80 transition-opacity">
                {item.title}
              </p>
              <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.time}</p>
            </div>
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
        View All News
      </button>
    </div>
  );
}
