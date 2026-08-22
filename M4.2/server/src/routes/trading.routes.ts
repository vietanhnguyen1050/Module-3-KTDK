import { Router } from 'express';
import { TradingController } from '../controllers/trading.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

router.post('/order', TradingController.placeOrder);
router.delete('/order/:id', TradingController.cancelOrder);
router.post('/swap', TradingController.swapCrypto);
router.get('/my-orders', TradingController.getMyOrders);

export default router;
