import type { Metal, Country, UnitType, Period } from './types';

export const G_PER_TOLA   = 11.6638;
export const G_PER_TROYOZ = 31.1035;

export const UNIT_LABELS: Record<UnitType, string> = {
  gram:   'Per Gram',
  tola:   'Per Tola',
  troyoz: 'Per Troy Oz',
};

export const BASE: Record<Metal, Record<Country, { cur: number; pred: number; ccy: string; chg: string; pchg: string }>> = {
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
  Platinum: {
    Pakistan: { cur: 85050,   pred: 92000,   ccy: 'PKR', chg: '+1.15%', pchg: '+8.00%' },
    India:    { cur: 25430,   pred: 27500,   ccy: 'INR', chg: '+0.85%', pchg: '+8.10%' },
    US:       { cur: 383.40,  pred: 415.00,  ccy: 'USD', chg: '+1.05%', pchg: '+8.15%' },
    China:    { cur: 2780.00, pred: 3000.00, ccy: 'CNY', chg: '+0.95%', pchg: '+8.20%' },
  },
  Palladium: {
    Pakistan: { cur: 63787,   pred: 69000,   ccy: 'PKR', chg: '+1.20%', pchg: '+8.05%' },
    India:    { cur: 19072,   pred: 20625,   ccy: 'INR', chg: '+0.90%', pchg: '+8.12%' },
    US:       { cur: 287.55,  pred: 311.00,  ccy: 'USD', chg: '+1.08%', pchg: '+8.17%' },
    China:    { cur: 2085.00, pred: 2250.00, ccy: 'CNY', chg: '+0.92%', pchg: '+8.22%' },
  },
};

export const THEMES = {
  Gold: {
    bg:         'radial-gradient(ellipse at 65% 15%, #5C3D08 0%, #2A1A02 40%, #120B00 70%, #080400 100%)',
    blob1:      'radial-gradient(circle at 78% 8%, rgba(255,190,30,0.18) 0%, transparent 55%)',
    blob2:      'radial-gradient(circle at 18% 82%, rgba(180,120,0,0.12) 0%, transparent 45%)',
    accent:     '#F5C518',
    accentText: '#FFD700',
    label:      'rgba(255,210,60,0.85)',
    cardBorder: 'rgba(245,197,24,0.22)',
    dropBg:     'rgba(28,18,4,0.92)',
    dropBorder: 'rgba(245,197,24,0.28)',
    badgeBg:    'rgba(245,197,24,0.14)',
    pillActive: 'rgba(245,197,24,0.18)',
    pillBorder: 'rgba(245,197,24,0.55)',
    coinGrad:   'radial-gradient(circle at 34% 30%, #FFFBD0 0%, #FFD700 18%, #DAA520 48%, #B8860B 74%, #8B6400 100%)',
    coinShine:  'radial-gradient(circle at 30% 27%, rgba(255,255,230,0.65) 0%, rgba(255,220,50,0.18) 38%, transparent 62%)',
    coinEdge:   'conic-gradient(from 0deg, #7A5500, #C8960C, #FFD700, #C8960C, #7A5500, #C8960C, #FFD700, #C8960C, #7A5500)',
    coinRim:    'rgba(218,165,32,0.45)',
    coinSym:    '#8B6400',
    coinGlow:   '0 0 60px rgba(218,165,32,0.35), 0 20px 50px rgba(0,0,0,0.65)',
  },
  Silver: {
    bg:         'radial-gradient(ellipse at 65% 15%, #1E2E3D 0%, #0C1820 40%, #050D14 70%, #020609 100%)',
    blob1:      'radial-gradient(circle at 78% 8%, rgba(148,180,210,0.14) 0%, transparent 55%)',
    blob2:      'radial-gradient(circle at 18% 82%, rgba(90,130,160,0.09) 0%, transparent 45%)',
    accent:     '#94A3B8',
    accentText: '#CBD5E1',
    label:      'rgba(200,216,232,0.85)',
    cardBorder: 'rgba(148,163,184,0.22)',
    dropBg:     'rgba(4,10,18,0.92)',
    dropBorder: 'rgba(148,163,184,0.28)',
    badgeBg:    'rgba(148,163,184,0.14)',
    pillActive: 'rgba(148,163,184,0.18)',
    pillBorder: 'rgba(148,163,184,0.55)',
    coinGrad:   'radial-gradient(circle at 34% 30%, #F8FAFC 0%, #CBD5E1 18%, #94A3B8 48%, #64748B 74%, #3E5060 100%)',
    coinShine:  'radial-gradient(circle at 30% 27%, rgba(255,255,255,0.72) 0%, rgba(220,232,244,0.18) 38%, transparent 62%)',
    coinEdge:   'conic-gradient(from 0deg, #3E5060, #7A9CB2, #CBD5E1, #7A9CB2, #3E5060, #7A9CB2, #CBD5E1, #7A9CB2, #3E5060)',
    coinRim:    'rgba(148,163,184,0.45)',
    coinSym:    '#475569',
    coinGlow:   '0 0 60px rgba(100,116,139,0.30), 0 20px 50px rgba(0,0,0,0.65)',
  },
  Platinum: {
    bg:         'radial-gradient(ellipse at 65% 15%, #2A3441 0%, #1A2332 40%, #0F172A 70%, #0A0F1C 100%)',
    blob1:      'radial-gradient(circle at 78% 8%, rgba(148,180,210,0.12) 0%, transparent 55%)',
    blob2:      'radial-gradient(circle at 18% 82%, rgba(90,130,160,0.08) 0%, transparent 45%)',
    accent:     '#94A3B8',
    accentText: '#CBD5E1',
    label:      'rgba(200,216,232,0.85)',
    cardBorder: 'rgba(148,163,184,0.22)',
    dropBg:     'rgba(4,10,18,0.92)',
    dropBorder: 'rgba(148,163,184,0.28)',
    badgeBg:    'rgba(148,163,184,0.14)',
    pillActive: 'rgba(148,163,184,0.18)',
    pillBorder: 'rgba(148,163,184,0.55)',
    coinGrad:   'radial-gradient(circle at 34% 30%, #F1F5F9 0%, #CBD5E1 18%, #94A3B8 48%, #64748B 74%, #475569 100%)',
    coinShine:  'radial-gradient(circle at 30% 27%, rgba(255,255,255,0.75) 0%, rgba(220,232,244,0.18) 38%, transparent 62%)',
    coinEdge:   'conic-gradient(from 0deg, #475569, #7A9CB2, #CBD5E1, #7A9CB2, #475569, #7A9CB2, #CBD5E1, #7A9CB2, #475569)',
    coinRim:    'rgba(148,163,184,0.45)',
    coinSym:    '#334155',
    coinGlow:   '0 0 60px rgba(100,116,139,0.30), 0 20px 50px rgba(0,0,0,0.65)',
  },
  Palladium: {
    bg:         'radial-gradient(ellipse at 65% 15%, #2D3A2A 0%, #1A2416 40%, #0F1A0B 70%, #0A1206 100%)',
    blob1:      'radial-gradient(circle at 78% 8%, rgba(180,210,150,0.12) 0%, transparent 55%)',
    blob2:      'radial-gradient(circle at 18% 82%, rgba(120,160,100,0.08) 0%, transparent 45%)',
    accent:     '#A3B18A',
    accentText: '#D4E2C5',
    label:      'rgba(210,230,200,0.85)',
    cardBorder: 'rgba(163,177,138,0.22)',
    dropBg:     'rgba(4,10,18,0.92)',
    dropBorder: 'rgba(163,177,138,0.28)',
    badgeBg:    'rgba(163,177,138,0.14)',
    pillActive: 'rgba(163,177,138,0.18)',
    pillBorder: 'rgba(163,177,138,0.55)',
    coinGrad:   'radial-gradient(circle at 34% 30%, #F7FBEF 0%, #D4E2C5 18%, #A3B18A 48%, #6B7F5A 74%, #4A5D3A 100%)',
    coinShine:  'radial-gradient(circle at 30% 27%, rgba(255,255,255,0.75) 0%, rgba(230,240,220,0.18) 38%, transparent 62%)',
    coinEdge:   'conic-gradient(from 0deg, #4A5D3A, #7A8F62, #A3B18A, #7A8F62, #4A5D3A, #7A8F62, #A3B18A, #7A8F62, #4A5D3A)',
    coinRim:    'rgba(163,177,138,0.45)',
    coinSym:    '#4A5D3A',
    coinGlow:   '0 0 60px rgba(120,140,100,0.30), 0 20px 50px rgba(0,0,0,0.65)',
  },
} as const;

export type Theme = (typeof THEMES)[Metal];

export const HIST_N:    Record<Period, number> = { '7D': 14, '1M': 30, '3M': 13, '1Y': 12 };
export const HIST_DAYS: Record<Period, number> = { '7D': 7,  '1M': 30, '3M': 90, '1Y': 365 };
export const PROJ_N:    Record<Period, number> = { '7D': 12, '1M': 12, '3M': 6,  '1Y': 4  };
export const START_MUL: Record<Period, number> = { '7D': 0.958, '1M': 0.930, '3M': 0.875, '1Y': 0.755 };

export const ANCHOR = new Date(2024, 4, 20);

export const VW = 600; export const VH = 185;
export const PL = 56;  export const PR = 16; export const PT = 22; export const PB = 36;
export const CW = VW - PL - PR;
export const CH = VH - PT - PB;
