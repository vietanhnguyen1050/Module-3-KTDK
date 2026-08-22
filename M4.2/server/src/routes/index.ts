import { Router } from 'express';
import authRoutes from './auth.routes';
import marketRoutes from './market.routes';
import tradingRoutes from './trading.routes';
import walletRoutes from './wallet.routes';
import { alertRoutes, promotionRoutes, supportRoutes } from './auxiliary.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/market', marketRoutes);
router.use('/trading', tradingRoutes);
router.use('/wallet', walletRoutes);
router.use('/alerts', alertRoutes);
router.use('/promotions', promotionRoutes);
router.use('/support', supportRoutes);
router.use('/admin', adminRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    system: 'Crypto Planet Trading API Server',
    timestamp: new Date().toISOString()
  });
});

export default router;
