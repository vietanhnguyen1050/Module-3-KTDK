import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { WalletModel } from '../models/wallet.model';

export class WalletController {
  // TRD-ASST01: Quản lý tài sản (Số dư ví Crypto)
  static async getBalances(req: AuthRequest, res: Response) {
    try {
      const balances = await WalletModel.getBalances(req.user!.id);
      const totalPortfolioUSDT = balances.reduce((sum, b) => sum + b.valueInUSDT, 0);

      return res.status(200).json({
        success: true,
        data: {
          totalPortfolioUSDT: +totalPortfolioUSDT.toFixed(2),
          balances
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // TRD-FIN01: Nạp tiền (Deposit)
  static async deposit(req: AuthRequest, res: Response) {
    try {
      const { coinSymbol, amount, network } = req.body;
      if (!coinSymbol || !amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Số lượng nạp không hợp lệ.' });
      }

      const tx = await WalletModel.deposit(req.user!.id, req.user!.name, coinSymbol, amount, network || 'Native');
      return res.status(200).json({
        success: true,
        message: `Nạp thành công ${amount} ${coinSymbol} vào ví cá nhân!`,
        data: tx
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // TRD-FIN01: Rút tiền (Withdraw)
  static async withdraw(req: AuthRequest, res: Response) {
    try {
      const { coinSymbol, amount, network, address } = req.body;
      if (!coinSymbol || !amount || amount <= 0 || !address) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin rút tiền và địa chỉ ví nhận.' });
      }

      const tx = await WalletModel.withdraw(req.user!.id, req.user!.name, coinSymbol, amount, network || 'Native', address);
      return res.status(200).json({
        success: true,
        message: `Lệnh rút ${amount} ${coinSymbol} đã được gửi đến Blockchain!`,
        data: tx
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // Lịch sử nạp rút và dòng tiền
  static async getTransactions(req: AuthRequest, res: Response) {
    try {
      const transactions = WalletModel.getTransactions(req.user!.id);
      return res.status(200).json({ success: true, count: transactions.length, data: transactions });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
