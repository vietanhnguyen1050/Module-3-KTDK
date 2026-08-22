import { IOrder, ITrade } from '../types';
import { MarketModel } from './market.model';
import { WalletModel } from './wallet.model';

export const mockOrders: IOrder[] = [
  {
    id: 'ord_1',
    userId: 'user_trader',
    userName: 'Nguyễn Văn Anh',
    symbol: 'BTC/USDT',
    type: 'limit',
    side: 'buy',
    price: 66500.0,
    amount: 0.5,
    filledAmount: 0,
    totalValue: 33250.0,
    status: 'pending',
    fee: 33.25,
    createdAt: '2024-02-22T10:15:00Z'
  },
  {
    id: 'ord_2',
    userId: 'user_trader',
    userName: 'Nguyễn Văn Anh',
    symbol: 'ETH/USDT',
    type: 'limit',
    side: 'sell',
    price: 3600.0,
    amount: 2.0,
    filledAmount: 2.0,
    totalValue: 7200.0,
    status: 'completed',
    fee: 7.2,
    createdAt: '2024-02-22T08:30:00Z'
  },
  {
    id: 'ord_3',
    userId: 'user_trader',
    userName: 'Nguyễn Văn Anh',
    symbol: 'SOL/USDT',
    type: 'market',
    side: 'buy',
    price: 184.2,
    amount: 10.0,
    filledAmount: 10.0,
    totalValue: 1842.0,
    status: 'completed',
    fee: 1.84,
    createdAt: '2024-02-21T16:45:00Z'
  }
];

export class TradingModel {
  static getOrders(userId?: string): IOrder[] {
    if (!userId) return mockOrders;
    return mockOrders.filter(o => o.userId === userId);
  }

  static getOrderById(id: string): IOrder | undefined {
    return mockOrders.find(o => o.id === id);
  }

  // TRD-TRD01 & TRD-TRD02: Đặt lệnh Mua / Bán
  static async placeOrder(orderData: {
    userId: string;
    userName: string;
    symbol: string;
    type: 'limit' | 'market';
    side: 'buy' | 'sell';
    price?: number;
    amount: number;
  }): Promise<{ success: boolean; order?: IOrder; message?: string }> {
    const pair = MarketModel.getPairBySymbol(orderData.symbol);
    if (!pair) return { success: false, message: 'Cặp giao dịch không tồn tại.' };

    const executionPrice = orderData.type === 'market' ? pair.lastPrice : (orderData.price || pair.lastPrice);
    const totalValue = +(executionPrice * orderData.amount).toFixed(2);
    const fee = +(totalValue * (orderData.type === 'limit' ? pair.makerFee : pair.takerFee)).toFixed(4);

    // Kiểm tra số dư ví
    const baseAsset = pair.baseAsset;
    const quoteAsset = pair.quoteAsset;

    if (orderData.side === 'buy') {
      const usdtBal = await WalletModel.getBalance(orderData.userId, quoteAsset);
      if (!usdtBal || usdtBal.available < totalValue) {
        return { success: false, message: `Số dư ${quoteAsset} không đủ (Cần: ${totalValue}, Có: ${usdtBal?.available || 0})` };
      }
    } else {
      const coinBal = await WalletModel.getBalance(orderData.userId, baseAsset);
      if (!coinBal || coinBal.available < orderData.amount) {
        return { success: false, message: `Số dư ${baseAsset} không đủ (Cần: ${orderData.amount}, Có: ${coinBal?.available || 0})` };
      }
    }

    const isInstantMatch = orderData.type === 'market';
    const newOrder: IOrder = {
      id: `ord_${Date.now()}`,
      userId: orderData.userId,
      userName: orderData.userName,
      symbol: orderData.symbol,
      type: orderData.type,
      side: orderData.side,
      price: executionPrice,
      amount: orderData.amount,
      filledAmount: isInstantMatch ? orderData.amount : 0,
      totalValue,
      status: isInstantMatch ? 'completed' : 'pending',
      fee,
      createdAt: new Date().toISOString()
    };

    mockOrders.unshift(newOrder);

    // Cập nhật số dư ví thực tế
    if (isInstantMatch) {
      if (orderData.side === 'buy') {
        await WalletModel.adjustBalance(orderData.userId, quoteAsset, -totalValue);
        await WalletModel.adjustBalance(orderData.userId, baseAsset, orderData.amount);
      } else {
        await WalletModel.adjustBalance(orderData.userId, baseAsset, -orderData.amount);
        await WalletModel.adjustBalance(orderData.userId, quoteAsset, totalValue);
      }
    } else {
      // Đóng băng số dư khi đặt lệnh limit
      if (orderData.side === 'buy') {
        await WalletModel.lockBalance(orderData.userId, quoteAsset, totalValue);
      } else {
        await WalletModel.lockBalance(orderData.userId, baseAsset, orderData.amount);
      }
    }

    return { success: true, order: newOrder };
  }

  // TRD-TRD04: Hủy giao dịch đang chờ khớp
  static async cancelOrder(id: string, userId: string): Promise<boolean> {
    const idx = mockOrders.findIndex(o => o.id === id && o.userId === userId && o.status === 'pending');
    if (idx === -1) return false;

    const order = mockOrders[idx];
    const pair = MarketModel.getPairBySymbol(order.symbol);
    if (pair) {
      if (order.side === 'buy') {
        await WalletModel.unlockBalance(userId, pair.quoteAsset, order.totalValue);
      } else {
        await WalletModel.unlockBalance(userId, pair.baseAsset, order.amount);
      }
    }

    mockOrders[idx].status = 'cancelled';
    return true;
  }

  // TRD-TRD03: Trao đổi / Swap tiền điện tử tức thì
  static async swapCrypto(userId: string, fromSymbol: string, toSymbol: string, amount: number) {
    const fromCoin = MarketModel.getCoinBySymbol(fromSymbol);
    const toCoin = MarketModel.getCoinBySymbol(toSymbol);
    if (!fromCoin || !toCoin) return { success: false, message: 'Đồng coin không hợp lệ.' };

    const fromBal = await WalletModel.getBalance(userId, fromSymbol);
    if (!fromBal || fromBal.available < amount) {
      return { success: false, message: `Số dư ${fromSymbol} không đủ để swap.` };
    }

    const valueUSD = amount * fromCoin.currentPrice;
    const receivedAmount = +(valueUSD / toCoin.currentPrice * 0.998).toFixed(6); // 0.2% swap fee

    await WalletModel.adjustBalance(userId, fromSymbol, -amount);
    await WalletModel.adjustBalance(userId, toSymbol, receivedAmount);

    return {
      success: true,
      message: `Swap thành công ${amount} ${fromSymbol} sang ${receivedAmount} ${toSymbol}!`,
      data: { fromSymbol, toSymbol, amount, receivedAmount, rate: +(fromCoin.currentPrice / toCoin.currentPrice).toFixed(6) }
    };
  }
}
