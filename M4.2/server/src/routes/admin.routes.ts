import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate, requireRole(['admin']));

// AD-ADM05, AD-ADM10: Báo cáo tổng quan & Tài chính
router.get('/overview', AdminController.getOverview);

// AD-ADM01: Quản lý người dùng
router.get('/users', AdminController.getUsers);
router.post('/users', AdminController.createUser);
router.put('/users/:id', AdminController.updateUser);
router.delete('/users/:id', AdminController.deleteUser);

// AD-ADM02: Quản lý & kiểm duyệt giao dịch
router.get('/orders', AdminController.getAllOrders);

// AD-ADM03: Quản lý tài sản sàn
router.get('/reserves', AdminController.getAssetReserves);

// AD-ADM04: Quản lý cặp giao dịch
router.post('/pairs', AdminController.createPair);
router.put('/pairs/:id', AdminController.updatePair);
router.delete('/pairs/:id', AdminController.deletePair);

// AD-ADM06: Quản lý thông báo
router.get('/notifications', AdminController.getNotifications);
router.post('/notifications', AdminController.broadcastNotification);

// AD-ADM08: Quản lý bảo mật & Logs
router.get('/logs', AdminController.getSystemLogs);

// AD-ADM09: Quản lý API
router.get('/api-keys', AdminController.getApiKeys);
router.post('/api-keys', AdminController.createApiKey);
router.put('/api-keys/:id/revoke', AdminController.revokeApiKey);

export default router;
