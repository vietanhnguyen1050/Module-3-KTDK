import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { DataSourceModel, AlertModel, ReportModel, SupportModel } from '../models/datasource.model';

export class DataSourceController {
  // USR-DBD03 / USR-DBD11 / AD-ADM03: Quản lý nguồn dữ liệu
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const list = await DataSourceModel.findAll(req.user?.role === 'admin' ? undefined : req.user?.id);
      return res.status(200).json({ success: true, count: list.length, data: list });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async create(req: AuthRequest, res: Response) {
    try {
      const item = await DataSourceModel.create({ ...req.body, userId: req.user!.id });
      return res.status(201).json({ success: true, message: 'Kết nối nguồn dữ liệu thành công!', data: item });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const item = await DataSourceModel.update(id, req.body);
      return res.status(200).json({ success: true, message: 'Cập nhật nguồn dữ liệu thành công!', data: item });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      await DataSourceModel.delete(id);
      return res.status(200).json({ success: true, message: 'Ngắt kết nối nguồn dữ liệu thành công!' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export class AlertController {
  // USR-ALRT01: Cài đặt cảnh báo
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const list = await AlertModel.findAll(req.user?.role === 'admin' ? undefined : req.user?.id);
      return res.status(200).json({ success: true, data: list });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async create(req: AuthRequest, res: Response) {
    try {
      const item = await AlertModel.create({ ...req.body, userId: req.user!.id });
      return res.status(201).json({ success: true, message: 'Thiết lập cảnh báo thành công!', data: item });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const item = await AlertModel.update(id, req.body);
      return res.status(200).json({ success: true, message: 'Cập nhật cảnh báo thành công!', data: item });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      await AlertModel.delete(id);
      return res.status(200).json({ success: true, message: 'Xóa cảnh báo thành công!' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export class ReportController {
  // USR-DBD04 / USR-DBD10: Tạo và xem báo cáo tự động
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const list = await ReportModel.findAll(req.user?.role === 'admin' ? undefined : req.user?.id);
      return res.status(200).json({ success: true, data: list });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async create(req: AuthRequest, res: Response) {
    try {
      const item = await ReportModel.create({ ...req.body, userId: req.user!.id });
      return res.status(201).json({ success: true, message: 'Lên lịch báo cáo tự động thành công!', data: item });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      await ReportModel.delete(id);
      return res.status(200).json({ success: true, message: 'Xóa lịch báo cáo thành công!' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export class SupportController {
  // USR-SPT01 / AD-ADM06: Quản lý và gửi yêu cầu hỗ trợ
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const list = await SupportModel.findAll(req.user?.role === 'admin' ? undefined : req.user?.id);
      return res.status(200).json({ success: true, data: list });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async create(req: AuthRequest, res: Response) {
    try {
      const item = await SupportModel.create({
        ...req.body,
        userId: req.user!.id,
        userName: req.user!.name,
        userEmail: req.user!.email
      });
      return res.status(201).json({ success: true, message: 'Gửi yêu cầu hỗ trợ thành công!', data: item });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const item = await SupportModel.update(id, req.body);
      return res.status(200).json({ success: true, message: 'Cập nhật ticket hỗ trợ thành công!', data: item });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
