'use client';

import type { Metal } from './types';
import type { Theme } from './constants';

interface CoinVisualProps {
  metal: Metal;
  theme: Theme;
  size?: number;
}

export function CoinVisual({ metal, theme, size = 180 }: CoinVisualProps) {
  const r = size / 180;
  const s = (n: number) => n * r;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="pointer-events-none absolute rounded-full" style={{
        width: s(230), height: s(230),
        background: metal === 'Gold'
          ? 'radial-gradient(circle,rgba(255,200,0,0.22) 0%,transparent 70%)'
          : 'radial-gradient(circle,rgba(148,163,184,0.18) 0%,transparent 70%)',
        filter: 'blur(18px)',
      }} />
      <div className="absolute rounded-full" style={{
        width: s(158), height: s(30), top: '83%',
        background: 'rgba(0,0,0,0.4)', filter: 'blur(16px)', transform: 'scaleX(0.82)',
      }} />
      <div className="absolute rounded-full" style={{ width: s(164), height: s(164), background: theme.coinEdge, boxShadow: theme.coinGlow }} />
      <div className="absolute rounded-full" style={{ width: s(148), height: s(148), background: theme.coinGrad, overflow: 'hidden' }}>
        <div className="absolute inset-0 rounded-full" style={{ background: theme.coinShine }} />
        <div className="absolute rounded-full" style={{ top: s(13), left: s(13), right: s(13), bottom: s(13), border: `${Math.max(1, s(1.5))}px solid ${theme.coinRim}` }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width={s(50)} height={s(50)} viewBox="0 0 52 52" fill="none" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}>
            {metal === 'Gold' ? (
              <>
                <circle cx="26" cy="26" r="9" fill={theme.coinSym} fillOpacity="0.6" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                  <rect key={deg} x="24.5" y="6" width="3" height="10" rx="1.5"
                    fill={theme.coinSym} fillOpacity="0.7" transform={`rotate(${deg} 26 26)`} />
                ))}
              </>
            ) : (
              <>
                <polygon points="26,10 38.7,18 38.7,34 26,42 13.3,34 13.3,18"
                  fill="none" stroke={theme.coinSym} strokeWidth="2.5" strokeOpacity="0.65" />
                <polygon points="26,18 33.5,22 33.5,30 26,34 18.5,30 18.5,22"
                  fill={theme.coinSym} fillOpacity="0.35" stroke={theme.coinSym} strokeWidth="1.5" strokeOpacity="0.5" />
              </>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
