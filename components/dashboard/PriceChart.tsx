'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Metal, Country, Period } from './types';
import type { Theme } from './constants';
import { VW, VH, PL, PR, PT, PB, CW, CH } from './constants';
import { generateSeries, spline, fmtLabel, fmtDate, fmtTip, fmt } from './utils';

interface ChartProps {
  metal:     Metal;
  country:   Country;
  cur:       number;
  pred:      number;
  ccy:       string;
  period:    Period;
  setPeriod: (p: Period) => void;
  theme:     Theme;
}

export function PriceChart({ metal, country, cur, pred, ccy, period, setPeriod, theme }: ChartProps) {
  const [hover, setHover] = useState<{ i: number } | null>(null);

  const seed = useMemo(
    () => (metal + country + period).split('').reduce((a, c) => a + c.charCodeAt(0), 0),
    [metal, country, period]
  );

  const raw = useMemo(() => generateSeries(cur, pred, period, seed), [cur, pred, period, seed]);

  const { pts, lo, hi, histEnd } = useMemo(() => {
    const prices = raw.map(r => r.price);
    const mn = Math.min(...prices);
    const mx = Math.max(...prices);
    const pad = (mx - mn) * 0.14;
    const lo = mn - pad;
    const hi = mx + pad;
    const scX = (i: number) => PL + (i / (raw.length - 1)) * CW;
    const scY = (p: number) => PT + (1 - (p - lo) / (hi - lo)) * CH;
    const pts = raw.map((r, i) => ({ x: scX(i), y: scY(r.price), ...r }));
    const histEnd = pts.findIndex(p => p.projected) - 1;
    return { pts, lo, hi, histEnd };
  }, [raw]);

  const scY = useCallback((p: number) => PT + (1 - (p - lo) / (hi - lo)) * CH, [lo, hi]);

  const { histPath, projPath, histArea, projArea } = useMemo(() => {
    const hist = pts.slice(0, histEnd + 1);
    const proj = pts.slice(histEnd);
    const hp = spline(hist);
    const pp = spline(proj);
    const bot = PT + CH;
    return {
      histPath: hp,
      projPath: pp,
      histArea: `${hp} L ${hist[hist.length - 1].x.toFixed(2)} ${bot} L ${PL} ${bot} Z`,
      projArea: `${pp} L ${proj[proj.length - 1].x.toFixed(2)} ${bot} L ${proj[0].x.toFixed(2)} ${bot} Z`,
    };
  }, [pts, histEnd]);

  const yTicks = useMemo(() => (
    [0, 0.25, 0.5, 0.75, 1].map(t => {
      const p = lo + (hi - lo) * t;
      return { p, y: scY(p) };
    }).reverse()
  ), [lo, hi, scY]);

  const xTick = useMemo(() => {
    const idxs = [0, Math.floor(pts.length * 0.25), Math.floor(pts.length * 0.5), Math.floor(pts.length * 0.75), pts.length - 1];
    return idxs.map(i => pts[i]);
  }, [pts]);

  const todayPt = pts[histEnd];
  const hovPt   = hover ? pts[hover.i] : null;

  const handleMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * VW;
    let best = 0; let best_d = Infinity;
    pts.forEach((p, i) => { const d = Math.abs(p.x - mx); if (d < best_d) { best_d = d; best = i; } });
    setHover({ i: best });
  }, [pts]);

  const gradId  = `g-${metal}`;
  const pGradId = `pg-${metal}`;

  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{
        background:          'rgba(255,255,255,0.04)',
        backdropFilter:      'blur(28px)',
        WebkitBackdropFilter:'blur(28px)',
        border:              `1px solid ${theme.cardBorder}`,
        boxShadow:           '0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        transition:          'border-color 0.6s ease',
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)' }} />

      {/* Card header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-1">
        <div>
          <p className="text-sm font-semibold text-white">Price Trend</p>
          <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.38)' }}>
            {metal} — {country}
            <span className="ml-2" style={{ color: theme.accentText }}>
              ·&nbsp;{['7D', '1M', '3M'].includes(period) ? '30-Day' : '90-Day'} Forecast included
            </span>
          </p>
        </div>

        {/* Period pills */}
        <div className="flex gap-1">
          {(['7D', '1M', '3M', '1Y'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all duration-200"
              style={{
                color:      p === period ? theme.accentText : 'rgba(255,255,255,0.32)',
                background: p === period ? theme.pillActive  : 'transparent',
                border:     p === period ? `1px solid ${theme.pillBorder}` : '1px solid transparent',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 px-6 pb-2">
        <div className="flex items-center gap-1.5">
          <svg width="18" height="6"><line x1="0" y1="3" x2="18" y2="3" stroke={theme.accent} strokeWidth="2.5" strokeLinecap="round" /></svg>
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.38)' }}>Historical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="18" height="6"><line x1="0" y1="3" x2="18" y2="3" stroke={theme.accent} strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" /></svg>
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.38)' }}>Projected</span>
        </div>
      </div>

      {/* SVG */}
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%"
        className="block"
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
        style={{ cursor: 'crosshair' }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={theme.accent} stopOpacity="0.45" />
            <stop offset="100%" stopColor={theme.accent} stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id={pGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={theme.accent} stopOpacity="0.18" />
            <stop offset="100%" stopColor={theme.accent} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Y grid + labels */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={PL} y1={t.y} x2={VW - PR} y2={t.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={PL - 7} y={t.y + 4} textAnchor="end" fontSize="11" fill="rgba(255,255,255,0.35)" fontFamily="system-ui">
              {fmtLabel(t.p)}
            </text>
          </g>
        ))}

        {/* X labels */}
        {xTick.map((t, i) => (
          <text key={i} x={t.x} y={VH - 6} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.3)" fontFamily="system-ui">
            {fmtDate(t.date, period)}
          </text>
        ))}

        {/* Area fills */}
        <path d={histArea} fill={`url(#${gradId})`} />
        <path d={projArea} fill={`url(#${pGradId})`} />

        {/* Lines */}
        <path d={histPath} fill="none" stroke={theme.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={projPath} fill="none" stroke={theme.accent} strokeWidth="2" strokeDasharray="5 4" strokeOpacity="0.65" strokeLinecap="round" />

        {/* Today divider */}
        <line x1={todayPt.x} y1={PT} x2={todayPt.x} y2={PT + CH}
          stroke="rgba(255,255,255,0.14)" strokeWidth="1" strokeDasharray="4 3" />
        <text x={todayPt.x} y={PT - 6} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.28)" fontFamily="system-ui">
          Today
        </text>

        {/* Today dot (default visible) */}
        {!hovPt && (
          <>
            <circle cx={todayPt.x} cy={todayPt.y} r="9" fill={theme.accent} fillOpacity="0.18" />
            <circle cx={todayPt.x} cy={todayPt.y} r="5" fill={theme.accent} />
          </>
        )}

        {/* Hover crosshair + dot + tooltip */}
        {hovPt && (
          <>
            <line x1={hovPt.x} y1={PT} x2={hovPt.x} y2={PT + CH}
              stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
            <circle cx={hovPt.x} cy={hovPt.y} r="8" fill={theme.accent} fillOpacity="0.22" />
            <circle cx={hovPt.x} cy={hovPt.y} r="4.5" fill={theme.accent} />

            {/* Tooltip */}
            {(() => {
              const tw = 128; const th = 48;
              const tx = hovPt.x > VW * 0.68 ? hovPt.x - tw - 10 : hovPt.x + 10;
              const ty = Math.max(PT + 2, Math.min(hovPt.y - th / 2, PT + CH - th));
              return (
                <g>
                  <rect x={tx} y={ty} width={tw} height={th} rx="8"
                    fill="rgba(10,10,15,0.94)" stroke={theme.accent} strokeOpacity="0.35" strokeWidth="1" />
                  <text x={tx + 10} y={ty + 17} fontSize="10.5" fill="rgba(255,255,255,0.52)" fontFamily="system-ui">
                    {fmtTip(hovPt.date)}{hovPt.projected ? '  ★' : ''}
                  </text>
                  <text x={tx + 10} y={ty + 36} fontSize="13" fontWeight="700" fill={theme.accentText} fontFamily="system-ui">
                    {fmt(hovPt.price, ccy)}
                  </text>
                </g>
              );
            })()}
          </>
        )}
      </svg>

      {/* Bottom note */}
      <p className="px-6 pb-4 text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
        ★ Projected values use a hypothetical forecast model, not financial advice.
      </p>
    </div>
  );
}
