import { IFinancialStats, IApiKey, ISystemLog } from '../types';

export const mockFinancialStats: IFinancialStats = {
  totalVolume24h: 284501200,
  totalFeeRevenue: 426751.8,
  platformReservesUSDT: 154800000.0,
  userTotalDepositsUSDT: 142300000.0,
  serverAndSecurityCost: 85000.0,
  netProfitUSDT: 341751.8,
  totalTradesCount: 145820
};

export const mockApiKeys: IApiKey[] = [
  {
    id: 'key_1',
    userId: 'user_trader',
    name: 'Grid Trading Bot (Python / CCXT)',
    keyMasked: 'cp_live_9a8b...1f2e',
    permissions: ['read', 'trade'],
    rateLimit: 1200,
    status: 'active',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'key_2',
    userId: 'user_trader',
    name: 'Market Data Streamer',
    keyMasked: 'cp_live_4d5e...9c8b',
    permissions: ['read'],
    rateLimit: 600,
    status: 'active',
    createdAt: '2024-02-01T00:00:00Z'
  }
];

export const mockSystemLogs: ISystemLog[] = [
  { id: 'log_1', level: 'info', module: 'MatchingEngine', message: 'OrderBook BTC/USDT matched 4,500 trades/sec with 0.4ms latency', ip: '10.0.1.5', timestamp: '2024-02-22T14:30:00Z' },
  { id: 'log_2', level: 'warn', module: 'RiskControl', message: 'High frequency withdrawal detected on ETH network from IP 114.79.2.1', ip: '114.79.2.1', timestamp: '2024-02-22T14:20:00Z' },
  { id: 'log_3', level: 'info', module: 'DepositWorker', message: 'TRC-20 Node synced block #58429183 successfully', ip: '10.0.3.12', timestamp: '2024-02-22T14:00:00Z' }
];

export const mockNotifications: any[] = [
  {
    id: 'notif_1',
    title: 'Niêm yết cặp giao dịch mới: SOL/USDT',
    message: 'Crypto Planet chính thức mở nạp rút và giao dịch giao ngay (Spot) cặp SOL/USDT từ 10:00 UTC.',
    createdAt: '2024-02-22T08:00:00Z'
  },
  {
    id: 'notif_2',
    title: 'Chính sách giảm phí giao dịch VIP 2024',
    message: 'Giảm thêm 20% phí giao dịch khi nắm giữ từ 500 PLANET token trong ví.',
    createdAt: '2024-02-20T10:00:00Z'
  }
];

export class AdminModel {
  static getFinancialStats(): IFinancialStats {
    return mockFinancialStats;
  }

  static getApiKeys(userId?: string): IApiKey[] {
    if (!userId) return mockApiKeys;
    return mockApiKeys.filter(k => k.userId === userId);
  }

  static createApiKey(data: Partial<IApiKey>): IApiKey {
    const key: IApiKey = {
      id: `key_${Date.now()}`,
      userId: data.userId || 'user_trader',
      name: data.name || 'Bot Key',
      keyMasked: `cp_live_${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
      permissions: data.permissions || ['read', 'trade'],
      rateLimit: data.rateLimit || 600,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    mockApiKeys.unshift(key);
    return key;
  }

  static revokeApiKey(id: string): boolean {
    const idx = mockApiKeys.findIndex(k => k.id === id);
    if (idx !== -1) {
      mockApiKeys[idx].status = 'revoked';
      return true;
    }
    return false;
  }

  static getSystemLogs(): ISystemLog[] {
    return mockSystemLogs;
  }

  static getNotifications() {
    return mockNotifications;
  }

  static broadcastNotification(title: string, message: string) {
    const notif = {
      id: `notif_${Date.now()}`,
      title,
      message,
      createdAt: new Date().toISOString()
    };
    mockNotifications.unshift(notif);
    return notif;
  }
}
