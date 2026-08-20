import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Tất cả user routes đều yêu cầu đăng nhập
router.use(authenticate);

// CT-QLTT04: Xem thông tin cá nhân
router.get('/profile', UserController.getProfile);

// CT-QLTT05: Cập nhật thông tin cá nhân
router.put('/profile', UserController.updateProfile);

// CT-QLTT06: Yêu cầu xoá tài khoản
router.post('/delete-request', UserController.requestDeleteAccount);

// CT-QLTT07: Xem thông báo
router.get('/notifications', UserController.getNotifications);

// CT-CLTT08: Đăng ký làm NCC
router.post('/register-provider', UserController.registerProvider);

// CT-QLTTKH01: Danh sách khóa học đã đăng ký
router.get('/enrolled-courses', UserController.getEnrolledCourses);

// Cập nhật tiến độ học tập
router.post('/progress', UserController.updateLessonProgress);

export default router;
