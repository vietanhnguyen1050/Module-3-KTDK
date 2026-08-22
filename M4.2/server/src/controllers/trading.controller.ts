import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { TradingModel } from '../models/trading.model';

export class TradingController {
  // TRD-TRD01 & TRD-TRD02: Đặt lệnh Mua / Bán
  static async placeOrder(req: AuthRequest, res: Response) {
    try {
      const { symbol, type, side, price, amount } = req.body;
      if (!symbol || !type || !side || !amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Dữ liệu đặt lệnh không hợp lệ.' });
      }

      const result = await TradingModel.placeOrder({
        userId: req.user!.id,
        userName: req.user!.name,
        symbol,
        type,
        side,
        price,
        amount
      });

      if (!result.success) {
        return res.status(400).json({ success: false, message: result.message });
      }

      return res.status(201).json({
        success: true,
        message: result.order?.status === 'completed'
          ? `Lệnh ${side === 'buy' ? 'Mua' : 'Bán'} ${amount} ${symbol.split('/')[0]} đã khớp tức thì!`
          : `Đặt lệnh ${side === 'buy' ? 'Mua' : 'Bán'} giới hạn thành công!`,
        data: result.order
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // TRD-TRD03: Trao đổi / Swap tiền điện tử
  static async swapCrypto(req: AuthRequest, res: Response) {
    try {
      const { fromSymbol, toSymbol, amount } = req.body;
      if (!fromSymbol || !toSymbol || !amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Thông tin swap không hợp lệ.' });
      }

      const result = await TradingModel.swapCrypto(req.user!.id, fromSymbol, toSymbol, amount);
      if (!result.success) {
        return res.status(400).json({ success: false, message: result.message });
      }

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // TRD-TRD04: Hủy lệnh đang chờ khớp
  static async cancelOrder(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const ok = await TradingModel.cancelOrder(id, req.user!.id);
      if (!ok) {
        return res.status(400).json({ success: false, message: 'Lệnh không tồn tại hoặc đã được khớp/hủy.' });
      }
      return res.status(200).json({ success: true, message: 'Hủy lệnh giao dịch thành công. Đã hoàn trả số dư đóng băng.' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // TRD-TRD05: Xem lịch sử giao dịch của cá nhân
  static async getMyOrders(req: AuthRequest, res: Response) {
    try {
      const orders = TradingModel.getOrders(req.user!.id);
      return res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
