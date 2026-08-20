import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// Toàn bộ routes yêu cầu quyền Admin
router.use(authenticate, requireRole(['admin']));

// AD-NCC01 & AD-NCC02: Quản lý & duyệt NCC
router.get('/providers', AdminController.getProviders);
router.put('/providers/:id/approve', AdminController.approveProvider);

// AD-NCC03: Đánh giá NCC
router.get('/ncc-reviews', AdminController.getNCCReviews);

// AD-KH01 & AD-KH02: Quản lý & duyệt khóa học
router.get('/courses', AdminController.getCourses);
router.put('/courses/:id/approve', AdminController.approveCourse);

// AD-KH03: Kiểm tra nội dung khóa học
router.get('/courses/:id/content', AdminController.getCourseContent);

// AD-CT01: Quản lý khách hàng
router.get('/customers', AdminController.getCustomers);
router.put('/customers/:id/toggle-status', AdminController.toggleCustomerStatus);

// AD-CT02: Quản lý thanh toán
router.get('/payments', AdminController.getPayments);

// AD-HT01: Báo cáo tổng quan
router.get('/overview', AdminController.getOverviewReport);

// AD-HT02: Quản lý thông báo
router.post('/broadcast', AdminController.broadcastNotification);

// AD-HT03: Quản lý tài chính
router.get('/financials', AdminController.getFinancialReport);

// AD-HT06: Quản lý quyền truy cập
router.get('/access-control', AdminController.getAccessManagement);

export default router;
