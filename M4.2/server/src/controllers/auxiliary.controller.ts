import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AlertModel, PromotionModel, SupportModel } from '../models/alert.model';

export class AlertController {
  // TRD-ALRT01 / VWR-ALRT01: Quản lý cảnh báo giá
  static async getAlerts(req: AuthRequest, res: Response) {
    try {
      const alerts = AlertModel.getAlerts(req.user?.id);
      return res.status(200).json({ success: true, count: alerts.length, data: alerts });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createAlert(req: AuthRequest, res: Response) {
    try {
      const { symbol, targetPrice, condition } = req.body;
      if (!symbol || !targetPrice) {
        return res.status(400).json({ success: false, message: 'Dữ liệu cảnh báo giá không hợp lệ.' });
      }

      const alert = AlertModel.createAlert({
        userId: req.user!.id,
        symbol,
        targetPrice,
        condition
      });

      return res.status(201).json({
        success: true,
        message: `Đã thiết lập cảnh báo giá cho ${symbol} (${condition} $${targetPrice})!`,
        data: alert
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteAlert(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      AlertModel.deleteAlert(id);
      return res.status(200).json({ success: true, message: 'Đã xóa cảnh báo giá.' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export class PromotionController {
  // TRD-PRM01 / AD-ADM12: Quản lý và xem khuyến mãi
  static async getPromotions(req: AuthRequest, res: Response) {
    try {
      const list = PromotionModel.getPromotions();
      return res.status(200).json({ success: true, count: list.length, data: list });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async create(req: AuthRequest, res: Response) {
    try {
      const promo = PromotionModel.create(req.body);
      return res.status(201).json({ success: true, message: 'Tạo chương trình khuyến mãi thành công!', data: promo });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const promo = PromotionModel.update(id, req.body);
      return res.status(200).json({ success: true, message: 'Cập nhật khuyến mãi thành công!', data: promo });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      PromotionModel.delete(id);
      return res.status(200).json({ success: true, message: 'Xóa khuyến mãi thành công!' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export class SupportController {
  // TRD-SPT01 / VWR-SPT01 / AD-ADM07: Quản lý hỗ trợ kỹ thuật
  static async getTickets(req: AuthRequest, res: Response) {
    try {
      const list = SupportModel.getTickets(req.user?.role === 'admin' ? undefined : req.user?.id);
      return res.status(200).json({ success: true, count: list.length, data: list });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createTicket(req: AuthRequest, res: Response) {
    try {
      const { category, subject, description, priority } = req.body;
      if (!subject || !description) {
        return res.status(400).json({ success: false, message: 'Vui lòng điền tiêu đề và nội dung cần hỗ trợ.' });
      }

      const ticket = SupportModel.create({
        userId: req.user!.id,
        userName: req.user!.name,
        userEmail: req.user!.email,
        category,
        subject,
        description,
        priority
      });

      return res.status(201).json({
        success: true,
        message: 'Gửi yêu cầu hỗ trợ thành công! Đội ngũ support sẽ phản hồi sớm nhất.',
        data: ticket
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async replyTicket(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { response, status } = req.body;
      const ticket = SupportModel.update(id, { response, status: status || 'resolved' });
      return res.status(200).json({ success: true, message: 'Đã phản hồi phiếu hỗ trợ!', data: ticket });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
