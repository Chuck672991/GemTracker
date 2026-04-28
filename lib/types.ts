export interface MetalRate {
  symbol: string;
  name: string;
  karat?: string;
  pricePerTroyOz: number;
  pricePerGram: number;
  currency: string;
  change24h: number;
  changePercent24h: number;
  type: 'metal';
}

export interface CurrencyRate {
  symbol: string;
  name: string;
  rate: number;
  baseCurrency: string;
  type: 'currency';
}

export type RateItem = MetalRate | CurrencyRate;

export interface RatesResponse {
  metals: MetalRate[];
  currencies: CurrencyRate[];
  lastUpdated: string;
  baseCurrency: string;
}
