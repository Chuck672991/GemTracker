import type { Metal, Country, UnitType, Period } from './types';
import { G_PER_TOLA, G_PER_TROYOZ, BASE, HIST_N, HIST_DAYS, PROJ_N, START_MUL, ANCHOR } from './constants';

export interface RawPoint { price: number; date: Date; projected: boolean }

export function unitFactor(u: UnitType): number {
  if (u === 'tola')   return G_PER_TOLA;
  if (u === 'troyoz') return G_PER_TROYOZ;
  return 1;
}

export function priceData(metal: Metal, country: Country, unit: UnitType) {
  const b = BASE[metal][country];
  const f = unitFactor(unit);
  return { cur: b.cur * f, pred: b.pred * f, ccy: b.ccy, chg: b.chg, pchg: b.pchg };
}

export function fmt(v: number, ccy: string): string {
  let s: string;
  if      (v >= 1_000_000) s = v.toLocaleString('en-US', { maximumFractionDigits: 0 });
  else if (v >= 1_000)     s = v.toLocaleString('en-US', { maximumFractionDigits: 0 });
  else if (v >= 100)       s = v.toFixed(2);
  else if (v >= 1)         s = v.toFixed(2);
  else                     s = v.toFixed(4);
  return `${ccy} ${s}`;
}

export function fmtLabel(v: number): string {
  const a = Math.abs(v);
  if (a >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (a >= 1_000)     return `${Math.round(v / 1_000)}K`;
  if (a >= 100)       return v.toFixed(0);
  if (a >= 10)        return v.toFixed(1);
  if (a >= 1)         return v.toFixed(2);
  return v.toFixed(3);
}

export function fmtDate(d: Date, period: Period): string {
  if (period === '1Y') return d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
}

export function fmtTip(d: Date): string {
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function nz(i: number, s: number) {
  return Math.sin(i * 1.618 + s) * 0.5 + Math.sin(i * 2.718 + s * 1.5) * 0.3 + Math.sin(i * 0.9 + s * 0.7) * 0.2;
}

export function generateSeries(cur: number, pred: number, period: Period, seed: number): RawPoint[] {
  const hN   = HIST_N[period];
  const hD   = HIST_DAYS[period];
  const pN   = PROJ_N[period];
  const sp   = cur * START_MUL[period];
  const hMag = Math.abs(cur - sp);
  const pMag = Math.abs(pred - cur);
  const pts: RawPoint[] = [];

  for (let i = 0; i <= hN; i++) {
    const t = i / hN;
    const d = new Date(ANCHOR);
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

export function spline(pts: { x: number; y: number }[], tension = 0.35): string {
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
