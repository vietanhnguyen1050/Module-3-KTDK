import { Request, Response } from 'express';
import { MarketModel } from '../models/market.model';

export class MarketController {
  // VWR-VEW01: Xem thông tin thị trường (Coin lists, Top Gainers/Losers)
  static async getCoins(req: Request, res: Response) {
    try {
      const coins = MarketModel.getCoins();
      return res.status(200).json({ success: true, count: coins.length, data: coins });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // Danh sách các cặp giao dịch (Trading Pairs: BTC/USDT, ETH/USDT...)
  static async getPairs(req: Request, res: Response) {
    try {
      const pairs = MarketModel.getPairs();
      return res.status(200).json({ success: true, count: pairs.length, data: pairs });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getPairDetail(req: Request, res: Response) {
    try {
      const symbol = req.params.symbol.replace('-', '/');
      const pair = MarketModel.getPairBySymbol(symbol);
      if (!pair) return res.status(404).json({ success: false, message: 'Cặp giao dịch không tồn tại.' });
      return res.status(200).json({ success: true, data: pair });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // Sổ lệnh (Order Book) thời gian thực
  static async getOrderBook(req: Request, res: Response) {
    try {
      const symbol = (req.query.symbol as string || 'BTC/USDT').replace('-', '/');
      const orderBook = MarketModel.getOrderBook(symbol);
      return res.status(200).json({ success: true, data: orderBook });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // TRD-CHRT01 / VWR-CHRT01: Biểu đồ nến Candlestick phân tích kỹ thuật
  static async getCandlestickData(req: Request, res: Response) {
    try {
      const symbol = (req.query.symbol as string || 'BTC/USDT').replace('-', '/');
      const candles = MarketModel.getCandles(symbol);
      return res.status(200).json({ success: true, data: candles });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // Lịch sử khớp lệnh gần nhất của thị trường
  static async getRecentTrades(req: Request, res: Response) {
    try {
      const symbol = (req.query.symbol as string || 'BTC/USDT').replace('-', '/');
      const trades = MarketModel.getRecentTrades(symbol);
      return res.status(200).json({ success: true, data: trades });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
