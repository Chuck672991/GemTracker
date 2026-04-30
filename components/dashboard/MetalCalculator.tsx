'use client';

import { useState } from 'react';

interface MetalCalculatorProps {
  pricePerGram: number;
  ccy:          string;
}

const PRESETS = [
  { label: '1g',     value: 1 },
  { label: '10g',    value: 10 },
  { label: '1 Tola', value: 11.66 },
  { label: '1oz',    value: 31.1 },
];

export function MetalCalculator({ pricePerGram, ccy }: MetalCalculatorProps) {
  const [amount, setAmount] = useState(1);

  const total = (amount * pricePerGram).toLocaleString('en-US', { maximumFractionDigits: 0 });

  return (
    <div className="rounded-[32px] p-1 border border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="p-7">
        <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#FFD700' }}>
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="12" y2="14" />
          </svg>
          Investment Calculator
        </h3>

        {/* Preset Quick-Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => setAmount(p.value)}
              className="py-2 text-[10px] font-bold rounded-lg border border-white/5 bg-white/5 text-white/60 hover:bg-white/10 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input Field */}
        <div className="relative mb-8">
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(parseFloat(e.target.value) || 0)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xl font-bold text-white outline-none transition-all"
            placeholder="Enter weight..."
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-white/30 uppercase">
            Grams
          </span>
        </div>

        {/* Result Table */}
        <div className="space-y-3 px-1">
          <div className="flex justify-between text-xs">
            <span className="text-white/40">Rate per gram</span>
            <span className="text-white/80">{pricePerGram.toLocaleString('en-US', { maximumFractionDigits: 2 })} {ccy}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/40">Weight</span>
            <span className="text-white/80">{amount} g</span>
          </div>
          <div className="h-px bg-white/5 my-2" />
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-bold uppercase" style={{ color: '#FFD700' }}>Total Value</span>
            <span className="text-3xl font-black text-white leading-none">
              {total} <span className="text-sm font-medium text-white/40">{ccy}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
