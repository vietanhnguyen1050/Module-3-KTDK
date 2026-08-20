import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { CourseModel } from '../models/course.model';
import { LessonModel } from '../models/lesson.model';
import { DiscountModel, PromotionModel, GiftModel, PaymentModel, NotificationModel } from '../models/other.models';

export class ProviderController {
  // Lấy danh sách khóa học của NCC
  static async getMyCourses(req: AuthRequest, res: Response) {
    try {
      const courses = await CourseModel.findAll({ providerId: req.user!.id });
      return res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // IN-KH01: Tạo khóa học mới (Gửi duyệt lên Admin)
  static async createCourse(req: AuthRequest, res: Response) {
    try {
      const { title, description, objective, price, originalPrice, thumbnail, category, level } = req.body;

      if (!title || !description) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp Tiêu đề và Mô tả khóa học.' });
      }

      const newCourse = await CourseModel.create({
        providerId: req.user!.id,
        providerName: req.user!.providerInfo?.organizationName || req.user!.name,
        title,
        description,
        objective,
        price: Number(price) || 0,
        originalPrice: Number(originalPrice) || (Number(price) || 0) * 1.5,
        thumbnail,
        category,
        level,
        status: 'pending_approval' // Đợi Admin duyệt
      });

      // Báo Admin có khóa học mới cần duyệt
      await NotificationModel.create({
        targetRole: 'admin',
        title: 'Khóa học mới chờ phê duyệt',
        message: `NCC ${newCourse.providerName} vừa tạo khóa học "${newCourse.title}".`,
        type: 'course'
      });

      return res.status(201).json({
        success: true,
        message: 'Tạo khóa học thành công! Khóa học đã được gửi tới Quản trị viên để xét duyệt.',
        data: newCourse
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // IN-KH02: Chỉnh sửa khóa học
  static async updateCourse(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const course = await CourseModel.findById(id);

      if (!course) {
        return res.status(404).json({ success: false, message: 'Khóa học không tồn tại.' });
      }

      if (course.providerId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền chỉnh sửa khóa học này.' });
      }

      const updatedCourse = await CourseModel.update(id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin khóa học thành công!',
        data: updatedCourse
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // IN-KH03: Xóa khóa học
  static async deleteCourse(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const course = await CourseModel.findById(id);

      if (!course) {
        return res.status(404).json({ success: false, message: 'Khóa học không tồn tại.' });
      }

      if (course.providerId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền xóa khóa học này.' });
      }

      await CourseModel.delete(id);
      return res.status(200).json({ success: true, message: 'Xóa khóa học thành công!' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // IN-KH04: Quản lý bài giảng (Thêm, Sửa, Xóa bài giảng)
  static async getLessons(req: AuthRequest, res: Response) {
    try {
      const { courseId } = req.params;
      const lessons = await LessonModel.findByCourseId(courseId);
      return res.status(200).json({ success: true, data: lessons });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createLesson(req: AuthRequest, res: Response) {
    try {
      const { courseId } = req.params;
      const { title, description, videoUrl, duration, resources } = req.body;

      if (!title) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập tiêu đề bài giảng.' });
      }

      const newLesson = await LessonModel.create({
        courseId,
        title,
        description,
        videoUrl,
        duration,
        resources
      });

      return res.status(201).json({
        success: true,
        message: 'Tải lên bài giảng mới thành công!',
        data: newLesson
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateLesson(req: AuthRequest, res: Response) {
    try {
      const { lessonId } = req.params;
      const updated = await LessonModel.update(lessonId, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Bài giảng không tồn tại.' });
      }
      return res.status(200).json({ success: true, message: 'Cập nhật bài giảng thành công!', data: updated });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteLesson(req: AuthRequest, res: Response) {
    try {
      const { lessonId } = req.params;
      await LessonModel.delete(lessonId);
      return res.status(200).json({ success: true, message: 'Xóa bài giảng thành công!' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // IN-UĐ01, 02, 03: Quản lý mã giảm giá
  static async getDiscounts(req: AuthRequest, res: Response) {
    try {
      const list = await DiscountModel.findByProvider(req.user!.id);
      return res.status(200).json({ success: true, data: list });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createDiscount(req: AuthRequest, res: Response) {
    try {
      const item = await DiscountModel.create({ ...req.body, providerId: req.user!.id });
      return res.status(201).json({ success: true, message: 'Tạo mã giảm giá thành công!', data: item });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateDiscount(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const item = await DiscountModel.update(id, req.body);
      return res.status(200).json({ success: true, message: 'Cập nhật mã giảm giá thành công!', data: item });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteDiscount(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      await DiscountModel.delete(id);
      return res.status(200).json({ success: true, message: 'Xóa mã giảm giá thành công!' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // IN-UĐ04, 05, 06: Quản lý chương trình ưu đãi
  static async getPromotions(req: AuthRequest, res: Response) {
    try {
      const list = await PromotionModel.findByProvider(req.user!.id);
      return res.status(200).json({ success: true, data: list });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createPromotion(req: AuthRequest, res: Response) {
    try {
      const item = await PromotionModel.create({ ...req.body, providerId: req.user!.id });
      return res.status(201).json({ success: true, message: 'Tạo chương trình ưu đãi thành công!', data: item });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updatePromotion(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const item = await PromotionModel.update(id, req.body);
      return res.status(200).json({ success: true, message: 'Cập nhật chương trình ưu đãi thành công!', data: item });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deletePromotion(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      await PromotionModel.delete(id);
      return res.status(200).json({ success: true, message: 'Xóa chương trình ưu đãi thành công!' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // IN-UĐ07: Quản lý quà tặng
  static async getGifts(req: AuthRequest, res: Response) {
    try {
      const list = await GiftModel.findByProvider(req.user!.id);
      return res.status(200).json({ success: true, data: list });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createGift(req: AuthRequest, res: Response) {
    try {
      const item = await GiftModel.create({ ...req.body, providerId: req.user!.id });
      return res.status(201).json({ success: true, message: 'Tạo quà tặng đính kèm thành công!', data: item });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateGift(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const item = await GiftModel.update(id, req.body);
      return res.status(200).json({ success: true, message: 'Cập nhật quà tặng thành công!', data: item });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteGift(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      await GiftModel.delete(id);
      return res.status(200).json({ success: true, message: 'Xóa quà tặng thành công!' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // N-DS01, IN-DS02: Báo cáo & Chi tiết doanh thu
  static async getRevenueReport(req: AuthRequest, res: Response) {
    try {
      const providerId = req.user!.id;
      const payments = await PaymentModel.findByProvider(providerId);
      const courses = await CourseModel.findAll({ providerId });

      const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
      const totalStudents = payments.length;

      const courseBreakdown = courses.map(c => {
        const cPayments = payments.filter(p => p.courseId === c.id);
        const revenue = cPayments.reduce((sum, p) => sum + p.amount, 0);
        return {
          courseId: c.id,
          courseTitle: c.title,
          price: c.price,
          salesCount: cPayments.length,
          revenue
        };
      });

      return res.status(200).json({
        success: true,
        data: {
          totalRevenue,
          totalStudents,
          totalCourses: courses.length,
          recentTransactions: payments.slice(-10).reverse(),
          courseBreakdown
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
