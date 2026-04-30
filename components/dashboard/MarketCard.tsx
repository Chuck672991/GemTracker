'use client';

import { motion } from 'framer-motion';
import type { Metal } from './types';
import type { Theme } from './constants';

interface MarketCardProps {
  metal:       Metal;
  price:       number;
  prediction:  number;
  ccy:         string;
  change:      string;
  theme:       Theme;
  lastUpdated: string | null;
  pkrRate:     number | undefined;
  karat:       '24K' | '22K' | '18K';
  setKarat:    (k: '24K' | '22K' | '18K') => void;
}

export function MarketCard({ metal, price, prediction, ccy, change, theme, lastUpdated, pkrRate, karat, setKarat }: MarketCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[32px] p-8"
      style={{
        background:     'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(40px)',
        border:         `1px solid ${theme.cardBorder}`,
        boxShadow:      '0 20px 50px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1)',
      }}
    >
      {/* Top Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">Live Market</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white">{metal}</h2>
          <p className="text-xs text-white/40">Global Bullion Exchange</p>
        </div>

        <div className="text-right">
          <p className="text-[10px] text-white/30 uppercase tracking-tighter">Exchange Rate</p>
          {pkrRate && (
            <p className="text-sm font-medium" style={{ color: '#FFD700' }}>USD/PKR {pkrRate.toFixed(1)}</p>
          )}
          {lastUpdated && (
            <p className="text-[9px] text-white/20">Updated {lastUpdated}</p>
          )}
        </div>
      </div>

      {/* Karat Selector (Gold only) */}
      {metal === 'Gold' && (
        <div className="flex p-1 mb-8 rounded-2xl bg-black/20 border border-white/5">
          {(['24K', '22K', '18K'] as const).map(k => (
            <button
              key={k}
              onClick={() => setKarat(k)}
              className="flex-1 py-2 text-xs font-bold rounded-xl transition-all text-white/40 hover:text-white/60"
              style={karat === k ? { color: '#FFD700', backgroundColor: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)' } : {}}
            >
              {k}
            </button>
          ))}
        </div>
      )}

      {/* Primary Price */}
      <div className="space-y-1 mb-8">
        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Spot Price (Per Gram)</span>
        <div className="flex items-baseline gap-3">
          <h1 className="text-5xl font-black tracking-tighter text-white">
            {price.toLocaleString('en-US', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xl font-medium text-white/40">{ccy}</span>
          </h1>
          <div className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-xs font-bold text-emerald-400">{change}</span>
          </div>
        </div>
      </div>

      {/* Prediction Footer */}
      <div className="pt-6 border-t border-white/5 flex justify-between items-center">
        <div>
          <p className="text-[9px] font-bold text-white/30 uppercase">30-Day Forecast</p>
          <p className="text-lg font-bold" style={{ color: '#FFD700' }}>
            {prediction.toLocaleString('en-US', { maximumFractionDigits: 0 })} {ccy}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold text-white/30 uppercase">Confidence</p>
          <p className="text-xs font-bold text-emerald-400">High Score</p>
        </div>
      </div>
    </motion.div>
  );
}
