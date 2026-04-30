import { NextRequest, NextResponse } from 'next/server';
import type { MetalRate, CurrencyRate, RatesResponse } from '@/lib/types';

const GOLD_API_KEY = 'sk_1E80853EB18f159B0020b1323A0BbA099E03b4825d9fda0d';
const GOLD_API_URL = 'https://gold.g.apised.com/v1/latest?metals=XAU,XAG,XPT,XPD&base_currency=KWD&currencies=EUR,KWD,GBP,USD,PKR,INR,CNY&weight_unit=gram';

const TROY_OZ_TO_GRAM = 31.1035;

const CURRENCY_NAMES: Record<string, string> = {
  EUR: 'Euro',
  GBP: 'British Pound Sterling',
  USD: 'US Dollar',
  KWD: 'Kuwaiti Dinar',
  PKR: 'Pakistani Rupee',
  INR: 'Indian Rupee',
  CNY: 'Chinese Yuan',
};

interface MetalPriceData {
  price: number;
  change: number;
  change_percentage: number;
  price_24k?: number;
  price_22k?: number;
  price_18k?: number;
}

interface ApiResponse {
  status: string;
  data: {
    timestamp: number;
    base_currency: string;
    metals: string;
    weight_unit: string;
    weight_name: string;
    metal_prices: Record<string, MetalPriceData>;
    currency_rates: Record<string, number>;
  };
}

async function fetchRates(): Promise<ApiResponse> {
  const res = await fetch(GOLD_API_URL, {
    headers: {
      'x-api-key': GOLD_API_KEY,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Gold API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function GET(_request: NextRequest): Promise<NextResponse<RatesResponse | { error: string }>> {
  try {
    const apiData = await fetchRates();

    if (apiData.status !== 'success') {
      throw new Error('API returned non-success status');
    }

    const { metal_prices, currency_rates } = apiData.data;

    // Convert KWD to USD rate
    const kwdToUsd = currency_rates.USD;

    const metals: MetalRate[] = [];

    // Gold 24K
    if (metal_prices.XAU) {
      const goldData = metal_prices.XAU;
      const pricePerGramUSD = goldData.price / kwdToUsd; // Convert from KWD to USD
      const pricePerTroyOzUSD = pricePerGramUSD * TROY_OZ_TO_GRAM; // Convert grams to troy oz

      metals.push({
        symbol: 'XAU_24K',
        name: 'Gold 24K',
        karat: '24K',
        pricePerTroyOz: pricePerTroyOzUSD,
        pricePerGram: pricePerGramUSD,
        currency: 'USD',
        change24h: goldData.change / kwdToUsd * TROY_OZ_TO_GRAM, // Convert change to USD per troy oz
        changePercent24h: goldData.change_percentage,
        type: 'metal',
      });

      // Gold 22K
      metals.push({
        symbol: 'XAU_22K',
        name: 'Gold 22K',
        karat: '22K',
        pricePerTroyOz: pricePerTroyOzUSD * (22 / 24),
        pricePerGram: pricePerGramUSD * (22 / 24),
        currency: 'USD',
        change24h: (goldData.change / kwdToUsd * TROY_OZ_TO_GRAM) * (22 / 24),
        changePercent24h: goldData.change_percentage,
        type: 'metal',
      });

      // Gold 18K
      metals.push({
        symbol: 'XAU_18K',
        name: 'Gold 18K',
        karat: '18K',
        pricePerTroyOz: pricePerTroyOzUSD * (18 / 24),
        pricePerGram: pricePerGramUSD * (18 / 24),
        currency: 'USD',
        change24h: (goldData.change / kwdToUsd * TROY_OZ_TO_GRAM) * (18 / 24),
        changePercent24h: goldData.change_percentage,
        type: 'metal',
      });
    }

    // Silver
    if (metal_prices.XAG) {
      const silverData = metal_prices.XAG;
      const pricePerGramUSD = silverData.price / kwdToUsd;
      const pricePerTroyOzUSD = pricePerGramUSD * TROY_OZ_TO_GRAM;

      metals.push({
        symbol: 'XAG',
        name: 'Silver',
        pricePerTroyOz: pricePerTroyOzUSD,
        pricePerGram: pricePerGramUSD,
        currency: 'USD',
        change24h: silverData.change / kwdToUsd * TROY_OZ_TO_GRAM,
        changePercent24h: silverData.change_percentage,
        type: 'metal',
      });
    }

    // Platinum
    if (metal_prices.XPT) {
      const platinumData = metal_prices.XPT;
      const pricePerGramUSD = platinumData.price / kwdToUsd;
      const pricePerTroyOzUSD = pricePerGramUSD * TROY_OZ_TO_GRAM;

      metals.push({
        symbol: 'XPT',
        name: 'Platinum',
        pricePerTroyOz: pricePerTroyOzUSD,
        pricePerGram: pricePerGramUSD,
        currency: 'USD',
        change24h: platinumData.change / kwdToUsd * TROY_OZ_TO_GRAM,
        changePercent24h: platinumData.change_percentage,
        type: 'metal',
      });
    }

    // Palladium
    if (metal_prices.XPD) {
      const palladiumData = metal_prices.XPD;
      const pricePerGramUSD = palladiumData.price / kwdToUsd;
      const pricePerTroyOzUSD = pricePerGramUSD * TROY_OZ_TO_GRAM;

      metals.push({
        symbol: 'XPD',
        name: 'Palladium',
        pricePerTroyOz: pricePerTroyOzUSD,
        pricePerGram: pricePerGramUSD,
        currency: 'USD',
        change24h: palladiumData.change / kwdToUsd * TROY_OZ_TO_GRAM,
        changePercent24h: palladiumData.change_percentage,
        type: 'metal',
      });
    }

    const currencies: CurrencyRate[] = Object.entries(currency_rates).map(([code, rate]) => ({
      symbol: code,
      name: CURRENCY_NAMES[code] ?? code,
      rate: rate / currency_rates.USD, // Convert to USD base
      baseCurrency: 'USD',
      type: 'currency',
    }));

    const response: RatesResponse = {
      metals,
      currencies,
      lastUpdated: new Date(apiData.data.timestamp).toISOString(),
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
