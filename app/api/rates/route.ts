import { NextRequest, NextResponse } from 'next/server';
import type { MetalRate, CurrencyRate, RatesResponse } from '@/lib/types';

// ─── Config ───────────────────────────────────────────────────────────────────
//
// API: gold.g.apised.com
//   • Real-time XAU / XAG / XPT / XPD spot prices
//   • Supports PKR (Pakistan) and INR (India) natively — no manual conversion
//   • base_currency=USD → prices arrive as USD/gram, rates as "1 USD = X local"
//   • weight_unit=gram  → prices per gram (we derive per-troy-oz internally)
//
// Alternatives considered:
//   GoldAPI.io     – great docs, free 100 req/month, same USD-base approach
//   MetalpriceAPI  – broader free tier, PKR/INR in one call, same structure
//   Frankfurter    – ECB rates only (no metals), used as FX backup if needed
//
const GOLD_API_KEY = process.env.GOLD_API_KEY ?? '';
const GOLD_API_URL =
  'https://gold.g.apised.com/v1/latest' +
  '?metals=XAU,XAG,XPT,XPD' +
  '&base_currency=USD' +          // USD base → prices already in USD, no KWD conversion
  '&currencies=USD,PKR,INR,CNY,GBP,EUR' +
  '&weight_unit=gram';

const TROY_OZ_TO_GRAM = 31.1035;

const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar',
  PKR: 'Pakistani Rupee',
  INR: 'Indian Rupee',
  CNY: 'Chinese Yuan',
  GBP: 'British Pound',
  EUR: 'Euro',
};

// ─── API types ────────────────────────────────────────────────────────────────
interface MetalPriceData {
  price:             number; // USD per gram (base_currency=USD, weight_unit=gram)
  change:            number;
  change_percentage: number;
}

interface ApiResponse {
  status: string;
  data: {
    timestamp:      number;
    base_currency:  string;
    metal_prices:   Record<string, MetalPriceData>;
    currency_rates: Record<string, number>; // 1 USD = X local currency
  };
}

// ─── Fetch ────────────────────────────────────────────────────────────────────
async function fetchRates(): Promise<ApiResponse> {
  const res = await fetch(GOLD_API_URL, {
    headers: { 'x-api-key': GOLD_API_KEY, 'Content-Type': 'application/json' },
    next: { revalidate: 300 }, // cache 5 minutes
  });
  if (!res.ok) throw new Error(`Gold API ${res.status}: ${res.statusText}`);
  return res.json();
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function GET(_req: NextRequest): Promise<NextResponse<RatesResponse | { error: string }>> {
  try {
    const { status, data } = await fetchRates();

    if (status !== 'success') throw new Error('API returned non-success status');

    const { metal_prices, currency_rates, timestamp } = data;

    // ── Metals ──────────────────────────────────────────────────────────────
    const metals: MetalRate[] = [];

    // Gold — build 24K / 22K / 18K from base XAU price
    const xau = metal_prices.XAU;
    if (xau) {
      const pgUsd  = xau.price;                    // USD per gram (already correct base)
      const pozUsd = pgUsd * TROY_OZ_TO_GRAM;      // USD per troy oz
      const chgOz  = xau.change * TROY_OZ_TO_GRAM;

      const karats = [
        { symbol: 'XAU_24K', name: 'Gold 24K', karat: '24K', ratio: 1 },
        { symbol: 'XAU_22K', name: 'Gold 22K', karat: '22K', ratio: 22 / 24 },
        { symbol: 'XAU_18K', name: 'Gold 18K', karat: '18K', ratio: 18 / 24 },
      ] as const;

      for (const k of karats) {
        metals.push({
          symbol:           k.symbol,
          name:             k.name,
          karat:            k.karat,
          pricePerGram:     pgUsd  * k.ratio,
          pricePerTroyOz:   pozUsd * k.ratio,
          currency:         'USD',
          change24h:        chgOz  * k.ratio,
          changePercent24h: xau.change_percentage,
          type:             'metal',
        });
      }
    }

    // Silver / Platinum / Palladium
    const otherMetals = [
      { apiKey: 'XAG', symbol: 'XAG', name: 'Silver'    },
      { apiKey: 'XPT', symbol: 'XPT', name: 'Platinum'  },
      { apiKey: 'XPD', symbol: 'XPD', name: 'Palladium' },
    ] as const;

    for (const m of otherMetals) {
      const d = metal_prices[m.apiKey];
      if (!d) continue;
      metals.push({
        symbol:           m.symbol,
        name:             m.name,
        pricePerGram:     d.price,
        pricePerTroyOz:   d.price * TROY_OZ_TO_GRAM,
        currency:         'USD',
        change24h:        d.change * TROY_OZ_TO_GRAM,
        changePercent24h: d.change_percentage,
        type:             'metal',
      });
    }

    // ── Currencies ───────────────────────────────────────────────────────────
    // currency_rates[code] = "1 USD = X units of code"
    // e.g. PKR: 278.5  →  priceInPKR = priceUSD × 278.5
    const currencies: CurrencyRate[] = Object.entries(currency_rates).map(([code, rate]) => ({
      symbol:       code,
      name:         CURRENCY_NAMES[code] ?? code,
      rate,               // direct multiplier: priceUSD × rate = priceLocal
      baseCurrency: 'USD',
      type:         'currency',
    }));

    const response: RatesResponse = {
      metals,
      currencies,
      lastUpdated:  new Date(timestamp > 1e10 ? timestamp : timestamp * 1000).toISOString(),
      baseCurrency: 'USD',
    };

    return NextResponse.json(response, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (error) {
    console.error('[/api/rates] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch rates. Please try again shortly.' }, { status: 502 });
  }
}
