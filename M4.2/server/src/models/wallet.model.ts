import { IWalletBalance, ITransaction } from '../types';
import { MarketModel } from './market.model';

// Mock user balance stores
export const mockBalances: Record<string, Record<string, { available: number; locked: number }>> = {
  user_trader: {
    USDT: { available: 25480.0, locked: 33250.0 },
    BTC: { available: 1.85, locked: 0.0 },
    ETH: { available: 12.5, locked: 2.0 },
    SOL: { available: 45.0, locked: 0.0 },
    BNB: { available: 8.0, locked: 0.0 },
    XRP: { available: 2500.0, locked: 0.0 }
  },
  user_viewer: {
    USDT: { available: 100.0, locked: 0.0 },
    BTC: { available: 0.01, locked: 0.0 },
    ETH: { available: 0.0, locked: 0.0 },
    SOL: { available: 0.0, locked: 0.0 },
    BNB: { available: 0.0, locked: 0.0 },
    XRP: { available: 0.0, locked: 0.0 }
  }
};

export const mockTransactions: ITransaction[] = [
  {
    id: 'tx_1',
    userId: 'user_trader',
    userName: 'Nguyễn Văn Anh',
    type: 'deposit',
    coinSymbol: 'USDT',
    amount: 50000.0,
    fee: 0,
    network: 'TRC-20',
    address: 'TXyZaBcDeFgHiJkLmNoPqRsTuVwXyZ1234',
    txHash: '0x8f7a9b...1c2d3e',
    status: 'completed',
    createdAt: '2024-02-20T08:00:00Z'
  },
  {
    id: 'tx_2',
    userId: 'user_trader',
    userName: 'Nguyễn Văn Anh',
    type: 'withdraw',
    coinSymbol: 'ETH',
    amount: 2.5,
    fee: 0.005,
    network: 'ERC-20',
    address: '0x71C...8e9F',
    txHash: '0x3a4b...9e8f7c',
    status: 'completed',
    createdAt: '2024-02-21T14:30:00Z'
  }
];

export class WalletModel {
  static async getBalances(userId: string): Promise<IWalletBalance[]> {
    if (!mockBalances[userId]) {
      mockBalances[userId] = {
        USDT: { available: 10000.0, locked: 0 },
        BTC: { available: 0.5, locked: 0 },
        ETH: { available: 3.0, locked: 0 },
        SOL: { available: 15.0, locked: 0 },
        BNB: { available: 5.0, locked: 0 },
        XRP: { available: 1000.0, locked: 0 }
      };
    }

    const userBals = mockBalances[userId];
    const coins = MarketModel.getCoins();

    return Object.keys(userBals).map(symbol => {
      const coin = coins.find(c => c.symbol === symbol) || { name: symbol, icon: '', currentPrice: 1.0 };
      const available = userBals[symbol].available;
      const locked = userBals[symbol].locked;
      const priceInUSDT = coin.currentPrice;
      const valueInUSDT = +( (available + locked) * priceInUSDT ).toFixed(2);

      return {
        coinSymbol: symbol,
        name: coin.name,
        icon: coin.icon,
        available,
        locked,
        priceInUSDT,
        valueInUSDT
      };
    });
  }

  static async getBalance(userId: string, symbol: string) {
    const list = await this.getBalances(userId);
    return list.find(b => b.coinSymbol.toUpperCase() === symbol.toUpperCase());
  }

  static async adjustBalance(userId: string, symbol: string, delta: number) {
    if (!mockBalances[userId]) await this.getBalances(userId);
    if (!mockBalances[userId][symbol]) {
      mockBalances[userId][symbol] = { available: 0, locked: 0 };
    }
    mockBalances[userId][symbol].available = +(mockBalances[userId][symbol].available + delta).toFixed(6);
  }

  static async lockBalance(userId: string, symbol: string, amount: number) {
    if (!mockBalances[userId]) await this.getBalances(userId);
    mockBalances[userId][symbol].available = +(mockBalances[userId][symbol].available - amount).toFixed(6);
    mockBalances[userId][symbol].locked = +(mockBalances[userId][symbol].locked + amount).toFixed(6);
  }

  static async unlockBalance(userId: string, symbol: string, amount: number) {
    if (!mockBalances[userId]) await this.getBalances(userId);
    mockBalances[userId][symbol].available = +(mockBalances[userId][symbol].available + amount).toFixed(6);
    mockBalances[userId][symbol].locked = +(mockBalances[userId][symbol].locked - amount).toFixed(6);
  }

  // TRD-FIN01: Nạp tiền (Deposit)
  static async deposit(userId: string, userName: string, coinSymbol: string, amount: number, network: string) {
    await this.adjustBalance(userId, coinSymbol, amount);
    const tx: ITransaction = {
      id: `tx_${Date.now()}`,
      userId,
      userName,
      type: 'deposit',
      coinSymbol,
      amount,
      fee: 0,
      network,
      address: `0x${Math.random().toString(36).substring(2, 12)}...${Math.random().toString(36).substring(2, 6)}`,
      txHash: `0x${Math.random().toString(36).substring(2, 18)}`,
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    mockTransactions.unshift(tx);
    return tx;
  }

  // TRD-FIN01: Rút tiền (Withdraw)
  static async withdraw(userId: string, userName: string, coinSymbol: string, amount: number, network: string, address: string) {
    const bal = await this.getBalance(userId, coinSymbol);
    if (!bal || bal.available < amount) {
      throw new Error(`Số dư ${coinSymbol} khả dụng không đủ.`);
    }

    const fee = coinSymbol === 'USDT' ? 1.0 : coinSymbol === 'BTC' ? 0.0005 : 0.005;
    await this.adjustBalance(userId, coinSymbol, -amount);

    const tx: ITransaction = {
      id: `tx_${Date.now()}`,
      userId,
      userName,
      type: 'withdraw',
      coinSymbol,
      amount: amount - fee,
      fee,
      network,
      address,
      txHash: `0x${Math.random().toString(36).substring(2, 18)}`,
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    mockTransactions.unshift(tx);
    return tx;
  }

  static getTransactions(userId?: string): ITransaction[] {
    if (!userId) return mockTransactions;
    return mockTransactions.filter(t => t.userId === userId);
  }
}
