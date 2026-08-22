import { IUser } from '../types';

export const mockUsers: IUser[] = [
  {
    id: 'user_admin',
    name: 'Quản Trị Viên Crypto Planet',
    email: 'admin@cryptoplanet.io',
    password: 'password123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    status: 'active',
    twoFactorEnabled: true,
    vipLevel: 9,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user_trader',
    name: 'Nguyễn Văn Anh (Pro Trader)',
    email: 'trader@cryptoplanet.io',
    password: 'password123',
    role: 'trader',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    status: 'active',
    twoFactorEnabled: true,
    vipLevel: 3,
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'user_viewer',
    name: 'Trần Thị Mai (Market Analyst / Viewer)',
    email: 'viewer@cryptoplanet.io',
    password: 'password123',
    role: 'viewer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    status: 'active',
    twoFactorEnabled: false,
    vipLevel: 1,
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
      role: data.role || 'trader',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      status: 'active',
      twoFactorEnabled: false,
      vipLevel: 1,
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
