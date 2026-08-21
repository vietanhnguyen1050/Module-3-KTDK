import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Xem danh sách và chi tiết dashboard
router.get('/', DashboardController.getDashboards);
router.get('/:id', DashboardController.getDashboardById);

// Các thao tác cần xác thực
router.use(authenticate);

router.post('/', DashboardController.createDashboard);
router.put('/:id', DashboardController.updateDashboard);
router.delete('/:id', DashboardController.deleteDashboard);

router.post('/:id/share', DashboardController.shareDashboard);
router.get('/:id/history', DashboardController.getHistory);
router.get('/:id/export', DashboardController.exportData);

// Widgets
router.post('/:id/widgets', DashboardController.createWidget);
router.put('/widgets/:widgetId', DashboardController.updateWidget);
router.delete('/widgets/:widgetId', DashboardController.deleteWidget);

export default router;
