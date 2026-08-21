import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { DashboardModel } from '../models/dashboard.model';
import { WidgetModel } from '../models/widget.model';

export class DashboardController {
  // USR-DBD02: Xem danh sách bảng điều khiển
  static async getDashboards(req: AuthRequest, res: Response) {
    try {
      const dashboards = await DashboardModel.findAll(req.user?.id);
      return res.status(200).json({ success: true, count: dashboards.length, data: dashboards });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // Xem chi tiết bảng điều khiển kèm widgets (USR-DBD02, USR-DBD12)
  static async getDashboardById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const dashboard = await DashboardModel.findById(id);
      if (!dashboard) {
        return res.status(404).json({ success: false, message: 'Bảng điều khiển không tồn tại.' });
      }

      const widgets = await WidgetModel.findByDashboardId(id);
      return res.status(200).json({
        success: true,
        data: {
          ...dashboard,
          widgets
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // USR-DBD01: Tạo bảng điều khiển mới
  static async createDashboard(req: AuthRequest, res: Response) {
    try {
      const { title, description, category, layout, theme, isPublic } = req.body;
      if (!title) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập tên bảng điều khiển.' });
      }

      const newDb = await DashboardModel.create({
        userId: req.user!.id,
        userName: req.user!.name,
        title,
        description,
        category: category || 'General',
        layout: layout || 'grid',
        theme: theme || 'indigo',
        isPublic: isPublic || false
      });

      // Tạo sẵn 2 widget mẫu
      await WidgetModel.create({
        dashboardId: newDb.id,
        title: 'Doanh Số Bán Hàng',
        type: 'metric',
        config: {
          metricLabel: 'Doanh thu hôm nay',
          metricValue: '$12,450.00',
          metricChange: '+8.5% so với hôm qua',
          isPositive: true,
          color: '#10b981'
        },
        size: 'small',
        order: 1
      });

      await WidgetModel.create({
        dashboardId: newDb.id,
        title: 'Biểu Đồ Xu Hướng 7 Ngày',
        type: 'line',
        config: {
          chartLabels: ['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'],
          chartData: [1200, 1900, 3000, 5000, 4200, 6800, 7500],
          color: '#4f46e5'
        },
        size: 'large',
        order: 2
      });

      return res.status(201).json({
        success: true,
        message: 'Tạo bảng điều khiển mới thành công!',
        data: newDb
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // USR-DBD02 / USR-DBD07: Chỉnh sửa & tùy chỉnh giao diện/bố cục
  static async updateDashboard(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const updated = await DashboardModel.update(id, req.body, { id: req.user!.id, name: req.user!.name });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Bảng điều khiển không tồn tại.' });
      }

      return res.status(200).json({
        success: true,
        message: 'Cập nhật bảng điều khiển thành công!',
        data: updated
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // USR-DBD02: Xóa bảng điều khiển
  static async deleteDashboard(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      await DashboardModel.delete(id);
      return res.status(200).json({ success: true, message: 'Xóa bảng điều khiển thành công!' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // USR-DBD05 / USR-DBD13: Chia sẻ bảng điều khiển & Quản lý quyền truy cập
  static async shareDashboard(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { email, role, isPublic } = req.body;

      const dashboard = await DashboardModel.findById(id);
      if (!dashboard) return res.status(404).json({ success: false, message: 'Dashboard không tồn tại.' });

      let sharedWith = [...dashboard.sharedWith];
      if (email) {
        const existingIdx = sharedWith.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
        if (existingIdx !== -1) {
          sharedWith[existingIdx].role = role || 'viewer';
        } else {
          sharedWith.push({ email, role: role || 'viewer' });
        }
      }

      const updated = await DashboardModel.update(id, {
        isShared: true,
        isPublic: isPublic !== undefined ? isPublic : dashboard.isPublic,
        sharedWith
      }, { id: req.user!.id, name: req.user!.name });

      return res.status(200).json({
        success: true,
        message: `Đã chia sẻ bảng điều khiển với ${email || 'mọi người'}!`,
        data: updated
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // USR-DBD08: Xem lịch sử thay đổi
  static async getHistory(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const history = await DashboardModel.getHistory(id);
      return res.status(200).json({ success: true, data: history });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // USR-DBD06: CRUD Widgets
  static async createWidget(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const widget = await WidgetModel.create({ ...req.body, dashboardId: id });
      return res.status(201).json({ success: true, message: 'Thêm widget thành công!', data: widget });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateWidget(req: AuthRequest, res: Response) {
    try {
      const { widgetId } = req.params;
      const widget = await WidgetModel.update(widgetId, req.body);
      return res.status(200).json({ success: true, message: 'Cập nhật widget thành công!', data: widget });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteWidget(req: AuthRequest, res: Response) {
    try {
      const { widgetId } = req.params;
      await WidgetModel.delete(widgetId);
      return res.status(200).json({ success: true, message: 'Xóa widget thành công!' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // USR-DBD09: Xuất dữ liệu (JSON / CSV / PDF)
  static async exportData(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { format } = req.query; // 'json' | 'csv' | 'pdf'
      const dashboard = await DashboardModel.findById(id);
      const widgets = await WidgetModel.findByDashboardId(id);

      const exportPayload = {
        title: dashboard?.title,
        exportedAt: new Date().toISOString(),
        format: format || 'json',
        widgets: widgets.map(w => ({
          title: w.title,
          type: w.type,
          data: w.config
        }))
      };

      return res.status(200).json({
        success: true,
        message: `Xuất dữ liệu định dạng ${format || 'JSON'} thành công!`,
        downloadUrl: `https://mock-cdn.dashstack.io/exports/${id}.${format || 'json'}`,
        data: exportPayload
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
