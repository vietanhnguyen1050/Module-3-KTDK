import { IUser } from '../types';

export const mockUsers: IUser[] = [
  {
    id: 'user_admin',
    name: 'Quản Trị Viên Dashstack',
    email: 'admin@dashstack.io',
    password: 'password123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    packageId: 'pkg_enterprise',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user_dev',
    name: 'Nguyễn Văn Anh',
    email: 'user@dashstack.io',
    password: 'password123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    packageId: 'pkg_pro',
    status: 'active',
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'user_analyst',
    name: 'Trần Thị Mai (Data Analyst)',
    email: 'mai.tran@company.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    packageId: 'pkg_pro',
    status: 'active',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'user_blocked',
    name: 'Lê Minh Tuấn',
    email: 'tuan.le@spammer.org',
    password: 'password123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    packageId: 'pkg_free',
    status: 'blocked',
    createdAt: '2024-02-01T00:00:00Z'
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

  static async create(data: Partial<IUser>): Promise<IUser> {
    const newUser: IUser = {
      id: `user_${Date.now()}`,
      name: data.name || '',
      email: data.email || '',
      password: data.password || 'password123',
      role: data.role || 'user',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      packageId: data.packageId || 'pkg_free',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return newUser;
  }

  static async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    const idx = mockUsers.findIndex(u => u.id === id);
    if (idx === -1) return null;
    mockUsers[idx] = { ...mockUsers[idx], ...updateData };
    return mockUsers[idx];
  }

  static async delete(id: string): Promise<boolean> {
    const idx = mockUsers.findIndex(u => u.id === id);
    if (idx === -1) return false;
    mockUsers.splice(idx, 1);
    return true;
  }
}
