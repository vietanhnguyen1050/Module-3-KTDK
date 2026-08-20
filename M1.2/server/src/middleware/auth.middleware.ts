import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { IUser } from '../types';

export const JWT_SECRET = process.env.JWT_SECRET || 'edupress_secret_jwt_key_2024';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // For easy demo testing, allow header x-user-id
      const demoUserId = req.headers['x-user-id'] as string;
      if (demoUserId) {
        const user = await UserModel.findById(demoUserId);
        if (user) {
          req.user = user;
          return next();
        }
      }
      return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để thực hiện thao tác này (Token không hợp lệ).' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại trên hệ thống.' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị khóa.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' });
  }
};
