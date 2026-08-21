import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserModel } from '../models/user.model';
import { AdminDataModel } from '../models/admin.models';

export class UserController {
  // USR-ACC01: Quản lý tài khoản
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await UserModel.findById(req.user!.id);
      if (!user) return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });
      const { password: _, ...userClean } = user;
      return res.status(200).json({ success: true, data: userClean });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const { name, avatar, password } = req.body;
      const updateData: any = {};
      if (name) updateData.name = name;
      if (avatar) updateData.avatar = avatar;
      if (password) updateData.password = password;

      const updated = await UserModel.update(req.user!.id, updateData);
      const { password: _, ...userClean } = updated!;
      return res.status(200).json({
        success: true,
        message: 'Cập nhật tài khoản thành công!',
        data: userClean
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // API Keys của User (AD-ADM09)
  static async getApiKeys(req: AuthRequest, res: Response) {
    try {
      const keys = AdminDataModel.getApiKeys(req.user!.id);
      return res.status(200).json({ success: true, data: keys });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createApiKey(req: AuthRequest, res: Response) {
    try {
      const key = AdminDataModel.createApiKey({ ...req.body, userId: req.user!.id });
      return res.status(201).json({ success: true, message: 'Tạo API Key mới thành công!', data: key });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
