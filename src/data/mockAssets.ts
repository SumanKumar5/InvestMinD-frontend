import { Asset } from '../types/asset';

export const mockAssets: Asset[] = [
  {
    id: '1',
    rank: 1,
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    price: 203.27,
    priceChange24h: 0.79,
    marketCap: 3280731380700,
    volume: 50000000000 // Approximate volume
  },
  {
    id: '2',
    rank: 2,
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    type: 'stock',
    price: 462.97,
    priceChange24h: 0.25,
    marketCap: 2790642591197,
    volume: 40000000000 // Approximate volume
  },
  {
    id: '3',
    rank: 3,
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'crypto',
    price: 105759.0,
    priceChange24h: 0.39,
    marketCap: 2101943399386,
    volume: 45090106518
  },
  {
    id: '4',
    rank: 4,
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    type: 'stock',
    price: 166.18,
    priceChange24h: -1.71,
    marketCap: 1876556400000,
    volume: 30000000000 // Approximate volume
  },
  {
    id: '5',
    rank: 5,
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'crypto',
    price: 2637.97,
    priceChange24h: 0.88,
    marketCap: 318631426613,
    volume: 16629459588
  },
  {
    id: '6',
    rank: 6,
    symbol: 'VFIAX',
    name: 'Vanguard 500 Index Fund',
    type: 'fund',
    price: 567.88,
    priceChange24h: 0.47,
    marketCap: 528458000000,
    volume: 10000000000 // Approximate volume
  },
  {
    id: '7',
    rank: 7,
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    type: 'stock',
    price: 205.71,
    priceChange24h: -0.42,
    marketCap: 2180000000000,
    volume: 35000000000 // Approximate volume
  },
  {
    id: '8',
    rank: 8,
    symbol: 'SOL',
    name: 'Solana',
    type: 'crypto',
    price: 156.71,
    priceChange24h: -3.08,
    marketCap: 81855981051,
    volume: 3255820339
  },
  {
    id: '9',
    rank: 9,
    symbol: 'FXAIX',
    name: 'Fidelity 500 Index Fund',
    type: 'fund',
    price: 171.23,
    priceChange24h: 0.38,
    marketCap: 368000000000,
    volume: 8200000000
  },
  {
    id: '10',
    rank: 10,
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    type: 'stock',
    price: 344.27,
    priceChange24h: 0.45,
    marketCap: 562000000000,
    volume: 37500000000
  }
];
