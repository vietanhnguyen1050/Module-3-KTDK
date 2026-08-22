export type UserRole = 'admin' | 'trader' | 'viewer';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'blocked';
  twoFactorEnabled: boolean;
  vipLevel: number;
  createdAt: string;
}

export interface ICoin {
  symbol: string;
  name: string;
  icon: string;
  currentPrice: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
}

export interface ITradingPair {
  id: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  lastPrice: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  minTradeAmount: number;
  makerFee: number;
  takerFee: number;
  status: 'active' | 'maintenance' | 'delisted';
}

export interface IOrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface IOrder {
  id: string;
  userId: string;
  userName: string;
  symbol: string;
  type: 'limit' | 'market';
  side: 'buy' | 'sell';
  price: number;
  amount: number;
  filledAmount: number;
  totalValue: number;
  status: 'pending' | 'completed' | 'cancelled';
  fee: number;
  createdAt: string;
}

export interface ITrade {
  id: string;
  symbol: string;
  price: number;
  amount: number;
  side: 'buy' | 'sell';
  timestamp: string;
}

export interface ICandle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IWalletBalance {
  coinSymbol: string;
  name: string;
  icon: string;
  available: number;
  locked: number;
  priceInUSDT: number;
  valueInUSDT: number;
}

export interface ITransaction {
  id: string;
  userId: string;
  userName: string;
  type: 'deposit' | 'withdraw' | 'trade_buy' | 'trade_sell' | 'swap';
  coinSymbol: string;
  amount: number;
  fee: number;
  network?: string;
  address?: string;
  txHash?: string;
  status: 'completed' | 'pending' | 'rejected';
  createdAt: string;
}

export interface IPriceAlert {
  id: string;
  userId: string;
  symbol: string;
  targetPrice: number;
  condition: '>=' | '<=';
  currentPrice: number;
  status: 'active' | 'triggered';
  createdAt: string;
  triggeredAt?: string;
}

export interface IPromotion {
  id: string;
  title: string;
  description: string;
  rewardText: string;
  code: string;
  type: 'airdrop' | 'fee_discount' | 'deposit_bonus';
  bannerUrl: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired';
}

export interface ISupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: 'deposit_withdraw' | 'trading' | 'account_security' | 'other';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  response?: string;
  createdAt: string;
}

export interface IFinancialStats {
  totalVolume24h: number;
  totalFeeRevenue: number;
  platformReservesUSDT: number;
  userTotalDepositsUSDT: number;
  serverAndSecurityCost: number;
  netProfitUSDT: number;
  totalTradesCount: number;
}

export interface IApiKey {
  id: string;
  userId: string;
  name: string;
  keyMasked: string;
  permissions: ('read' | 'trade' | 'withdraw')[];
  rateLimit: number;
  status: 'active' | 'revoked';
  createdAt: string;
}

export interface ISystemLog {
  id: string;
  level: 'info' | 'warn' | 'error';
  module: string;
  message: string;
  ip: string;
  timestamp: string;
}
