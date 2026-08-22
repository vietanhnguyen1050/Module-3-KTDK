import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { JWT_SECRET, AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
  // TRD-REG01 / VWR-REG01: Đăng ký tài khoản
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ Tên, Email và Mật khẩu.' });
      }

      const existing = await UserModel.findByEmail(email);
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email này đã được đăng ký.' });
      }

      const newUser = await UserModel.create({
        name,
        email,
        password,
        role: role === 'viewer' ? 'viewer' : 'trader'
      });

      const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
      const { password: _, ...userClean } = newUser;

      return res.status(201).json({
        success: true,
        message: 'Đăng ký tài khoản Crypto Planet thành công!',
        data: { user: userClean, token }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // TRD-LOG01 / VWR-LOG01: Đăng nhập
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập Email và Mật khẩu.' });
      }

      const user = await UserModel.findByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác.' });
      }

      if (user.status === 'blocked') {
        return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị khóa.' });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      const { password: _, ...userClean } = user;

      return res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công!',
        data: { user: userClean, token }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getMe(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ success: false, message: 'Chưa đăng nhập.' });
    const { password: _, ...userClean } = req.user;
    return res.status(200).json({ success: true, data: userClean });
  }

  // TRD-ACC01: Cập nhật thông tin & bảo mật 2FA
  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const { name, avatar, password, twoFactorEnabled } = req.body;
      const updateData: any = {};
      if (name) updateData.name = name;
      if (avatar) updateData.avatar = avatar;
      if (password) updateData.password = password;
      if (twoFactorEnabled !== undefined) updateData.twoFactorEnabled = twoFactorEnabled;

      const updated = await UserModel.update(req.user!.id, updateData);
      const { password: _, ...userClean } = updated!;
      return res.status(200).json({
        success: true,
        message: 'Cập nhật tài khoản & bảo mật thành công!',
        data: userClean
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
