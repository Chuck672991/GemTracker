'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Metal = 'Gold' | 'Silver';
type Country = 'Pakistan' | 'India' | 'US' | 'China';

const PRICE_DATA = {
  Gold: {
    Pakistan: { current: 198450,  predicted: 215340,  currency: 'PKR', unit: 'Per Tola (24K)',  change: '+1.25%', predictedChange: '+8.50%' },
    India:    { current: 59320,   predicted: 64200,   currency: 'INR', unit: 'Per Gram (24K)',   change: '+0.92%', predictedChange: '+8.23%' },
    US:       { current: 2385.50, predicted: 2580.00, currency: 'USD', unit: 'Per Troy Oz',      change: '+1.10%', predictedChange: '+8.17%' },
    China:    { current: 17280,   predicted: 18700,   currency: 'CNY', unit: 'Per Troy Oz',      change: '+0.98%', predictedChange: '+8.22%' },
  },
  Silver: {
    Pakistan: { current: 2450,  predicted: 2680,  currency: 'PKR', unit: 'Per Tola',    change: '+2.15%', predictedChange: '+9.39%'  },
    India:    { current: 73,    predicted: 81,    currency: 'INR', unit: 'Per Gram',     change: '+1.88%', predictedChange: '+10.96%' },
    US:       { current: 29.50, predicted: 33.20, currency: 'USD', unit: 'Per Troy Oz', change: '+2.05%', predictedChange: '+12.54%' },
    China:    { current: 212,   predicted: 238,   currency: 'CNY', unit: 'Per Troy Oz', change: '+1.95%', predictedChange: '+12.26%' },
  },
} as const;

const THEMES = {
  Gold: {
    bg:               'radial-gradient(ellipse at 65% 15%, #5C3D08 0%, #2A1A02 40%, #120B00 70%, #080400 100%)',
    blob1:            'radial-gradient(circle at 78% 8%,  rgba(255,190,30,0.18)  0%, transparent 55%)',
    blob2:            'radial-gradient(circle at 18% 82%, rgba(180,120,0,0.12)   0%, transparent 45%)',
    accentText:       '#FFD700',
    label:            'rgba(255,210,60,0.85)',
    cardBorder:       'rgba(245,197,24,0.22)',
    accentMuted:      'rgba(245,197,24,0.14)',
    dropdownBg:       'rgba(28,18,4,0.92)',
    dropdownBorder:   'rgba(245,197,24,0.28)',
    predictedColor:   '#FFD700',
    badgeBg:          'rgba(245,197,24,0.14)',
    glowColor:        'rgba(255,190,0,0.28)',
    coinGradient:     'radial-gradient(circle at 34% 30%, #FFFBD0 0%, #FFD700 18%, #DAA520 48%, #B8860B 74%, #8B6400 100%)',
    coinShine:        'radial-gradient(circle at 30% 27%, rgba(255,255,230,0.65) 0%, rgba(255,220,50,0.18) 38%, transparent 62%)',
    coinEdge:         'conic-gradient(from 0deg, #7A5500, #C8960C, #FFD700, #C8960C, #7A5500, #C8960C, #FFD700, #C8960C, #7A5500)',
    coinRim:          'rgba(218,165,32,0.45)',
    coinSymbol:       '#8B6400',
    glow:             '0 0 60px rgba(218,165,32,0.35), 0 20px 50px rgba(0,0,0,0.65)',
  },
  Silver: {
    bg:               'radial-gradient(ellipse at 65% 15%, #1E2E3D 0%, #0C1820 40%, #050D14 70%, #020609 100%)',
    blob1:            'radial-gradient(circle at 78% 8%,  rgba(148,180,210,0.14) 0%, transparent 55%)',
    blob2:            'radial-gradient(circle at 18% 82%, rgba(90,130,160,0.09)  0%, transparent 45%)',
    accentText:       '#CBD5E1',
    label:            'rgba(200,216,232,0.85)',
    cardBorder:       'rgba(148,163,184,0.22)',
    accentMuted:      'rgba(148,163,184,0.14)',
    dropdownBg:       'rgba(4,10,18,0.92)',
    dropdownBorder:   'rgba(148,163,184,0.28)',
    predictedColor:   '#94A3B8',
    badgeBg:          'rgba(148,163,184,0.14)',
    glowColor:        'rgba(148,163,184,0.22)',
    coinGradient:     'radial-gradient(circle at 34% 30%, #F8FAFC 0%, #CBD5E1 18%, #94A3B8 48%, #64748B 74%, #3E5060 100%)',
    coinShine:        'radial-gradient(circle at 30% 27%, rgba(255,255,255,0.72) 0%, rgba(220,232,244,0.18) 38%, transparent 62%)',
    coinEdge:         'conic-gradient(from 0deg, #3E5060, #7A9CB2, #CBD5E1, #7A9CB2, #3E5060, #7A9CB2, #CBD5E1, #7A9CB2, #3E5060)',
    coinRim:          'rgba(148,163,184,0.45)',
    coinSymbol:       '#475569',
    glow:             '0 0 60px rgba(100,116,139,0.30), 0 20px 50px rgba(0,0,0,0.65)',
  },
} as const;

function formatPrice(value: number, currency: string): string {
  if (value >= 1000) {
    return `${currency} ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
  return `${currency} ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function CoinVisual({ metal, theme }: { metal: Metal; theme: (typeof THEMES)[Metal] }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 190, height: 190 }}>
      {/* Ambient glow behind coin */}
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 240,
          height: 240,
          background: metal === 'Gold'
            ? 'radial-gradient(circle, rgba(255,200,0,0.22) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(148,163,184,0.18) 0%, transparent 70%)',
          filter: 'blur(18px)',
        }}
      />

      {/* Drop shadow layer */}
      <div
        className="absolute rounded-full"
        style={{
          width: 160,
          height: 30,
          top: '82%',
          background: 'rgba(0,0,0,0.45)',
          filter: 'blur(18px)',
          transform: 'scaleX(0.85)',
        }}
      />

      {/* Coin edge (the rim) */}
      <div
        className="absolute rounded-full"
        style={{
          width: 172,
          height: 172,
          background: theme.coinEdge,
          boxShadow: theme.glow,
        }}
      />

      {/* Coin face */}
      <div
        className="absolute rounded-full"
        style={{
          width: 156,
          height: 156,
          background: theme.coinGradient,
          overflow: 'hidden',
        }}
      >
        {/* Shine reflection */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: theme.coinShine }}
        />

        {/* Inner embossed ring */}
        <div
          className="absolute rounded-full"
          style={{
            top: 14,
            left: 14,
            right: 14,
            bottom: 14,
            border: `1.5px solid ${theme.coinRim}`,
          }}
        />

        {/* Center logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="52"
            height="52"
            viewBox="0 0 52 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}
          >
            {metal === 'Gold' ? (
              <>
                {/* Gold star / sun motif */}
                <circle cx="26" cy="26" r="10" fill={theme.coinSymbol} fillOpacity="0.6" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <rect
                    key={deg}
                    x="24.5" y="6"
                    width="3" height="10"
                    rx="1.5"
                    fill={theme.coinSymbol}
                    fillOpacity="0.7"
                    transform={`rotate(${deg} 26 26)`}
                  />
                ))}
              </>
            ) : (
              <>
                {/* Silver hexagonal facet motif */}
                <polygon
                  points="26,10 38.7,18 38.7,34 26,42 13.3,34 13.3,18"
                  fill="none"
                  stroke={theme.coinSymbol}
                  strokeWidth="2.5"
                  strokeOpacity="0.65"
                />
                <polygon
                  points="26,18 33.5,22 33.5,30 26,34 18.5,30 18.5,22"
                  fill={theme.coinSymbol}
                  fillOpacity="0.35"
                  stroke={theme.coinSymbol}
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                />
              </>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [metal, setMetal] = useState<Metal>('Gold');
  const [country, setCountry] = useState<Country>('Pakistan');

  const theme = THEMES[metal];
  const price = PRICE_DATA[metal][country];

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{ background: theme.bg, transition: 'background 0.7s ease' }}
    >
      {/* Background blobs */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: theme.blob1, transition: 'background 0.7s ease' }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: theme.blob2, transition: 'background 0.7s ease' }}
      />

      {/* Grain texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px',
        }}
      />

      <div className="relative z-10 w-full max-w-xl px-4 py-12">

        {/* Page heading */}
        <div className="mb-10 text-center">
          <motion.div
            key={metal}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p
              className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em]"
              style={{ color: theme.label, transition: 'color 0.6s ease' }}
            >
              Precious Metals
            </p>
            <h1
              className="text-[2.6rem] font-bold leading-none tracking-tight text-white"
              style={{ textShadow: '0 2px 24px rgba(0,0,0,0.55)' }}
            >
              Market Tracker
            </h1>
          </motion.div>
        </div>

        {/* Dropdown row */}
        <div className="mb-7 flex gap-3">
          <div className="flex-1">
            <label
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,0.38)' }}
            >
              Metal
            </label>
            <div className="relative">
              <select
                value={metal}
                onChange={(e) => setMetal(e.target.value as Metal)}
                className="w-full cursor-pointer appearance-none rounded-2xl px-4 py-3.5 pr-10 text-sm font-semibold text-white outline-none"
                style={{
                  background: theme.dropdownBg,
                  border: `1px solid ${theme.dropdownBorder}`,
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
                  transition: 'border-color 0.5s ease, background 0.5s ease',
                }}
              >
                <option value="Gold">✦  Gold</option>
                <option value="Silver">◈  Silver</option>
              </select>
              <div
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                style={{ color: theme.accentText }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 8L1 3h10L6 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <label
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,0.38)' }}
            >
              Country
            </label>
            <div className="relative">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as Country)}
                className="w-full cursor-pointer appearance-none rounded-2xl px-4 py-3.5 pr-10 text-sm font-semibold text-white outline-none"
                style={{
                  background: theme.dropdownBg,
                  border: `1px solid ${theme.dropdownBorder}`,
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
                  transition: 'border-color 0.5s ease, background 0.5s ease',
                }}
              >
                <option value="Pakistan">🇵🇰  Pakistan</option>
                <option value="India">🇮🇳  India</option>
                <option value="US">🇺🇸  United States</option>
                <option value="China">🇨🇳  China</option>
              </select>
              <div
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                style={{ color: theme.accentText }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 8L1 3h10L6 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Glass card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${metal}-${country}`}
            initial={{ opacity: 0, y: 18, scale: 0.975 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.975 }}
            transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative overflow-hidden rounded-3xl"
            style={{
              background: 'rgba(255,255,255,0.045)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              border: `1px solid ${theme.cardBorder}`,
              boxShadow: `0 8px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.2)`,
              transition: 'border-color 0.6s ease',
            }}
          >
            {/* Top edge gloss line */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)' }}
            />

            <div className="flex items-center">
              {/* ── Left: price content ── */}
              <div className="flex-1 px-8 py-8">

                {/* Metal name + Live badge */}
                <div className="mb-7 flex items-start justify-between">
                  <div>
                    <motion.h2
                      key={metal}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                      className="text-[2rem] font-bold leading-none"
                      style={{ color: theme.accentText, transition: 'color 0.6s ease' }}
                    >
                      {metal}
                    </motion.h2>
                    <p className="mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>
                      Real-time Market Overview
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: 'rgba(34,197,94,0.12)' }}>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400">Live</span>
                  </div>
                </div>

                {/* Current price block */}
                <div className="mb-6">
                  <p
                    className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: theme.label, transition: 'color 0.6s ease' }}
                  >
                    Current Market Price
                  </p>
                  <p
                    className="text-[2.1rem] font-bold leading-none tabular-nums text-white"
                    style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
                  >
                    {formatPrice(price.current, price.currency)}
                  </p>
                  <p className="mt-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>
                    {price.unit}
                  </p>
                  <div
                    className="mt-2.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                    style={{ background: 'rgba(34,197,94,0.12)' }}
                  >
                    <span className="text-xs font-bold text-emerald-400">↑ {price.change}</span>
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>vs yesterday</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="mb-6 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />

                {/* Predicted price block */}
                <div>
                  <p
                    className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: theme.label, transition: 'color 0.6s ease' }}
                  >
                    Predicted Future Price
                  </p>
                  <p
                    className="text-[1.7rem] font-bold leading-none tabular-nums"
                    style={{ color: theme.predictedColor, transition: 'color 0.6s ease' }}
                  >
                    {formatPrice(price.predicted, price.currency)}
                  </p>
                  <p className="mt-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>
                    In 30 Days
                  </p>
                  <div
                    className="mt-2.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                    style={{ background: theme.badgeBg, transition: 'background 0.6s ease' }}
                  >
                    <span className="text-xs font-bold" style={{ color: theme.accentText }}>
                      ↑ {price.predictedChange}
                    </span>
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>predicted change</span>
                  </div>
                </div>
              </div>

              {/* ── Right: coin ── */}
              <div className="flex shrink-0 items-center justify-center pr-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={metal}
                    initial={{ opacity: 0, scale: 0.78, rotate: -12 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.78, rotate: 12 }}
                    transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <CoinVisual metal={metal} theme={theme} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer note */}
        <p className="mt-5 text-center text-[10px]" style={{ color: 'rgba(255,255,255,0.18)' }}>
          Prices are indicative &middot; Forecast uses a hypothetical model, not financial advice
        </p>
      </div>
    </div>
  );
}
