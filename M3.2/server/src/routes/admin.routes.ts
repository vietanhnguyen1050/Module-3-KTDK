import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate, requireRole(['admin']));

// AD-ADM07: Báo cáo tổng quan
router.get('/overview', AdminController.getOverview);

// AD-ADM01 & 02: Quản lý người dùng
router.get('/users', AdminController.getUsers);
router.post('/users', AdminController.createUser);
router.put('/users/:id', AdminController.updateUser);
router.delete('/users/:id', AdminController.deleteUser);

// AD-ADM04: Quản lý bảng điều khiển
router.get('/dashboards', AdminController.getAllDashboards);

// AD-ADM05: Quản lý thông báo
router.get('/notifications', AdminController.getNotifications);
router.post('/notifications', AdminController.broadcastNotification);

// AD-ADM08: Quản lý bảo mật
router.get('/security', AdminController.getSecuritySettings);
router.put('/security', AdminController.updateSecuritySettings);

// AD-ADM09: Quản lý API
router.get('/api-keys', AdminController.getAllApiKeys);
router.put('/api-keys/:id/revoke', AdminController.revokeApiKey);

// AD-ADM10: Quản lý nhật ký hệ thống
router.get('/system-logs', AdminController.getSystemLogs);

// AD-ADM14: Quản lý log sự kiện
router.get('/event-logs', AdminController.getEventLogs);

// AD-ADM11: Quản lý tài khoản thanh toán
router.get('/payments', AdminController.getPaymentAccounts);
router.put('/payments/:id', AdminController.updatePaymentAccount);

// AD-ADM12: Quản lý gói dịch vụ
router.get('/packages', AdminController.getServicePackages);
router.put('/packages/:id', AdminController.updateServicePackage);

// AD-ADM13: Quản lý đăng nhập / Sessions
router.get('/sessions', AdminController.getActiveSessions);
router.delete('/sessions/:id', AdminController.terminateSession);

// AD-ADM15: Quản lý backup dữ liệu
router.get('/backups', AdminController.getBackups);
router.post('/backups', AdminController.createBackup);

export default router;
