import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// CT-QLTTKH05: Danh sách khóa học (Công khai trên trang chủ)
router.get('/', CourseController.getAllCourses);

// CT-QLTTKH02: Xem chi tiết khóa học
router.get('/:id', CourseController.getCourseDetail);

// CT-QLTTKH06: Đăng ký & thanh toán khóa học
router.post('/:id/enroll', authenticate, CourseController.enrollCourse);

// CT-QLTTKH03: Xem các bài học của khóa học đã đăng ký
router.get('/:id/lessons', authenticate, CourseController.getCourseLessons);

// CT-QLTTKH04: Đánh giá khóa học
router.post('/:id/reviews', authenticate, CourseController.addCourseReview);

export default router;
