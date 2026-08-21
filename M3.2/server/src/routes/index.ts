import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import dashboardRoutes from './dashboard.routes';
import { dataSourceRoutes, alertRoutes, reportRoutes, supportRoutes } from './auxiliary.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/dashboards', dashboardRoutes);
router.use('/datasources', dataSourceRoutes);
router.use('/alerts', alertRoutes);
router.use('/reports', reportRoutes);
router.use('/support', supportRoutes);
router.use('/admin', adminRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    system: 'Dashstack System API Server',
    timestamp: new Date().toISOString()
  });
});

export default router;
