import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserModel } from '../models/user.model';
import { EnrollmentModel } from '../models/enrollment.model';
import { CourseModel } from '../models/course.model';
import { NotificationModel } from '../models/other.models';

export class UserController {
  // CT-QLTT04: Xem thông tin cá nhân
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await UserModel.findById(req.user!.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });
      }
      const { password: _, ...userData } = user;
      return res.status(200).json({ success: true, data: userData });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // CT-QLTT05: Cập nhật thông tin cá nhân (trừ email, có thể đổi password)
  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const { name, phone, address, avatar, newPassword } = req.body;
      const updatePayload: any = {};

      if (name) updatePayload.name = name;
      if (phone !== undefined) updatePayload.phone = phone;
      if (address !== undefined) updatePayload.address = address;
      if (avatar !== undefined) updatePayload.avatar = avatar;
      if (newPassword) updatePayload.password = newPassword;

      const updatedUser = await UserModel.update(req.user!.id, updatePayload);
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'Cập nhật thất bại.' });
      }

      const { password: _, ...userData } = updatedUser;
      return res.status(200).json({
        success: true,
        message: 'Cập nhật hồ sơ cá nhân thành công!',
        data: userData
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // CT-QLTT06: Yêu cầu xoá tài khoản
  static async requestDeleteAccount(req: AuthRequest, res: Response) {
    try {
      const { reason } = req.body;
      const user = await UserModel.update(req.user!.id, {
        deleteRequested: true,
        deleteReason: reason || 'Người dùng yêu cầu xóa tài khoản'
      });

      return res.status(200).json({
        success: true,
        message: 'Yêu cầu xoá tài khoản đã được ghi nhận. Quản trị viên sẽ xử lý trong vòng 24-48 giờ.',
        data: user
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // CT-QLTT07: Thông báo
  static async getNotifications(req: AuthRequest, res: Response) {
    try {
      const notifs = await NotificationModel.findForUser(req.user!.id, req.user!.role);
      return res.status(200).json({ success: true, data: notifs });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // CT-CLTT08: Đăng ký làm Nhà Cung Cấp Khóa Học (NCC)
  static async registerProvider(req: AuthRequest, res: Response) {
    try {
      const { organizationName, description, website } = req.body;

      if (!organizationName || !description) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp Tên tổ chức/cá nhân và Mô tả giới thiệu.' });
      }

      const updatedUser = await UserModel.update(req.user!.id, {
        status: 'pending_approval',
        providerInfo: {
          organizationName,
          description,
          website
        }
      });

      // Tạo thông báo cho hệ thống
      await NotificationModel.create({
        targetRole: 'admin',
        title: 'Yêu cầu đăng ký NCC mới',
        message: `Người dùng ${req.user!.name} (${req.user!.email}) vừa nộp đơn đăng ký làm Nhà Cung Cấp.`,
        type: 'system'
      });

      return res.status(200).json({
        success: true,
        message: 'Hồ sơ đăng ký NCC đã được gửi thành công! Quản trị viên Edupress sẽ xét duyệt trong thời gian sớm nhất.',
        data: updatedUser
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // CT-QLTTKH01: Danh sách khóa học đã đăng ký
  static async getEnrolledCourses(req: AuthRequest, res: Response) {
    try {
      const enrollments = await EnrollmentModel.findByUserId(req.user!.id);
      const allCourses = await CourseModel.findAll();

      const enrolledCoursesWithDetails = enrollments.map(enr => {
        const course = allCourses.find(c => c.id === enr.courseId);
        return {
          enrollment: enr,
          course: course || null
        };
      }).filter(item => item.course !== null);

      return res.status(200).json({ success: true, data: enrolledCoursesWithDetails });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // Cập nhật tiến độ học bài
  static async updateLessonProgress(req: AuthRequest, res: Response) {
    try {
      const { courseId, lessonId, totalLessons } = req.body;
      const enr = await EnrollmentModel.findByUserAndCourse(req.user!.id, courseId);
      if (!enr) {
        return res.status(404).json({ success: false, message: 'Bạn chưa đăng ký khóa học này.' });
      }

      const completed = new Set(enr.completedLessonIds);
      completed.add(lessonId);
      const completedArray = Array.from(completed);
      const progress = totalLessons > 0 ? Math.round((completedArray.length / totalLessons) * 100) : 100;

      const updated = await EnrollmentModel.updateProgress(req.user!.id, courseId, completedArray, Math.min(progress, 100));
      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
