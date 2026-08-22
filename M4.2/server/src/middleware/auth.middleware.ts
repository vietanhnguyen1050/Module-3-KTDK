import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { IUser, UserRole } from '../types';

export const JWT_SECRET = process.env.JWT_SECRET || 'cryptoplanet_jwt_secret_2024';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Hỗ trợ header test x-user-id
      const demoUserId = req.headers['x-user-id'] as string;
      if (demoUserId) {
        const user = await UserModel.findById(demoUserId);
        if (user) {
          req.user = user;
          return next();
        }
      }
      return res.status(401).json({ success: false, message: 'Chưa đăng nhập. Token không hợp lệ.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại.' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị khóa bởi Quản trị viên.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Phiên đăng nhập đã hết hạn.' });
  }
};

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Bạn không có quyền truy cập chức năng này (Yêu cầu vai trò: ${allowedRoles.join(', ')}).`
      });
    }

    next();
  };
};

export const errorHandler = (err: any, req: any, res: Response, next: NextFunction) => {
  console.error('[CryptoPlanet Error]:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Lỗi hệ thống máy chủ nội bộ.'
  });
};
