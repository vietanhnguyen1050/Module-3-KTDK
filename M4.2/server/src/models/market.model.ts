import { ICoin, ITradingPair, IOrderBookEntry, ITrade, ICandle } from '../types';

export const mockCoins: ICoin[] = [
  { symbol: 'BTC', name: 'Bitcoin', icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png', currentPrice: 67450.0, change24h: 3.42, high24h: 68200.0, low24h: 65100.0, volume24h: 28450120000, marketCap: 1325000000000 },
  { symbol: 'ETH', name: 'Ethereum', icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', currentPrice: 3520.5, change24h: -1.15, high24h: 3610.0, low24h: 3480.0, volume24h: 14200500000, marketCap: 423000000000 },
  { symbol: 'SOL', name: 'Solana', icon: 'https://assets.coingecko.com/coins/images/4128/small/solana.png', currentPrice: 184.2, change24h: 8.75, high24h: 188.5, low24h: 168.0, volume24h: 5600000000, marketCap: 85000000000 },
  { symbol: 'BNB', name: 'BNB', icon: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png', currentPrice: 590.0, change24h: 2.10, high24h: 598.0, low24h: 575.0, volume24h: 1800000000, marketCap: 91000000000 },
  { symbol: 'XRP', name: 'XRP', icon: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png', currentPrice: 0.62, change24h: -0.45, high24h: 0.64, low24h: 0.61, volume24h: 950000000, marketCap: 34000000000 },
  { symbol: 'USDT', name: 'Tether USD', icon: 'https://assets.coingecko.com/coins/images/325/small/Tether.png', currentPrice: 1.0, change24h: 0.01, high24h: 1.002, low24h: 0.998, volume24h: 65000000000, marketCap: 115000000000 }
];

export const mockPairs: ITradingPair[] = [
  { id: 'pair_btc_usdt', symbol: 'BTC/USDT', baseAsset: 'BTC', quoteAsset: 'USDT', lastPrice: 67450.0, change24h: 3.42, high24h: 68200.0, low24h: 65100.0, volume24h: 125400000, minTradeAmount: 0.0001, makerFee: 0.001, takerFee: 0.0015, status: 'active' },
  { id: 'pair_eth_usdt', symbol: 'ETH/USDT', baseAsset: 'ETH', quoteAsset: 'USDT', lastPrice: 3520.5, change24h: -1.15, high24h: 3610.0, low24h: 3480.0, volume24h: 84200000, minTradeAmount: 0.001, makerFee: 0.001, takerFee: 0.0015, status: 'active' },
  { id: 'pair_sol_usdt', symbol: 'SOL/USDT', baseAsset: 'SOL', quoteAsset: 'USDT', lastPrice: 184.2, change24h: 8.75, high24h: 188.5, low24h: 168.0, volume24h: 42100000, minTradeAmount: 0.01, makerFee: 0.001, takerFee: 0.0015, status: 'active' },
  { id: 'pair_bnb_usdt', symbol: 'BNB/USDT', baseAsset: 'BNB', quoteAsset: 'USDT', lastPrice: 590.0, change24h: 2.10, high24h: 598.0, low24h: 575.0, volume24h: 18500000, minTradeAmount: 0.01, makerFee: 0.001, takerFee: 0.0015, status: 'active' },
  { id: 'pair_xrp_usdt', symbol: 'XRP/USDT', baseAsset: 'XRP', quoteAsset: 'USDT', lastPrice: 0.62, change24h: -0.45, high24h: 0.64, low24h: 0.61, volume24h: 9200000, minTradeAmount: 1.0, makerFee: 0.001, takerFee: 0.0015, status: 'active' }
];

export const mockTradesHistory: ITrade[] = [
  { id: 't_1', symbol: 'BTC/USDT', price: 67450.0, amount: 0.25, side: 'buy', timestamp: '2024-02-22T14:35:10Z' },
  { id: 't_2', symbol: 'BTC/USDT', price: 67448.5, amount: 0.82, side: 'sell', timestamp: '2024-02-22T14:35:05Z' },
  { id: 't_3', symbol: 'BTC/USDT', price: 67452.0, amount: 1.45, side: 'buy', timestamp: '2024-02-22T14:34:55Z' },
  { id: 't_4', symbol: 'BTC/USDT', price: 67440.0, amount: 0.12, side: 'sell', timestamp: '2024-02-22T14:34:40Z' },
  { id: 't_5', symbol: 'BTC/USDT', price: 67455.0, amount: 0.50, side: 'buy', timestamp: '2024-02-22T14:34:30Z' }
];

export class MarketModel {
  static getCoins(): ICoin[] {
    return mockCoins;
  }

  static getCoinBySymbol(symbol: string): ICoin | undefined {
    return mockCoins.find(c => c.symbol.toUpperCase() === symbol.toUpperCase());
  }

  static getPairs(): ITradingPair[] {
    return mockPairs;
  }

  static getPairBySymbol(symbol: string): ITradingPair | undefined {
    return mockPairs.find(p => p.symbol.toUpperCase() === symbol.toUpperCase().replace('-', '/'));
  }

  static createPair(pairData: Partial<ITradingPair>): ITradingPair {
    const newPair: ITradingPair = {
      id: `pair_${Date.now()}`,
      symbol: pairData.symbol || 'NEW/USDT',
      baseAsset: pairData.baseAsset || 'NEW',
      quoteAsset: pairData.quoteAsset || 'USDT',
      lastPrice: pairData.lastPrice || 1.0,
      change24h: 0,
      high24h: pairData.lastPrice || 1.0,
      low24h: pairData.lastPrice || 1.0,
      volume24h: 0,
      minTradeAmount: pairData.minTradeAmount || 0.01,
      makerFee: pairData.makerFee || 0.001,
      takerFee: pairData.takerFee || 0.0015,
      status: pairData.status || 'active'
    };
    mockPairs.push(newPair);
    return newPair;
  }

  static updatePair(id: string, data: Partial<ITradingPair>): ITradingPair | null {
    const idx = mockPairs.findIndex(p => p.id === id);
    if (idx === -1) return null;
    mockPairs[idx] = { ...mockPairs[idx], ...data };
    return mockPairs[idx];
  }

  static deletePair(id: string): boolean {
    const idx = mockPairs.findIndex(p => p.id === id);
    if (idx === -1) return false;
    mockPairs.splice(idx, 1);
    return true;
  }

  // Dynamic Order Book generator based on current price
  static getOrderBook(symbol: string) {
    const pair = this.getPairBySymbol(symbol) || mockPairs[0];
    const basePrice = pair.lastPrice;

    const asks: IOrderBookEntry[] = [];
    const bids: IOrderBookEntry[] = [];

    for (let i = 1; i <= 8; i++) {
      const askPrice = +(basePrice * (1 + (i * 0.0008))).toFixed(2);
      const askAmount = +(0.15 * i + Math.random() * 0.5).toFixed(4);
      asks.unshift({ price: askPrice, amount: askAmount, total: +(askPrice * askAmount).toFixed(2) });

      const bidPrice = +(basePrice * (1 - (i * 0.0008))).toFixed(2);
      const bidAmount = +(0.2 * i + Math.random() * 0.6).toFixed(4);
      bids.push({ price: bidPrice, amount: bidAmount, total: +(bidPrice * bidAmount).toFixed(2) });
    }

    return { asks, bids, currentPrice: basePrice };
  }

  // Candlestick historical generator for charts (TRD-CHRT01, VWR-CHRT01)
  static getCandles(symbol: string): ICandle[] {
    const pair = this.getPairBySymbol(symbol) || mockPairs[0];
    const basePrice = pair.lastPrice;
    const candles: ICandle[] = [];

    let current = basePrice * 0.92;
    const intervals = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'];

    intervals.forEach((time) => {
      const open = current;
      const variation = (Math.random() - 0.46) * (basePrice * 0.02);
      const close = +(open + variation).toFixed(2);
      const high = +(Math.max(open, close) + Math.random() * (basePrice * 0.01)).toFixed(2);
      const low = +(Math.min(open, close) - Math.random() * (basePrice * 0.01)).toFixed(2);
      const volume = +(10 + Math.random() * 50).toFixed(2);

      candles.push({ time, open, high, low, close, volume });
      current = close;
    });

    return candles;
  }

  static getRecentTrades(symbol: string): ITrade[] {
    return mockTradesHistory;
  }
}
