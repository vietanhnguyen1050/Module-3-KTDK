import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserModel } from '../models/user.model';
import { CourseModel } from '../models/course.model';
import { LessonModel } from '../models/lesson.model';
import { ReviewModel } from '../models/review.model';
import { PaymentModel, NotificationModel } from '../models/other.models';

export class AdminController {
  // AD-NCC01 & AD-NCC02: Quản lý và duyệt NCC mới
  static async getProviders(req: AuthRequest, res: Response) {
    try {
      const allUsers = await UserModel.findAll();
      const providers = allUsers.filter(u => u.role === 'provider' || u.status === 'pending_approval' || u.providerInfo);
      return res.status(200).json({ success: true, data: providers });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async approveProvider(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status, action } = req.body; // status: 'approved' | 'rejected' | 'blocked' | 'active'

      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });
      }

      let updatedRole = user.role;
      let updatedStatus = user.status;

      if (action === 'approve') {
        updatedRole = 'provider';
        updatedStatus = 'active';
        if (user.providerInfo) {
          user.providerInfo.approvedAt = new Date().toISOString();
        }
      } else if (action === 'reject') {
        updatedStatus = 'active';
        updatedRole = 'customer';
      } else if (action === 'toggle_status') {
        updatedStatus = user.status === 'active' ? 'blocked' : 'active';
      }

      const updated = await UserModel.update(id, {
        role: updatedRole,
        status: updatedStatus,
        providerInfo: user.providerInfo
      });

      // Thông báo cho user
      await NotificationModel.create({
        targetUserId: id,
        title: action === 'approve' ? 'Yêu cầu đăng ký NCC đã được duyệt!' : 'Cập nhật tài khoản NCC',
        message: action === 'approve'
          ? 'Chúc mừng bạn đã chính thức trở thành Nhà Cung Cấp Khóa Học trên Edupress. Bạn có thể bắt đầu đăng tải khóa học ngay bây giờ.'
          : 'Quản trị viên đã cập nhật trạng thái tài khoản của bạn.',
        type: 'system'
      });

      return res.status(200).json({
        success: true,
        message: 'Cập nhật trạng thái NCC thành công!',
        data: updated
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-NCC03: Quản lý đánh giá NCC
  static async getNCCReviews(req: AuthRequest, res: Response) {
    try {
      const courses = await CourseModel.findAll();
      const allReviews: any[] = [];
      for (const c of courses) {
        const revs = await ReviewModel.findByCourseId(c.id);
        revs.forEach(r => allReviews.push({ ...r, courseTitle: c.title, providerName: c.providerName }));
      }
      return res.status(200).json({ success: true, data: allReviews });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-KH01 & AD-KH02: Quản lý và duyệt khóa học mới
  static async getCourses(req: AuthRequest, res: Response) {
    try {
      const courses = await CourseModel.findAll();
      return res.status(200).json({ success: true, data: courses });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async approveCourse(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body; // 'approved' | 'rejected' | 'disabled' | 'pending_approval'

      const course = await CourseModel.findById(id);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Khóa học không tồn tại.' });
      }

      const updated = await CourseModel.update(id, { status });

      // Thông báo cho NCC
      await NotificationModel.create({
        targetUserId: course.providerId,
        title: status === 'approved' ? 'Khóa học đã được duyệt công khai' : 'Cập nhật trạng thái khóa học',
        message: `Khóa học "${course.title}" đã được chuyển sang trạng thái: ${status}.`,
        type: 'course'
      });

      return res.status(200).json({
        success: true,
        message: `Đã cập nhật trạng thái khóa học sang ${status}!`,
        data: updated
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-KH03: Quản lý nội dung khóa học (kiểm tra bài giảng, video)
  static async getCourseContent(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const course = await CourseModel.findById(id);
      const lessons = await LessonModel.findByCourseId(id);
      return res.status(200).json({ success: true, data: { course, lessons } });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-CT01: Quản lý khách hàng
  static async getCustomers(req: AuthRequest, res: Response) {
    try {
      const users = await UserModel.findAll();
      const customers = users.filter(u => u.role === 'customer');
      return res.status(200).json({ success: true, data: customers });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async toggleCustomerStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Khách hàng không tồn tại.' });
      }

      const nextStatus = user.status === 'active' ? 'blocked' : 'active';
      const updated = await UserModel.update(id, { status: nextStatus });
      return res.status(200).json({ success: true, message: `Đã đổi trạng thái tài khoản sang ${nextStatus}!`, data: updated });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-CT02: Quản lý thanh toán từ khách hàng
  static async getPayments(req: AuthRequest, res: Response) {
    try {
      const payments = await PaymentModel.findAll();
      return res.status(200).json({ success: true, data: payments });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-HT01: Báo cáo tổng quan
  static async getOverviewReport(req: AuthRequest, res: Response) {
    try {
      const users = await UserModel.findAll();
      const courses = await CourseModel.findAll();
      const payments = await PaymentModel.findAll();

      const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
      const totalStudents = users.filter(u => u.role === 'customer').length;
      const totalProviders = users.filter(u => u.role === 'provider').length;
      const pendingCourses = courses.filter(c => c.status === 'pending_approval').length;
      const pendingProviders = users.filter(u => u.status === 'pending_approval').length;

      return res.status(200).json({
        success: true,
        data: {
          totalUsers: users.length,
          totalStudents,
          totalProviders,
          totalCourses: courses.length,
          pendingCourses,
          pendingProviders,
          totalRevenue,
          totalTransactions: payments.length,
          recentPayments: payments.slice(-5).reverse()
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-HT02: Quản lý thông báo (gửi thông báo hệ thống)
  static async broadcastNotification(req: AuthRequest, res: Response) {
    try {
      const { title, message, targetRole, targetUserId } = req.body;
      if (!title || !message) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập Tiêu đề và Nội dung thông báo.' });
      }

      const notif = await NotificationModel.create({
        title,
        message,
        targetRole: targetRole || 'all',
        targetUserId,
        type: 'system'
      });

      return res.status(201).json({ success: true, message: 'Gửi thông báo thành công!', data: notif });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-HT03: Quản lý tài chính
  static async getFinancialReport(req: AuthRequest, res: Response) {
    try {
      const payments = await PaymentModel.findAll();
      const grossRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
      const platformFee = Math.round(grossRevenue * 0.2); // 20% phí nền tảng
      const providerPayout = grossRevenue - platformFee;   // 80% chi trả NCC
      const serverAndOpCost = 5000000; // Chi phí vận hành máy chủ ước tính
      const netProfit = platformFee - serverAndOpCost;

      return res.status(200).json({
        success: true,
        data: {
          grossRevenue,
          platformFee,
          providerPayout,
          serverAndOpCost,
          netProfit,
          transactionCount: payments.length
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // AD-HT06: Quản lý quyền truy cập
  static async getAccessManagement(req: AuthRequest, res: Response) {
    try {
      const roles = [
        {
          role: 'admin',
          name: 'Quản trị viên hệ thống',
          permissions: ['Toàn quyền quản lý người dùng', 'Duyệt NCC & Khóa học', 'Quản lý tài chính & thanh toán', 'Gửi thông báo toàn hệ thống']
        },
        {
          role: 'provider',
          name: 'Nhà cung cấp khóa học (NCC)',
          permissions: ['Tạo & chỉnh sửa khóa học', 'Quản lý bài giảng & video', 'Tạo mã giảm giá & ưu đãi', 'Xem báo cáo doanh thu khóa học']
        },
        {
          role: 'customer',
          name: 'Học viên / Khách hàng',
          permissions: ['Đăng ký & mua khóa học', 'Học trực tuyến & làm bài tập', 'Đánh giá & để lại nhận xét', 'Đăng ký nâng cấp lên NCC']
        }
      ];
      return res.status(200).json({ success: true, data: roles });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
