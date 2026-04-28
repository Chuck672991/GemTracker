'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────
type Metal   = 'Gold' | 'Silver';
type Country = 'Pakistan' | 'India' | 'US' | 'China';
type UnitType = 'gram' | 'tola' | 'troyoz';
type Period  = '7D' | '1M' | '3M' | '1Y';

// ─── Unit conversion ─────────────────────────────────────────────────────────
const G_PER_TOLA   = 11.6638;
const G_PER_TROYOZ = 31.1035;

const UNIT_LABELS: Record<UnitType, string> = {
  gram:   'Per Gram',
  tola:   'Per Tola',
  troyoz: 'Per Troy Oz',
};

function unitFactor(u: UnitType): number {
  if (u === 'tola')   return G_PER_TOLA;
  if (u === 'troyoz') return G_PER_TROYOZ;
  return 1;
}

// ─── Base prices (per gram) ───────────────────────────────────────────────────
// Derived: tola = gram×11.6638, troy oz = gram×31.1035
const BASE: Record<Metal, Record<Country, { cur: number; pred: number; ccy: string; chg: string; pchg: string }>> = {
  Gold: {
    Pakistan: { cur: 17010,   pred: 18429,   ccy: 'PKR', chg: '+1.25%', pchg: '+8.34%' },
    India:    { cur: 5086,    pred: 5506,    ccy: 'INR', chg: '+0.92%', pchg: '+8.26%' },
    US:       { cur: 76.68,   pred: 82.95,   ccy: 'USD', chg: '+1.10%', pchg: '+8.18%' },
    China:    { cur: 555.60,  pred: 601.30,  ccy: 'CNY', chg: '+0.98%', pchg: '+8.23%' },
  },
  Silver: {
    Pakistan: { cur: 210,     pred: 229.80,  ccy: 'PKR', chg: '+2.15%', pchg: '+9.43%'  },
    India:    { cur: 6.26,    pred: 6.95,    ccy: 'INR', chg: '+1.88%', pchg: '+11.02%' },
    US:       { cur: 0.9484,  pred: 1.067,   ccy: 'USD', chg: '+2.05%', pchg: '+12.51%' },
    China:    { cur: 6.817,   pred: 7.655,   ccy: 'CNY', chg: '+1.95%', pchg: '+12.29%' },
  },
};

function priceData(metal: Metal, country: Country, unit: UnitType) {
  const b = BASE[metal][country];
  const f = unitFactor(unit);
  return { cur: b.cur * f, pred: b.pred * f, ccy: b.ccy, chg: b.chg, pchg: b.pchg };
}

// ─── Themes ───────────────────────────────────────────────────────────────────
const THEMES = {
  Gold: {
    bg:            'radial-gradient(ellipse at 65% 15%, #5C3D08 0%, #2A1A02 40%, #120B00 70%, #080400 100%)',
    blob1:         'radial-gradient(circle at 78% 8%, rgba(255,190,30,0.18) 0%, transparent 55%)',
    blob2:         'radial-gradient(circle at 18% 82%, rgba(180,120,0,0.12) 0%, transparent 45%)',
    accent:        '#F5C518',
    accentText:    '#FFD700',
    label:         'rgba(255,210,60,0.85)',
    cardBorder:    'rgba(245,197,24,0.22)',
    dropBg:        'rgba(28,18,4,0.92)',
    dropBorder:    'rgba(245,197,24,0.28)',
    badgeBg:       'rgba(245,197,24,0.14)',
    pillActive:    'rgba(245,197,24,0.18)',
    pillBorder:    'rgba(245,197,24,0.55)',
    coinGrad:      'radial-gradient(circle at 34% 30%, #FFFBD0 0%, #FFD700 18%, #DAA520 48%, #B8860B 74%, #8B6400 100%)',
    coinShine:     'radial-gradient(circle at 30% 27%, rgba(255,255,230,0.65) 0%, rgba(255,220,50,0.18) 38%, transparent 62%)',
    coinEdge:      'conic-gradient(from 0deg, #7A5500, #C8960C, #FFD700, #C8960C, #7A5500, #C8960C, #FFD700, #C8960C, #7A5500)',
    coinRim:       'rgba(218,165,32,0.45)',
    coinSym:       '#8B6400',
    coinGlow:      '0 0 60px rgba(218,165,32,0.35), 0 20px 50px rgba(0,0,0,0.65)',
  },
  Silver: {
    bg:            'radial-gradient(ellipse at 65% 15%, #1E2E3D 0%, #0C1820 40%, #050D14 70%, #020609 100%)',
    blob1:         'radial-gradient(circle at 78% 8%, rgba(148,180,210,0.14) 0%, transparent 55%)',
    blob2:         'radial-gradient(circle at 18% 82%, rgba(90,130,160,0.09) 0%, transparent 45%)',
    accent:        '#94A3B8',
    accentText:    '#CBD5E1',
    label:         'rgba(200,216,232,0.85)',
    cardBorder:    'rgba(148,163,184,0.22)',
    dropBg:        'rgba(4,10,18,0.92)',
    dropBorder:    'rgba(148,163,184,0.28)',
    badgeBg:       'rgba(148,163,184,0.14)',
    pillActive:    'rgba(148,163,184,0.18)',
    pillBorder:    'rgba(148,163,184,0.55)',
    coinGrad:      'radial-gradient(circle at 34% 30%, #F8FAFC 0%, #CBD5E1 18%, #94A3B8 48%, #64748B 74%, #3E5060 100%)',
    coinShine:     'radial-gradient(circle at 30% 27%, rgba(255,255,255,0.72) 0%, rgba(220,232,244,0.18) 38%, transparent 62%)',
    coinEdge:      'conic-gradient(from 0deg, #3E5060, #7A9CB2, #CBD5E1, #7A9CB2, #3E5060, #7A9CB2, #CBD5E1, #7A9CB2, #3E5060)',
    coinRim:       'rgba(148,163,184,0.45)',
    coinSym:       '#475569',
    coinGlow:      '0 0 60px rgba(100,116,139,0.30), 0 20px 50px rgba(0,0,0,0.65)',
  },
} as const;

// ─── Price formatting ─────────────────────────────────────────────────────────
function fmt(v: number, ccy: string): string {
  let s: string;
  if      (v >= 1_000_000) s = v.toLocaleString('en-US', { maximumFractionDigits: 0 });
  else if (v >= 1_000)     s = v.toLocaleString('en-US', { maximumFractionDigits: 0 });
  else if (v >= 100)       s = v.toFixed(2);
  else if (v >= 1)         s = v.toFixed(2);
  else                     s = v.toFixed(4);
  return `${ccy} ${s}`;
}

function fmtLabel(v: number): string {
  const a = Math.abs(v);
  if (a >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (a >= 1_000)     return `${Math.round(v / 1_000)}K`;
  if (a >= 100)       return v.toFixed(0);
  if (a >= 10)        return v.toFixed(1);
  if (a >= 1)         return v.toFixed(2);
  return v.toFixed(3);
}

// ─── Chart data generation ────────────────────────────────────────────────────
interface RawPoint { price: number; date: Date; projected: boolean }

const HIST_N:    Record<Period, number> = { '7D': 14, '1M': 30, '3M': 13, '1Y': 12 };
const HIST_DAYS: Record<Period, number> = { '7D': 7,  '1M': 30, '3M': 90, '1Y': 365 };
const PROJ_N:    Record<Period, number> = { '7D': 12, '1M': 12, '3M': 6,  '1Y': 4  };
const START_MUL: Record<Period, number> = { '7D': 0.958, '1M': 0.930, '3M': 0.875, '1Y': 0.755 };

const ANCHOR = new Date(2024, 4, 20); // May 20 2024

function nz(i: number, s: number) {
  return Math.sin(i * 1.618 + s) * 0.5 + Math.sin(i * 2.718 + s * 1.5) * 0.3 + Math.sin(i * 0.9 + s * 0.7) * 0.2;
}

function generateSeries(cur: number, pred: number, period: Period, seed: number): RawPoint[] {
  const hN   = HIST_N[period];
  const hD   = HIST_DAYS[period];
  const pN   = PROJ_N[period];
  const sp   = cur * START_MUL[period];
  const hMag = Math.abs(cur - sp);
  const pMag = Math.abs(pred - cur);
  const pts: RawPoint[] = [];

  for (let i = 0; i <= hN; i++) {
    const t  = i / hN;
    const d  = new Date(ANCHOR);
    d.setDate(d.getDate() - Math.round(hD * (1 - t)));
    pts.push({ price: sp + (cur - sp) * t + nz(i, seed) * hMag * 0.04, date: d, projected: false });
  }
  for (let i = 1; i <= pN; i++) {
    const t = i / pN;
    const d = new Date(ANCHOR);
    d.setDate(d.getDate() + Math.round(30 * t));
    pts.push({ price: cur + (pred - cur) * t + nz(i + 100, seed * 1.3) * pMag * 0.03, date: d, projected: true });
  }
  return pts;
}

// ─── SVG smooth path (Catmull-Rom) ────────────────────────────────────────────
function spline(pts: { x: number; y: number }[], tension = 0.35): string {
  if (pts.length < 2) return '';
  const d = [`M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    d.push(
      `C ${(p1.x + (p2.x - p0.x) * tension).toFixed(2)} ${(p1.y + (p2.y - p0.y) * tension).toFixed(2)} ` +
      `${(p2.x - (p3.x - p1.x) * tension).toFixed(2)} ${(p2.y - (p3.y - p1.y) * tension).toFixed(2)} ` +
      `${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
    );
  }
  return d.join(' ');
}

// ─── Date labels ─────────────────────────────────────────────────────────────
function fmtDate(d: Date, period: Period): string {
  if (period === '1Y') return d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
}
function fmtTip(d: Date): string {
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── SVG chart dimensions ─────────────────────────────────────────────────────
const VW = 600; const VH = 185;
const PL = 56;  const PR = 16; const PT = 22; const PB = 36;
const CW = VW - PL - PR;
const CH = VH - PT - PB;

// ─── PriceChart ───────────────────────────────────────────────────────────────
interface ChartProps {
  metal:    Metal;
  country:  Country;
  cur:      number;
  pred:     number;
  ccy:      string;
  period:   Period;
  setPeriod:(p: Period) => void;
  theme:    (typeof THEMES)[Metal];
}

function PriceChart({ metal, country, cur, pred, ccy, period, setPeriod, theme }: ChartProps) {
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
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: '0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        transition: 'border-color 0.6s ease',
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
              ·&nbsp;{['7D','1M','3M'].includes(period) ? '30-Day' : '90-Day'} Forecast included
            </span>
          </p>
        </div>

        {/* Period pills */}
        <div className="flex gap-1">
          {(['7D','1M','3M','1Y'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all duration-200"
              style={{
                color:      p === period ? theme.accentText : 'rgba(255,255,255,0.32)',
                background: p === period ? theme.pillActive : 'transparent',
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

// ─── Coin visual ──────────────────────────────────────────────────────────────
function CoinVisual({ metal, theme }: { metal: Metal; theme: (typeof THEMES)[Metal] }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
      <div className="pointer-events-none absolute rounded-full" style={{
        width: 230, height: 230,
        background: metal === 'Gold'
          ? 'radial-gradient(circle,rgba(255,200,0,0.22) 0%,transparent 70%)'
          : 'radial-gradient(circle,rgba(148,163,184,0.18) 0%,transparent 70%)',
        filter: 'blur(18px)',
      }} />
      <div className="absolute rounded-full" style={{
        width: 158, height: 30, top: '83%',
        background: 'rgba(0,0,0,0.4)', filter: 'blur(16px)', transform: 'scaleX(0.82)',
      }} />
      <div className="absolute rounded-full" style={{ width: 164, height: 164, background: theme.coinEdge, boxShadow: theme.coinGlow }} />
      <div className="absolute rounded-full" style={{ width: 148, height: 148, background: theme.coinGrad, overflow: 'hidden' }}>
        <div className="absolute inset-0 rounded-full" style={{ background: theme.coinShine }} />
        <div className="absolute rounded-full" style={{ top:13, left:13, right:13, bottom:13, border: `1.5px solid ${theme.coinRim}` }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="50" height="50" viewBox="0 0 52 52" fill="none" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}>
            {metal === 'Gold' ? (
              <>
                <circle cx="26" cy="26" r="9" fill={theme.coinSym} fillOpacity="0.6" />
                {[0,45,90,135,180,225,270,315].map(deg => (
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

// ─── Dropdown helper ──────────────────────────────────────────────────────────
function Dropdown<T extends string>({
  label, value, onChange, options, theme,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  theme: (typeof THEMES)[Metal];
}) {
  return (
    <div className="flex-1">
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.38)' }}>
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value as T)}
          className="w-full cursor-pointer appearance-none rounded-2xl px-4 py-3.5 pr-10 text-sm font-semibold text-white outline-none"
          style={{
            background: theme.dropBg,
            border: `1px solid ${theme.dropBorder}`,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
            transition: 'border-color 0.5s ease, background 0.5s ease',
          }}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: theme.accentText }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><path d="M6 8L1 3h10L6 8z" /></svg>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export function Dashboard() {
  const [metal,   setMetal]   = useState<Metal>('Gold');
  const [country, setCountry] = useState<Country>('Pakistan');
  const [unit,    setUnit]    = useState<UnitType>('tola');
  const [period,  setPeriod]  = useState<Period>('7D');

  const theme = THEMES[metal];
  const p     = priceData(metal, country, unit);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: theme.bg, transition: 'background 0.7s ease' }}
    >
      <div className="pointer-events-none absolute inset-0" style={{ background: theme.blob1, transition: 'background 0.7s ease' }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: theme.blob2, transition: 'background 0.7s ease' }} />
      <div className="pointer-events-none absolute inset-0" style={{
        opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '256px',
      }} />

      <div className="relative z-10 mx-auto w-full max-w-2xl px-4 py-10">

        {/* Heading */}
        <div className="mb-8 text-center">
          <motion.div key={metal} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: theme.label, transition: 'color 0.6s ease' }}>
              Precious Metals
            </p>
            <h1 className="text-[2.4rem] font-bold leading-none tracking-tight text-white" style={{ textShadow: '0 2px 24px rgba(0,0,0,0.55)' }}>
              Market Tracker
            </h1>
          </motion.div>
        </div>

        {/* ── Controls: Metal + Country dropdowns ── */}
        <div className="mb-3 flex gap-3">
          <Dropdown
            label="Metal" value={metal} onChange={setMetal} theme={theme}
            options={[{ value: 'Gold', label: '✦  Gold' }, { value: 'Silver', label: '◈  Silver' }]}
          />
          <Dropdown
            label="Country" value={country} onChange={setCountry} theme={theme}
            options={[
              { value: 'Pakistan',  label: '🇵🇰  Pakistan' },
              { value: 'India',     label: '🇮🇳  India' },
              { value: 'US',        label: '🇺🇸  United States' },
              { value: 'China',     label: '🇨🇳  China' },
            ]}
          />
        </div>

        {/* ── Unit pill selector ── */}
        <div className="mb-6 flex gap-2">
          {(['gram', 'tola', 'troyoz'] as UnitType[]).map(u => {
            const active = u === unit;
            return (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className="flex-1 rounded-xl py-2 text-xs font-bold transition-all duration-250"
                style={{
                  color:      active ? theme.accentText : 'rgba(255,255,255,0.4)',
                  background: active ? theme.pillActive : 'rgba(255,255,255,0.04)',
                  border:     active ? `1px solid ${theme.pillBorder}` : '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {UNIT_LABELS[u]}
              </button>
            );
          })}
        </div>

        {/* ── Price card ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${metal}-${country}-${unit}`}
            initial={{ opacity: 0, y: 16, scale: 0.976 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{    opacity: 0, y: -10, scale: 0.976 }}
            transition={{ duration: 0.36, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative mb-4 overflow-hidden rounded-3xl"
            style={{
              background: 'rgba(255,255,255,0.045)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              border: `1px solid ${theme.cardBorder}`,
              boxShadow: '0 8px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.09)',
              transition: 'border-color 0.6s ease',
            }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)' }} />

            <div className="flex items-center">
              {/* Left: price info */}
              <div className="flex-1 px-7 py-7">
                {/* Title + live */}
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <motion.h2
                      key={metal}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
                      className="text-[1.9rem] font-bold leading-none"
                      style={{ color: theme.accentText, transition: 'color 0.6s ease' }}
                    >
                      {metal}
                    </motion.h2>
                    <p className="mt-0.5 text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>Real-time Market Overview</p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: 'rgba(34,197,94,0.12)' }}>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400">Live</span>
                  </div>
                </div>

                {/* Current price */}
                <div className="mb-5">
                  <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.label, transition: 'color 0.6s ease' }}>
                    Current Market Price
                  </p>
                  <p className="text-[2rem] font-bold leading-none tabular-nums text-white" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
                    {fmt(p.cur, p.ccy)}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>
                    {UNIT_LABELS[unit]}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1" style={{ background: 'rgba(34,197,94,0.12)' }}>
                    <span className="text-xs font-bold text-emerald-400">↑ {p.chg}</span>
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>vs yesterday</span>
                  </div>
                </div>

                <div className="mb-5 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />

                {/* Predicted price */}
                <div>
                  <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.label, transition: 'color 0.6s ease' }}>
                    Predicted Future Price
                  </p>
                  <p className="text-[1.6rem] font-bold leading-none tabular-nums" style={{ color: theme.accentText, transition: 'color 0.6s ease' }}>
                    {fmt(p.pred, p.ccy)}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>In 30 Days</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1" style={{ background: theme.badgeBg, transition: 'background 0.6s ease' }}>
                    <span className="text-xs font-bold" style={{ color: theme.accentText }}>↑ {p.pchg}</span>
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>predicted change</span>
                  </div>
                </div>
              </div>

              {/* Right: coin */}
              <div className="flex shrink-0 items-center justify-center pr-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={metal}
                    initial={{ opacity: 0, scale: 0.78, rotate: -14 }}
                    animate={{ opacity: 1, scale: 1,    rotate: 0 }}
                    exit={{    opacity: 0, scale: 0.78, rotate: 14 }}
                    transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <CoinVisual metal={metal} theme={theme} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Chart card ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`chart-${metal}-${country}-${unit}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{    opacity: 0, y: 10  }}
            transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
          >
            <PriceChart
              metal={metal} country={country}
              cur={p.cur}   pred={p.pred}   ccy={p.ccy}
              period={period} setPeriod={setPeriod}
              theme={theme}
            />
          </motion.div>
        </AnimatePresence>

        <p className="mt-5 text-center text-[10px]" style={{ color: 'rgba(255,255,255,0.16)' }}>
          Prices are indicative &middot; Forecast uses a hypothetical model, not financial advice
        </p>
      </div>
    </div>
  );
}
