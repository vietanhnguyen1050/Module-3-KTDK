import { IUser } from '../types';

export const mockUsers: IUser[] = [
  {
    id: 'user_admin',
    name: 'Quản Trị Viên Edupress',
    email: 'admin@edupress.com',
    password: 'password123',
    phone: '0988888888',
    address: 'Hà Nội, Việt Nam',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user_provider_1',
    name: 'MindX Academy',
    email: 'provider@mindx.edu.vn',
    password: 'password123',
    phone: '0977777777',
    address: 'Hồ Chí Minh, Việt Nam',
    role: 'provider',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    status: 'active',
    providerInfo: {
      organizationName: 'MindX Technology School',
      description: 'Đơn vị đào tạo công nghệ hàng đầu Việt Nam.',
      website: 'https://mindx.edu.vn',
      approvedAt: '2024-01-05T00:00:00Z'
    },
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 'user_provider_pending',
    name: 'TechSkill Hub',
    email: 'contact@techskill.vn',
    password: 'password123',
    phone: '0966666666',
    address: 'Đà Nẵng, Việt Nam',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    status: 'pending_approval',
    providerInfo: {
      organizationName: 'TechSkill Hub Đà Nẵng',
      description: 'Chuyên cung cấp các khóa học DevOps và Cloud.',
      website: 'https://techskill.vn'
    },
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'user_customer_1',
    name: 'Nguyễn Văn Anh',
    email: 'student@edupress.com',
    password: 'password123',
    phone: '0912345678',
    address: 'Cầu Giấy, Hà Nội',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
    status: 'active',
    createdAt: '2024-02-10T00:00:00Z'
  }
];

export class UserModel {
  static async findAll(): Promise<IUser[]> {
    return mockUsers;
  }

  static async findById(id: string): Promise<IUser | undefined> {
    return mockUsers.find(u => u.id === id);
  }

  static async findByEmail(email: string): Promise<IUser | undefined> {
    return mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  static async create(userData: Partial<IUser>): Promise<IUser> {
    const newUser: IUser = {
      id: `user_${Date.now()}`,
      name: userData.name || '',
      email: userData.email || '',
      password: userData.password || 'password123',
      phone: userData.phone || '',
      address: userData.address || '',
      role: userData.role || 'customer',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      status: 'active',
      createdAt: new Date().toISOString(),
      ...userData
    };
    mockUsers.push(newUser);
    return newUser;
  }

  static async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) return null;
    mockUsers[index] = { ...mockUsers[index], ...updateData };
    return mockUsers[index];
  }

  static async delete(id: string): Promise<boolean> {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) return false;
    mockUsers.splice(index, 1);
    return true;
  }
}
