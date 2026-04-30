'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Metal, Country, UnitType, Period } from './dashboard/types';
import { THEMES, UNIT_LABELS, G_PER_TOLA } from './dashboard/constants';
import { priceData, unitFactor } from './dashboard/utils';
import { Dropdown }             from './dashboard/Dropdown';
import { PriceChart }           from './dashboard/PriceChart';
import { MetalCalculator }      from './dashboard/MetalCalculator';
import { SpotPriceCard }        from './dashboard/SpotPriceCard';
import { ExchangeRateCard }     from './dashboard/ExchangeRateCard';
import { MarketConfidenceCard } from './dashboard/MarketConfidenceCard';
import { MarketSnapshot }       from './dashboard/MarketSnapshot';
import { GlobalMarketOverview } from './dashboard/GlobalMarketOverview';
import { MarketNews }           from './dashboard/MarketNews';
import { QuickInsights }        from './dashboard/QuickInsights';

export function Dashboard() {
  const [metal,     setMetal]     = useState<Metal>('Gold');
  const [country,   setCountry]   = useState<Country>('Pakistan');
  const [unit,      setUnit]      = useState<UnitType>('gram');
  const [period,    setPeriod]    = useState<Period>('7D');
  const karat = '24K' as const;
  const [ratesData, setRatesData] = useState<any>(null);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res  = await fetch('/api/rates');
        const data = await res.json();
        setRatesData(data);
      } catch (err) {
        console.error('Failed to fetch rates:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const theme = THEMES[metal];

  const getPriceData = (m: Metal, c: Country, u: UnitType) => {
    if (!ratesData) return priceData(m, c, u);

    const metalSymbolMap: Record<Metal, string> = {
      Gold: `XAU_${karat}`, Silver: 'XAG', Platinum: 'XPT', Palladium: 'XPD',
    };
    const metalRate = ratesData.metals?.find((x: any) => x.symbol === metalSymbolMap[m]);
    if (!metalRate) return priceData(m, c, u);

    const currencyMap: Record<Country, string> = { Pakistan: 'PKR', India: 'INR', US: 'USD', China: 'CNY' };
    const currencyCode = currencyMap[c];
    const currencyRate = ratesData.currencies?.find((x: any) => x.symbol === currencyCode);
    if (!currencyRate) return priceData(m, c, u);

    const pricePerGramLocal   = metalRate.pricePerGram   * currencyRate.rate;
    const pricePerTroyOzLocal = metalRate.pricePerTroyOz * currencyRate.rate;

    const cur  = u === 'gram' ? pricePerGramLocal : u === 'tola' ? pricePerGramLocal * G_PER_TOLA : pricePerTroyOzLocal;
    const pred = cur * 1.08;

    return {
      cur, pred,
      ccy:  currencyCode,
      chg:  `${metalRate.changePercent24h >= 0 ? '+' : ''}${metalRate.changePercent24h.toFixed(2)}%`,
      pchg: '+8.34%',
    };
  };

  const p            = getPriceData(metal, country, unit);
  const pricePerGram = p.cur / unitFactor(unit);
  const predPerGram  = p.pred / unitFactor(unit);
  const pkrRate      = ratesData?.currencies?.find((c: any) => c.symbol === 'PKR')?.rate as number | undefined;
  const lastUpdatedTime = ratesData?.lastUpdated
    ? new Date(ratesData.lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: theme.bg, transition: 'background 0.7s ease' }}
    >
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0" style={{ background: theme.blob1, transition: 'background 0.7s ease' }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: theme.blob2, transition: 'background 0.7s ease' }} />
      <div className="pointer-events-none absolute inset-0" style={{
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '256px',
      }} />

      <div className="relative z-10 mx-auto w-full max-w-screen-xl px-6 py-6">

        {/* ── Top nav bar ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-base"
              style={{ background: theme.badgeBg, border: `1px solid ${theme.cardBorder}` }}
            >
              🪙
            </div>
            <span className="text-sm font-bold" style={{ color: theme.accentText }}>Precious Metals</span>
          </div>

          <div className="flex items-center gap-4">
            {lastUpdatedTime && (
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Last updated: {lastUpdatedTime} PKT
                </span>
              </div>
            )}
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-opacity hover:opacity-70"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              🔔
            </button>
          </div>
        </div>

        {/* ── Title + controls row ── */}
        <div className="flex items-end justify-between mb-6 gap-6">
          <motion.div key={metal} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-[2.2rem] font-black leading-none tracking-tight text-white">
              Market Tracker
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.38)' }}>
              Real-time prices, trends and market insights
            </p>
          </motion.div>

          <div className="flex items-end gap-4 flex-shrink-0">
            {/* Dropdowns */}
            <div className="flex gap-3">
              <Dropdown
                label="Metal" value={metal} onChange={setMetal} theme={theme}
                options={[
                  { value: 'Gold',      label: '✦  Gold' },
                  { value: 'Silver',    label: '◈  Silver' },
                  { value: 'Platinum',  label: '◇  Platinum' },
                  { value: 'Palladium', label: '◆  Palladium' },
                ]}
              />
              <Dropdown
                label="Country" value={country} onChange={setCountry} theme={theme}
                options={[
                  { value: 'Pakistan', label: '🇵🇰  Pakistan' },
                  { value: 'India',    label: '🇮🇳  India' },
                  { value: 'US',       label: '🇺🇸  United States' },
                  { value: 'China',    label: '🇨🇳  China' },
                ]}
              />
            </div>

            {/* Unit pills */}
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.38)' }}>
                Unit
              </label>
              <div className="flex rounded-2xl overflow-hidden" style={{ border: `1px solid ${theme.cardBorder}`, background: 'rgba(0,0,0,0.2)' }}>
                {(['gram', 'tola', 'troyoz'] as UnitType[]).map(u => {
                  const active = u === unit;
                  return (
                    <button
                      key={u}
                      onClick={() => setUnit(u)}
                      className="px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap"
                      style={{
                        color:      active ? theme.accentText : 'rgba(255,255,255,0.4)',
                        background: active ? theme.pillActive : 'transparent',
                        border:     'none',
                      }}
                    >
                      {UNIT_LABELS[u]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 1: Three summary cards ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`r1-${metal}-${country}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-3 gap-4 mb-4"
          >
            <SpotPriceCard
              metal={metal} country={country} unit={unit}
              pricePerGram={pricePerGram} predPerGram={predPerGram}
              ccy={p.ccy} chg={p.chg} theme={theme}
            />
            <ExchangeRateCard
              metal={metal} pkrRate={pkrRate}
              lastUpdated={lastUpdatedTime} theme={theme}
            />
            <MarketConfidenceCard theme={theme} />
          </motion.div>
        </AnimatePresence>

        {/* ── Row 2: Chart + Calculator + Snapshot ── */}
        <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: '1fr 340px 280px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`chart-${metal}-${country}-${unit}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{    opacity: 0, y: 8 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <PriceChart
                metal={metal} country={country}
                cur={p.cur} pred={p.pred} ccy={p.ccy}
                period={period} setPeriod={setPeriod}
                theme={theme}
              />
            </motion.div>
          </AnimatePresence>

          <MetalCalculator pricePerGram={pricePerGram} ccy={p.ccy} />

          <AnimatePresence mode="wait">
            <motion.div
              key={`snap-${metal}-${country}-${unit}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MarketSnapshot
                metal={metal} pricePerGram={pricePerGram}
                pred={predPerGram} ccy={p.ccy} theme={theme}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Row 3: Overview + News + Insights ── */}
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr 320px' }}>
          <GlobalMarketOverview theme={theme} />
          <MarketNews           theme={theme} />
          <QuickInsights metal={metal} theme={theme} />
        </div>

        <p className="mt-5 text-center text-[10px]" style={{ color: 'rgba(255,255,255,0.16)' }}>
          Prices are indicative · Forecast uses a hypothetical model, not financial advice
        </p>
      </div>
    </div>
  );
}
