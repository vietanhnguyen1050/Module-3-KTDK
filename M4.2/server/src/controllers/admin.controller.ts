import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserModel } from '../models/user.model';
import { MarketModel } from '../models/market.model';
import { TradingModel } from '../models/trading.model';
import { WalletModel } from '../models/wallet.model';
import { AdminModel } from '../models/admin.model';

export class AdminController {
  // AD-ADM05 & AD-ADM10: Báo cáo tổng quan hoạt động sàn & Tài chính
  static async getOverview(req: AuthRequest, res: Response) {
    try {
      const users = await UserModel.findAll();
      const orders = TradingModel.getOrders();
      const pairs = MarketModel.getPairs();
      const financials = AdminModel.getFinancialStats();

      return res.status(200).json({
        success: true,
        data: {
          totalUsers: users.length,
          activeTraders: users.filter(u => u.role === 'trader').length,
          totalPairs: pairs.length,
          totalOrdersCount: orders.length,
          financials,
          recentOrders: orders.slice(0, 5),
          recentUsers: users.slice(-5).reverse()
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-ADM01: Quản lý người dùng
  static async getUsers(req: AuthRequest, res: Response) {
    try {
      const users = await UserModel.findAll();
      return res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createUser(req: AuthRequest, res: Response) {
    try {
      const user = await UserModel.create(req.body);
      return res.status(201).json({ success: true, message: 'Thêm tài khoản mới thành công!', data: user });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserModel.update(id, req.body);
      return res.status(200).json({ success: true, message: 'Cập nhật tài khoản thành công!', data: user });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      await UserModel.delete(id);
      return res.status(200).json({ success: true, message: 'Xóa tài khoản thành công!' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-ADM02: Quản lý & kiểm duyệt toàn bộ giao dịch
  static async getAllOrders(req: AuthRequest, res: Response) {
    try {
      const orders = TradingModel.getOrders();
      return res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-ADM03: Quản lý tài sản lưu ký sàn (Reserves)
  static async getAssetReserves(req: AuthRequest, res: Response) {
    try {
      const coins = MarketModel.getCoins();
      const reserves = coins.map(c => ({
        symbol: c.symbol,
        name: c.name,
        icon: c.icon,
        totalReserveAmount: c.symbol === 'USDT' ? 154800000.0 : c.symbol === 'BTC' ? 4500.0 : 38000.0,
        currentPrice: c.currentPrice,
        totalValueUSDT: +(c.symbol === 'USDT' ? 154800000.0 : (c.symbol === 'BTC' ? 4500.0 : 38000.0) * c.currentPrice).toFixed(2),
        coldWalletRatio: '95%',
        hotWalletRatio: '5%'
      }));

      return res.status(200).json({ success: true, data: reserves });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-ADM04: Quản lý cặp giao dịch (Trading Pairs)
  static async createPair(req: AuthRequest, res: Response) {
    try {
      const pair = MarketModel.createPair(req.body);
      return res.status(201).json({ success: true, message: 'Thêm cặp giao dịch mới thành công!', data: pair });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updatePair(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const pair = MarketModel.updatePair(id, req.body);
      return res.status(200).json({ success: true, message: 'Cập nhật cặp giao dịch thành công!', data: pair });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deletePair(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      MarketModel.deletePair(id);
      return res.status(200).json({ success: true, message: 'Hủy niêm yết cặp giao dịch thành công!' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-ADM06: Quản lý thông báo
  static async getNotifications(req: AuthRequest, res: Response) {
    try {
      const list = AdminModel.getNotifications();
      return res.status(200).json({ success: true, data: list });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async broadcastNotification(req: AuthRequest, res: Response) {
    try {
      const { title, message } = req.body;
      const notif = AdminModel.broadcastNotification(title, message);
      return res.status(201).json({ success: true, message: 'Phát thông báo toàn sàn thành công!', data: notif });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-ADM08: Quản lý bảo mật & Logs
  static async getSystemLogs(req: AuthRequest, res: Response) {
    try {
      const logs = AdminModel.getSystemLogs();
      return res.status(200).json({ success: true, data: logs });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-ADM09: Quản lý API Keys
  static async getApiKeys(req: AuthRequest, res: Response) {
    try {
      const keys = AdminModel.getApiKeys();
      return res.status(200).json({ success: true, data: keys });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createApiKey(req: AuthRequest, res: Response) {
    try {
      const key = AdminModel.createApiKey(req.body);
      return res.status(201).json({ success: true, message: 'Cấp API Key mới thành công!', data: key });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async revokeApiKey(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      AdminModel.revokeApiKey(id);
      return res.status(200).json({ success: true, message: 'Thu hồi API Key thành công!' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
