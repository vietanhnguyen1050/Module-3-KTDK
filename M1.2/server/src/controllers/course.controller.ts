import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { CourseModel } from '../models/course.model';
import { LessonModel } from '../models/lesson.model';
import { ReviewModel } from '../models/review.model';
import { EnrollmentModel } from '../models/enrollment.model';
import { DiscountModel, PaymentModel, NotificationModel } from '../models/other.models';

export class CourseController {
  // CT-QLTTKH05: Xem danh sách khóa học (trên trang chủ & tìm kiếm)
  static async getAllCourses(req: Request, res: Response) {
    try {
      const { search, category, status } = req.query;
      // Default to only approved courses for public view unless specified
      const filterStatus = (status as string) || 'approved';
      const courses = await CourseModel.findAll({
        search: search as string,
        category: category as string,
        status: filterStatus === 'all' ? undefined : filterStatus
      });
      return res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // CT-QLTTKH02: Xem chi tiết khóa học
  static async getCourseDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const course = await CourseModel.findById(id);

      if (!course) {
        return res.status(404).json({ success: false, message: 'Khóa học không tồn tại.' });
      }

      const lessons = await LessonModel.findByCourseId(id);
      const reviews = await ReviewModel.findByCourseId(id);

      return res.status(200).json({
        success: true,
        data: {
          ...course,
          lessons,
          reviews
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // CT-QLTTKH06: Đăng ký khóa học (với mã giảm giá & tạo thanh toán)
  static async enrollCourse(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { discountCode, paymentMethod } = req.body;
      const userId = req.user!.id;

      const course = await CourseModel.findById(id);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Khóa học không tồn tại.' });
      }

      // Kiểm tra xem đã đăng ký chưa
      const existingEnrollment = await EnrollmentModel.findByUserAndCourse(userId, id);
      if (existingEnrollment) {
        return res.status(400).json({ success: false, message: 'Bạn đã đăng ký khóa học này rồi!' });
      }

      let finalPrice = course.price;
      let appliedDiscount: any = null;

      // Áp dụng mã giảm giá nếu có
      if (discountCode) {
        const discount = await DiscountModel.findByCode(discountCode);
        if (discount && (!discount.courseId || discount.courseId === id) && discount.usedCount < discount.maxUses) {
          finalPrice = Math.round(course.price * (1 - discount.discountPercent / 100));
          appliedDiscount = discount;
          await DiscountModel.update(discount.id, { usedCount: discount.usedCount + 1 });
        }
      }

      // Tạo giao dịch thanh toán
      const payment = await PaymentModel.create({
        userId,
        userName: req.user!.name,
        userEmail: req.user!.email,
        courseId: course.id,
        courseTitle: course.title,
        providerId: course.providerId,
        amount: finalPrice,
        paymentMethod: paymentMethod || 'momo',
        status: 'completed'
      });

      // Tạo bản ghi đăng ký học
      const enrollment = await EnrollmentModel.create({
        userId,
        courseId: course.id,
        paymentId: payment.id
      });

      // Tăng số lượng enrolledCount của khóa học
      await CourseModel.update(course.id, { enrolledCount: course.enrolledCount + 1 });

      // Gửi thông báo đến học viên
      await NotificationModel.create({
        targetUserId: userId,
        title: 'Đăng ký khóa học thành công',
        message: `Bạn đã đăng ký thành công khóa học "${course.title}". Chúc bạn có trải nghiệm học tập tuyệt vời!`,
        type: 'course'
      });

      return res.status(201).json({
        success: true,
        message: 'Đăng ký và thanh toán khóa học thành công!',
        data: {
          enrollment,
          payment,
          finalPrice,
          appliedDiscount
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // CT-QLTTKH03: Xem bài học của khóa học (video + tài liệu)
  static async getCourseLessons(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      // Kiểm tra quyền: Admin, Provider tạo ra khóa học, hoặc học viên đã đăng ký
      const course = await CourseModel.findById(id);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Khóa học không tồn tại.' });
      }

      const isOwner = req.user!.role === 'admin' || (req.user!.role === 'provider' && course.providerId === userId);
      const isEnrolled = await EnrollmentModel.findByUserAndCourse(userId, id);

      if (!isOwner && !isEnrolled) {
        return res.status(403).json({
          success: false,
          message: 'Bạn chưa đăng ký khóa học này nên không thể xem danh sách bài học chi tiết.'
        });
      }

      const lessons = await LessonModel.findByCourseId(id);
      return res.status(200).json({
        success: true,
        data: {
          course,
          enrollment: isEnrolled,
          lessons
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // CT-QLTTKH04: Đánh giá khóa học
  static async addCourseReview(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user!.id;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: 'Vui lòng chọn số sao đánh giá từ 1 đến 5.' });
      }

      const isEnrolled = await EnrollmentModel.findByUserAndCourse(userId, id);
      if (!isEnrolled && req.user!.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Chỉ học viên đã đăng ký khóa học mới có thể để lại đánh giá.' });
      }

      const review = await ReviewModel.create({
        courseId: id,
        userId,
        userName: req.user!.name,
        rating: Number(rating),
        comment: comment || ''
      });

      // Cập nhật rating trung bình của khóa học
      const allReviews = await ReviewModel.findByCourseId(id);
      const avgRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1);
      await CourseModel.update(id, { rating: Number(avgRating), reviewCount: allReviews.length });

      return res.status(201).json({
        success: true,
        message: 'Gửi đánh giá khóa học thành công!',
        data: review
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
