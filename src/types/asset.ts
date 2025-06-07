export type AssetType = 'stock' | 'crypto' | 'fund';

export interface Asset {
  id: string;
  rank: number;
  symbol: string;
  name: string;
  type: AssetType;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume: number;
}