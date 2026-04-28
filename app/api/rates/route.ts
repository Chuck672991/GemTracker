import { NextRequest, NextResponse } from 'next/server';
import type { MetalRate, CurrencyRate, RatesResponse } from '@/lib/types';

const GOLD_API_KEY = process.env.GOLD_API_KEY;
const GOLD_API_BASE = 'https://www.goldapi.io/api';
const TROY_OZ_TO_GRAM = 31.1035;

const CURRENCY_NAMES: Record<string, string> = {
  EUR: 'Euro',
  GBP: 'British Pound Sterling',
  JPY: 'Japanese Yen',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan Renminbi',
  INR: 'Indian Rupee',
  SGD: 'Singapore Dollar',
  HKD: 'Hong Kong Dollar',
  NZD: 'New Zealand Dollar',
  TRY: 'Turkish Lira',
  BRL: 'Brazilian Real',
  KRW: 'South Korean Won',
  SEK: 'Swedish Krona',
  NOK: 'Norwegian Krone',
};

const CURRENCY_LIST = Object.keys(CURRENCY_NAMES).join(',');

async function fetchMetalSpot(symbol: 'XAU' | 'XAG'): Promise<{
  price: number;
  ch: number;
  chp: number;
}> {
  if (!GOLD_API_KEY) {
    // Mock data for local development without an API key
    return symbol === 'XAU'
      ? { price: 3324.5, ch: 18.3, chp: 0.55 }
      : { price: 33.12, ch: 0.28, chp: 0.85 };
  }

  const res = await fetch(`${GOLD_API_BASE}/${symbol}/USD`, {
    headers: {
      'x-access-token': GOLD_API_KEY,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`GoldAPI ${symbol} error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

async function fetchExchangeRates(): Promise<Record<string, number>> {
  const res = await fetch(
    `https://api.frankfurter.app/latest?from=USD&to=${CURRENCY_LIST}`,
    { next: { revalidate: 300 } }
  );

  if (!res.ok) {
    throw new Error(`Frankfurter API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.rates as Record<string, number>;
}

export async function GET(_request: NextRequest): Promise<NextResponse<RatesResponse | { error: string }>> {
  try {
    const [goldData, silverData, fxRates] = await Promise.all([
      fetchMetalSpot('XAU'),
      fetchMetalSpot('XAG'),
      fetchExchangeRates(),
    ]);

    const goldSpot = goldData.price;
    const silverSpot = silverData.price;

    const metals: MetalRate[] = [
      {
        symbol: 'XAU_24K',
        name: 'Gold 24K',
        karat: '24K',
        pricePerTroyOz: goldSpot,
        pricePerGram: goldSpot / TROY_OZ_TO_GRAM,
        currency: 'USD',
        change24h: goldData.ch ?? 0,
        changePercent24h: goldData.chp ?? 0,
        type: 'metal',
      },
      {
        symbol: 'XAU_22K',
        name: 'Gold 22K',
        karat: '22K',
        pricePerTroyOz: goldSpot * (22 / 24),
        pricePerGram: (goldSpot / TROY_OZ_TO_GRAM) * (22 / 24),
        currency: 'USD',
        change24h: (goldData.ch ?? 0) * (22 / 24),
        changePercent24h: goldData.chp ?? 0,
        type: 'metal',
      },
      {
        symbol: 'XAU_18K',
        name: 'Gold 18K',
        karat: '18K',
        pricePerTroyOz: goldSpot * (18 / 24),
        pricePerGram: (goldSpot / TROY_OZ_TO_GRAM) * (18 / 24),
        currency: 'USD',
        change24h: (goldData.ch ?? 0) * (18 / 24),
        changePercent24h: goldData.chp ?? 0,
        type: 'metal',
      },
      {
        symbol: 'XAG',
        name: 'Silver',
        pricePerTroyOz: silverSpot,
        pricePerGram: silverSpot / TROY_OZ_TO_GRAM,
        currency: 'USD',
        change24h: silverData.ch ?? 0,
        changePercent24h: silverData.chp ?? 0,
        type: 'metal',
      },
    ];

    const currencies: CurrencyRate[] = Object.entries(fxRates).map(([code, rate]) => ({
      symbol: code,
      name: CURRENCY_NAMES[code] ?? code,
      rate,
      baseCurrency: 'USD',
      type: 'currency',
    }));

    const response: RatesResponse = {
      metals,
      currencies,
      lastUpdated: new Date().toISOString(),
      baseCurrency: 'USD',
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('[/api/rates] Failed to fetch rates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rates. Please try again shortly.' },
      { status: 502 }
    );
  }
}
