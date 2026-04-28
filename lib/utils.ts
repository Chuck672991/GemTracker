import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { BaseCurrency } from '@/store/rates';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CURRENCY_LOCALES: Record<BaseCurrency, string> = {
  USD: 'en-US',
  INR: 'en-IN',
  EUR: 'de-DE',
};

export function formatPrice(value: number, currency: string = 'USD'): string {
  const locale = CURRENCY_LOCALES[currency as BaseCurrency] ?? 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatRate(value: number): string {
  if (value >= 1000) return value.toFixed(2);
  if (value >= 100) return value.toFixed(3);
  if (value >= 1) return value.toFixed(4);
  return value.toFixed(6);
}

export function formatChange(value: number, isPercent = false): string {
  const sign = value >= 0 ? '+' : '';
  return isPercent ? `${sign}${value.toFixed(2)}%` : `${sign}${value.toFixed(2)}`;
}

export function formatTimestamp(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(iso));
}

/** Convert a USD-based price into the target base currency. */
export function convertPrice(
  usdPrice: number,
  targetCurrency: BaseCurrency,
  fxRates: Record<string, number>
): number {
  if (targetCurrency === 'USD') return usdPrice;
  const rate = fxRates[targetCurrency];
  if (!rate) return usdPrice;
  return usdPrice * rate;
}

/**
 * Given USD→other rates, compute base→target rate.
 * e.g. if base=EUR: EUR→GBP = USD→GBP / USD→EUR
 */
export function crossRate(
  usdToTarget: number,
  baseCurrency: BaseCurrency,
  fxRates: Record<string, number>
): number {
  if (baseCurrency === 'USD') return usdToTarget;
  const usdToBase = fxRates[baseCurrency] ?? 1;
  return usdToTarget / usdToBase;
}
