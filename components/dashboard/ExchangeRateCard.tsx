'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Metal } from './types';
import type { Theme } from './constants';
import { CoinVisual } from './CoinVisual';

interface ExchangeRateCardProps {
  metal:       Metal;
  pkrRate:     number | undefined;
  lastUpdated: string | null;
  theme:       Theme;
}

export function ExchangeRateCard({ metal, pkrRate, lastUpdated, theme }: ExchangeRateCardProps) {
  return (
    <div
      className="rounded-2xl p-5 overflow-hidden relative flex flex-col justify-between"
      style={{
        background:     'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
        border:         `1px solid ${theme.cardBorder}`,
        boxShadow:      '0 4px 24px rgba(0,0,0,0.25)',
      }}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Exchange Rate
      </p>

      <div className="flex items-center justify-between flex-1">
        <div>
          <p className="text-[2rem] font-black text-white tracking-tight leading-none">
            USD/PKR {pkrRate ? pkrRate.toFixed(1) : '—'}
          </p>
          {lastUpdated && (
            <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Updated {lastUpdated}
            </p>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={metal}
            initial={{ opacity: 0, scale: 0.72, rotate: -18 }}
            animate={{ opacity: 1, scale: 1,    rotate: 0 }}
            exit={{    opacity: 0, scale: 0.72,  rotate: 18 }}
            transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <CoinVisual metal={metal} theme={theme} size={130} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
