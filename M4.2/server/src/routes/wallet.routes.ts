import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

router.get('/balances', WalletController.getBalances);
router.post('/deposit', WalletController.deposit);
router.post('/withdraw', WalletController.withdraw);
router.get('/transactions', WalletController.getTransactions);

export default router;
