'use client';

import type { Metal } from './types';
import type { Theme } from './constants';

interface DropdownProps<T extends string> {
  label:    string;
  value:    T;
  onChange: (v: T) => void;
  options:  { value: T; label: string }[];
  theme:    Theme;
}

export function Dropdown<T extends string>({ label, value, onChange, options, theme }: DropdownProps<T>) {
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
            background:          theme.dropBg,
            border:              `1px solid ${theme.dropBorder}`,
            backdropFilter:      'blur(24px)',
            WebkitBackdropFilter:'blur(24px)',
            boxShadow:           '0 4px 24px rgba(0,0,0,0.35)',
            transition:          'border-color 0.5s ease, background 0.5s ease',
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
