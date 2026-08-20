import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// CT-QLTT01: Đăng ký
router.post('/register', AuthController.register);

// CT-QLTT02: Đăng nhập
router.post('/login', AuthController.login);

// CT-QLTT03: Quên mật khẩu
router.post('/forgot-password', AuthController.forgotPassword);

// Lấy thông tin tài khoản hiện tại
router.get('/me', authenticate, AuthController.getMe);

export default router;
