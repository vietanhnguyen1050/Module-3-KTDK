import { IDashboard, IDashboardChangeHistory } from '../types';

export const mockDashboards: IDashboard[] = [
  {
    id: 'db_ecommerce',
    userId: 'user_dev',
    userName: 'Nguyễn Văn Anh',
    title: 'E-Commerce Global Sales Dashboard',
    description: 'Theo dõi doanh thu, số đơn hàng, tỷ lệ chuyển đổi và doanh số theo khu vực thời gian thực.',
    category: 'Sales & Revenue',
    layout: 'grid',
    theme: 'indigo',
    isPublic: true,
    isShared: true,
    sharedWith: [
      { email: 'mai.tran@company.com', role: 'editor' },
      { email: 'lead@company.com', role: 'viewer' }
    ],
    widgetsCount: 6,
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-02-18T15:30:00Z'
  },
  {
    id: 'db_infrastructure',
    userId: 'user_dev',
    userName: 'Nguyễn Văn Anh',
    title: 'Cloud Infrastructure & DevOps Metrics',
    description: 'Giám sát CPU, RAM, Network Traffic, API Latency và Error Rates trên AWS ECS Cluster.',
    category: 'DevOps & Cloud',
    layout: 'compact',
    theme: 'dark',
    isPublic: false,
    isShared: false,
    sharedWith: [],
    widgetsCount: 4,
    createdAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-02-19T09:12:00Z'
  },
  {
    id: 'db_marketing',
    userId: 'user_analyst',
    userName: 'Trần Thị Mai',
    title: 'Digital Marketing & User Acquisition Funnel',
    description: 'Phân tích chiến dịch quảng cáo Google Ads, Facebook Ads, CAC và LTV.',
    category: 'Marketing',
    layout: 'flex',
    theme: 'light',
    isPublic: true,
    isShared: true,
    sharedWith: [
      { email: 'user@dashstack.io', role: 'viewer' }
    ],
    widgetsCount: 4,
    createdAt: '2024-02-10T14:20:00Z',
    updatedAt: '2024-02-20T11:00:00Z'
  }
];

export const mockChangeHistory: IDashboardChangeHistory[] = [
  {
    id: 'hist_1',
    dashboardId: 'db_ecommerce',
    userId: 'user_dev',
    userName: 'Nguyễn Văn Anh',
    action: 'Thêm widget "Monthly Revenue Line Chart"',
    timestamp: '2024-02-18T15:30:00Z'
  },
  {
    id: 'hist_2',
    dashboardId: 'db_ecommerce',
    userId: 'user_analyst',
    userName: 'Trần Thị Mai',
    action: 'Cập nhật theme sang Indigo & bật chia sẻ công khai',
    timestamp: '2024-02-17T11:20:00Z'
  },
  {
    id: 'hist_3',
    dashboardId: 'db_infrastructure',
    userId: 'user_dev',
    userName: 'Nguyễn Văn Anh',
    action: 'Kết nối nguồn dữ liệu Prometheus Metrics',
    timestamp: '2024-02-05T10:05:00Z'
  }
];

export class DashboardModel {
  static async findAll(userId?: string): Promise<IDashboard[]> {
    if (!userId) return mockDashboards;
    return mockDashboards.filter(d => 
      d.userId === userId || d.isPublic || d.sharedWith.some(s => s.email.includes(userId))
    );
  }

  static async findById(id: string): Promise<IDashboard | undefined> {
    return mockDashboards.find(d => d.id === id);
  }

  static async create(data: Partial<IDashboard>): Promise<IDashboard> {
    const newDb: IDashboard = {
      id: `db_${Date.now()}`,
      userId: data.userId || '',
      userName: data.userName || 'User',
      title: data.title || 'Untitled Dashboard',
      description: data.description || '',
      category: data.category || 'General',
      layout: data.layout || 'grid',
      theme: data.theme || 'indigo',
      isPublic: data.isPublic || false,
      isShared: data.isShared || false,
      sharedWith: data.sharedWith || [],
      widgetsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockDashboards.unshift(newDb);

    // Ghi log lịch sử
    mockChangeHistory.unshift({
      id: `hist_${Date.now()}`,
      dashboardId: newDb.id,
      userId: newDb.userId,
      userName: newDb.userName,
      action: `Tạo mới bảng điều khiển "${newDb.title}"`,
      timestamp: new Date().toISOString()
    });

    return newDb;
  }

  static async update(id: string, updateData: Partial<IDashboard>, updatedBy?: { id: string; name: string }): Promise<IDashboard | null> {
    const idx = mockDashboards.findIndex(d => d.id === id);
    if (idx === -1) return null;
    mockDashboards[idx] = {
      ...mockDashboards[idx],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    if (updatedBy) {
      mockChangeHistory.unshift({
        id: `hist_${Date.now()}`,
        dashboardId: id,
        userId: updatedBy.id,
        userName: updatedBy.name,
        action: `Chỉnh sửa cấu hình bảng điều khiển`,
        timestamp: new Date().toISOString()
      });
    }

    return mockDashboards[idx];
  }

  static async delete(id: string): Promise<boolean> {
    const idx = mockDashboards.findIndex(d => d.id === id);
    if (idx === -1) return false;
    mockDashboards.splice(idx, 1);
    return true;
  }

  static async getHistory(dashboardId?: string): Promise<IDashboardChangeHistory[]> {
    if (dashboardId) {
      return mockChangeHistory.filter(h => h.dashboardId === dashboardId);
    }
    return mockChangeHistory;
  }
}
