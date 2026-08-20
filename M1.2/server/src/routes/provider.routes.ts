import { Router } from 'express';
import { ProviderController } from '../controllers/provider.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// Yêu cầu quyền Provider hoặc Admin
router.use(authenticate, requireRole(['provider', 'admin']));

// IN-KH01, 02, 03: CRUD Khóa học của NCC
router.get('/courses', ProviderController.getMyCourses);
router.post('/courses', ProviderController.createCourse);
router.put('/courses/:id', ProviderController.updateCourse);
router.delete('/courses/:id', ProviderController.deleteCourse);

// IN-KH04: CRUD Bài giảng
router.get('/courses/:courseId/lessons', ProviderController.getLessons);
router.post('/courses/:courseId/lessons', ProviderController.createLesson);
router.put('/lessons/:lessonId', ProviderController.updateLesson);
router.delete('/lessons/:lessonId', ProviderController.deleteLesson);

// IN-UĐ01, 02, 03: CRUD Mã giảm giá
router.get('/discounts', ProviderController.getDiscounts);
router.post('/discounts', ProviderController.createDiscount);
router.put('/discounts/:id', ProviderController.updateDiscount);
router.delete('/discounts/:id', ProviderController.deleteDiscount);

// IN-UĐ04, 05, 06: CRUD Chương trình ưu đãi
router.get('/promotions', ProviderController.getPromotions);
router.post('/promotions', ProviderController.createPromotion);
router.put('/promotions/:id', ProviderController.updatePromotion);
router.delete('/promotions/:id', ProviderController.deletePromotion);

// IN-UĐ07: CRUD Quà tặng
router.get('/gifts', ProviderController.getGifts);
router.post('/gifts', ProviderController.createGift);
router.put('/gifts/:id', ProviderController.updateGift);
router.delete('/gifts/:id', ProviderController.deleteGift);

// N-DS01, IN-DS02: Báo cáo doanh thu
router.get('/revenue', ProviderController.getRevenueReport);

export default router;
