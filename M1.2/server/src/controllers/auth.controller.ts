import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { JWT_SECRET, AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
  // CT-QLTT01: Đăng ký
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, phone, address } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu.' });
      }

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email này đã được đăng ký trên hệ thống.' });
      }

      const newUser = await UserModel.create({
        name,
        email,
        password,
        phone,
        address,
        role: 'customer',
        status: 'active'
      });

      const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

      const { password: _, ...userWithoutPassword } = newUser;

      return res.status(201).json({
        success: true,
        message: 'Đăng ký tài khoản thành công!',
        data: {
          user: userWithoutPassword,
          token
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // CT-QLTT02: Đăng nhập
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
        return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.' });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công!',
        data: {
          user: userWithoutPassword,
          token
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // CT-QLTT03: Quên mật khẩu
  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập email.' });
      }

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Email này không tồn tại trên hệ thống.' });
      }

      // Giả lập gửi email đặt lại mật khẩu
      return res.status(200).json({
        success: true,
        message: `Hệ thống đã gửi liên kết đặt lại mật khẩu tới hòm thư ${email}. Vui lòng kiểm tra email của bạn (Mật khẩu tạm thời: password123).`
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // Lấy thông tin user hiện tại
  static async getMe(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Chưa đăng nhập.' });
    }
    const { password: _, ...userWithoutPassword } = req.user;
    return res.status(200).json({ success: true, data: userWithoutPassword });
  }
}
