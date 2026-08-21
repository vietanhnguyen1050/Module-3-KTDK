import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserModel } from '../models/user.model';
import { DashboardModel } from '../models/dashboard.model';
import { DataSourceModel, SupportModel } from '../models/datasource.model';
import { AdminDataModel } from '../models/admin.models';

export class AdminController {
  // AD-ADM07: Báo cáo tổng quan hoạt động hệ thống
  static async getOverview(req: AuthRequest, res: Response) {
    try {
      const users = await UserModel.findAll();
      const dashboards = await DashboardModel.findAll();
      const dataSources = await DataSourceModel.findAll();
      const tickets = await SupportModel.findAll();
      const payments = AdminDataModel.getPaymentAccounts();

      const totalProcessed = payments.reduce((sum, p) => sum + p.totalProcessed, 0);

      return res.status(200).json({
        success: true,
        data: {
          totalUsers: users.length,
          activeUsers: users.filter(u => u.status === 'active').length,
          totalDashboards: dashboards.length,
          totalDataSources: dataSources.length,
          openTickets: tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length,
          totalProcessed,
          recentUsers: users.slice(-5).reverse(),
          recentDashboards: dashboards.slice(-5).reverse()
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-ADM01 & AD-ADM02: Quản lý người dùng & phân quyền truy cập
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
      return res.status(201).json({ success: true, message: 'Thêm người dùng mới thành công!', data: user });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserModel.update(id, req.body);
      return res.status(200).json({ success: true, message: 'Cập nhật thông tin người dùng thành công!', data: user });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      await UserModel.delete(id);
      return res.status(200).json({ success: true, message: 'Xóa người dùng thành công!' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-ADM04: Quản lý tất cả Dashboard trên hệ thống
  static async getAllDashboards(req: AuthRequest, res: Response) {
    try {
      const dashboards = await DashboardModel.findAll();
      return res.status(200).json({ success: true, count: dashboards.length, data: dashboards });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-ADM05: Quản lý thông báo
  static async getNotifications(req: AuthRequest, res: Response) {
    try {
      const list = AdminDataModel.getNotifications();
      return res.status(200).json({ success: true, data: list });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async broadcastNotification(req: AuthRequest, res: Response) {
    try {
      const { title, message, target } = req.body;
      const item = AdminDataModel.broadcastNotification(title, message, target);
      return res.status(201).json({ success: true, message: 'Gửi thông báo toàn hệ thống thành công!', data: item });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-ADM08: Quản lý bảo mật
  static async getSecuritySettings(req: AuthRequest, res: Response) {
    try {
      return res.status(200).json({
        success: true,
        data: {
          twoFactorAuth: true,
          passwordMinLength: 8,
          sessionTimeoutMinutes: 60,
          ipWhitelist: ['113.190.234.12', '14.232.18.99', '127.0.0.1'],
          failedLoginLockout: 5,
          sslEnforced: true
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateSecuritySettings(req: AuthRequest, res: Response) {
    try {
      return res.status(200).json({
        success: true,
        message: 'Cập nhật cấu hình bảo mật hệ thống thành công!',
        data: req.body
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-ADM09: Quản lý API
  static async getAllApiKeys(req: AuthRequest, res: Response) {
    try {
      const keys = AdminDataModel.getApiKeys();
      return res.status(200).json({ success: true, data: keys });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async revokeApiKey(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const key = AdminDataModel.revokeApiKey(id);
      return res.status(200).json({ success: true, message: 'Thu hồi API Key thành công!', data: key });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-ADM10: Quản lý nhật ký hệ thống (System Logs)
  static async getSystemLogs(req: AuthRequest, res: Response) {
    try {
      const logs = AdminDataModel.getSystemLogs();
      return res.status(200).json({ success: true, data: logs });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-ADM14: Quản lý log sự kiện (Event Logs)
  static async getEventLogs(req: AuthRequest, res: Response) {
    try {
      const logs = AdminDataModel.getEventLogs();
      return res.status(200).json({ success: true, data: logs });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-ADM11: Quản lý tài khoản thanh toán
  static async getPaymentAccounts(req: AuthRequest, res: Response) {
    try {
      const accounts = AdminDataModel.getPaymentAccounts();
      return res.status(200).json({ success: true, data: accounts });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updatePaymentAccount(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const account = AdminDataModel.updatePaymentAccount(id, req.body);
      return res.status(200).json({ success: true, message: 'Cập nhật cổng thanh toán thành công!', data: account });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-ADM12: Quản lý gói dịch vụ
  static async getServicePackages(req: AuthRequest, res: Response) {
    try {
      const packages = AdminDataModel.getServicePackages();
      return res.status(200).json({ success: true, data: packages });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateServicePackage(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const pkg = AdminDataModel.updatePackage(id, req.body);
      return res.status(200).json({ success: true, message: 'Cập nhật gói dịch vụ thành công!', data: pkg });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-ADM13: Quản lý đăng nhập & Active Sessions
  static async getActiveSessions(req: AuthRequest, res: Response) {
    try {
      const sessions = AdminDataModel.getActiveSessions();
      return res.status(200).json({ success: true, data: sessions });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async terminateSession(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      AdminDataModel.terminateSession(id);
      return res.status(200).json({ success: true, message: 'Buộc ngắt phiên đăng nhập thành công!' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-ADM15: Quản lý backup dữ liệu
  static async getBackups(req: AuthRequest, res: Response) {
    try {
      const backups = AdminDataModel.getBackups();
      return res.status(200).json({ success: true, data: backups });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createBackup(req: AuthRequest, res: Response) {
    try {
      const { type } = req.body;
      const backup = AdminDataModel.createBackup(type);
      return res.status(201).json({ success: true, message: 'Tạo bản sao lưu dữ liệu mới thành công!', data: backup });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
