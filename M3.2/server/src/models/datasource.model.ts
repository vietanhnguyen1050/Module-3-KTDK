import { IDataSource, IAlert, IReport, ISupportTicket } from '../types';

// Data Sources (USR-DBD03, USR-DBD11, AD-ADM03)
export const mockDataSources: IDataSource[] = [
  {
    id: 'ds_postgres_prod',
    userId: 'user_dev',
    name: 'Production PostgreSQL Cluster',
    type: 'postgres',
    host: 'db-cluster.aws.internal:5432/main_db',
    status: 'connected',
    lastSync: '2024-02-20T12:00:00Z',
    recordsCount: 1450280
  },
  {
    id: 'ds_rest_api_stripe',
    userId: 'user_dev',
    name: 'Stripe Payment REST API',
    type: 'rest_api',
    host: 'https://api.stripe.com/v1/charges',
    status: 'connected',
    lastSync: '2024-02-20T11:45:00Z',
    recordsCount: 48920
  },
  {
    id: 'ds_slack_alerts',
    userId: 'user_dev',
    name: 'Slack #alerts-ops Integration',
    type: 'slack',
    host: 'hooks.slack.com/services/T00/B00/XXXX',
    status: 'connected',
    lastSync: '2024-02-19T18:30:00Z'
  },
  {
    id: 'ds_google_drive_sheets',
    userId: 'user_analyst',
    name: 'Google Drive Q1 Financial Sheets',
    type: 'google_drive',
    host: 'drive.google.com/finance_2024',
    status: 'syncing',
    lastSync: '2024-02-20T10:00:00Z',
    recordsCount: 8520
  }
];

export class DataSourceModel {
  static async findAll(userId?: string): Promise<IDataSource[]> {
    if (!userId) return mockDataSources;
    return mockDataSources.filter(ds => ds.userId === userId);
  }

  static async create(data: Partial<IDataSource>): Promise<IDataSource> {
    const item: IDataSource = {
      id: `ds_${Date.now()}`,
      userId: data.userId || '',
      name: data.name || 'New Data Source',
      type: data.type || 'postgres',
      host: data.host || '',
      status: 'connected',
      lastSync: new Date().toISOString(),
      recordsCount: Math.floor(1000 + Math.random() * 50000)
    };
    mockDataSources.unshift(item);
    return item;
  }

  static async update(id: string, data: Partial<IDataSource>): Promise<IDataSource | null> {
    const idx = mockDataSources.findIndex(d => d.id === id);
    if (idx === -1) return null;
    mockDataSources[idx] = { ...mockDataSources[idx], ...data, lastSync: new Date().toISOString() };
    return mockDataSources[idx];
  }

  static async delete(id: string): Promise<boolean> {
    const idx = mockDataSources.findIndex(d => d.id === id);
    if (idx === -1) return false;
    mockDataSources.splice(idx, 1);
    return true;
  }
}

// Alerts (USR-ALRT01)
export const mockAlerts: IAlert[] = [
  {
    id: 'alt_1',
    userId: 'user_dev',
    dashboardId: 'db_ecommerce',
    dashboardTitle: 'E-Commerce Global Sales Dashboard',
    title: 'Cảnh báo Doanh thu theo giờ giảm sút',
    metricName: 'Hourly Revenue',
    condition: '<',
    threshold: 5000,
    currentValue: 3420,
    status: 'triggered',
    notifyChannel: 'slack',
    triggeredAt: '2024-02-20T08:15:00Z'
  },
  {
    id: 'alt_2',
    userId: 'user_dev',
    dashboardId: 'db_infrastructure',
    dashboardTitle: 'Cloud Infrastructure & DevOps Metrics',
    title: 'Cảnh báo CPU Quá Tải (>80%)',
    metricName: 'CPU Usage',
    condition: '>=',
    threshold: 80,
    currentValue: 85,
    status: 'triggered',
    notifyChannel: 'email',
    triggeredAt: '2024-02-20T11:30:00Z'
  },
  {
    id: 'alt_3',
    userId: 'user_dev',
    dashboardId: 'db_ecommerce',
    dashboardTitle: 'E-Commerce Global Sales Dashboard',
    title: 'Cảnh báo Tỷ lệ hủy đơn hàng cao (>5%)',
    metricName: 'Order Cancellation Rate',
    condition: '>=',
    threshold: 5,
    currentValue: 2.1,
    status: 'active',
    notifyChannel: 'system'
  }
];

export class AlertModel {
  static async findAll(userId?: string): Promise<IAlert[]> {
    if (!userId) return mockAlerts;
    return mockAlerts.filter(a => a.userId === userId);
  }

  static async create(data: Partial<IAlert>): Promise<IAlert> {
    const item: IAlert = {
      id: `alt_${Date.now()}`,
      userId: data.userId || '',
      dashboardId: data.dashboardId || '',
      dashboardTitle: data.dashboardTitle || 'Dashboard',
      title: data.title || '',
      metricName: data.metricName || 'Metric',
      condition: data.condition || '>=',
      threshold: data.threshold || 0,
      currentValue: data.currentValue || 0,
      status: 'active',
      notifyChannel: data.notifyChannel || 'email'
    };
    mockAlerts.unshift(item);
    return item;
  }

  static async update(id: string, data: Partial<IAlert>): Promise<IAlert | null> {
    const idx = mockAlerts.findIndex(a => a.id === id);
    if (idx === -1) return null;
    mockAlerts[idx] = { ...mockAlerts[idx], ...data };
    return mockAlerts[idx];
  }

  static async delete(id: string): Promise<boolean> {
    const idx = mockAlerts.findIndex(a => a.id === id);
    if (idx === -1) return false;
    mockAlerts.splice(idx, 1);
    return true;
  }
}

// Reports (USR-DBD04, USR-DBD10, USR-DBD09)
export const mockReports: IReport[] = [
  {
    id: 'rep_1',
    userId: 'user_dev',
    dashboardId: 'db_ecommerce',
    dashboardTitle: 'E-Commerce Global Sales Dashboard',
    title: 'Báo Cáo Hiệu Suất Bán Hàng Hàng Tuần',
    schedule: 'weekly',
    format: 'pdf',
    recipientEmail: 'user@dashstack.io',
    lastGeneratedAt: '2024-02-18T00:00:00Z',
    status: 'active'
  },
  {
    id: 'rep_2',
    userId: 'user_dev',
    dashboardId: 'db_infrastructure',
    dashboardTitle: 'Cloud Infrastructure & DevOps Metrics',
    title: 'Báo Cáo Sức Khỏe Máy Chủ Hàng Ngày',
    schedule: 'daily',
    format: 'csv',
    recipientEmail: 'devops@company.com',
    lastGeneratedAt: '2024-02-20T06:00:00Z',
    status: 'active'
  }
];

export class ReportModel {
  static async findAll(userId?: string): Promise<IReport[]> {
    if (!userId) return mockReports;
    return mockReports.filter(r => r.userId === userId);
  }

  static async create(data: Partial<IReport>): Promise<IReport> {
    const item: IReport = {
      id: `rep_${Date.now()}`,
      userId: data.userId || '',
      dashboardId: data.dashboardId || '',
      dashboardTitle: data.dashboardTitle || 'Dashboard',
      title: data.title || '',
      schedule: data.schedule || 'weekly',
      format: data.format || 'pdf',
      recipientEmail: data.recipientEmail || '',
      lastGeneratedAt: new Date().toISOString(),
      status: 'active'
    };
    mockReports.unshift(item);
    return item;
  }

  static async delete(id: string): Promise<boolean> {
    const idx = mockReports.findIndex(r => r.id === id);
    if (idx === -1) return false;
    mockReports.splice(idx, 1);
    return true;
  }
}

// Support Tickets (USR-SPT01, AD-ADM06)
export const mockTickets: ISupportTicket[] = [
  {
    id: 'ticket_1',
    userId: 'user_dev',
    userName: 'Nguyễn Văn Anh',
    userEmail: 'user@dashstack.io',
    subject: 'Hỗ trợ kết nối MongoDB Replica Set trên Kubernetes',
    description: 'Tôi đang gặp lỗi SSL handshake khi kết nối datasource MongoDB qua cluster IP.',
    priority: 'high',
    status: 'in_progress',
    response: 'Đội ngũ kỹ sư Dashstack đang kiểm tra cert CA của bạn. Sẽ phản hồi trong 2 giờ.',
    createdAt: '2024-02-19T14:00:00Z'
  },
  {
    id: 'ticket_2',
    userId: 'user_analyst',
    userName: 'Trần Thị Mai',
    userEmail: 'mai.tran@company.com',
    subject: 'Yêu cầu nâng cấp gói Enterprise',
    description: 'Team của tôi muốn tăng giới hạn số lượng dashboard từ 10 lên không giới hạn.',
    priority: 'medium',
    status: 'resolved',
    response: 'Đã kích hoạt gói Enterprise 14 ngày dùng thử miễn phí cho tài khoản của bạn.',
    createdAt: '2024-02-15T09:30:00Z'
  }
];

export class SupportModel {
  static async findAll(userId?: string): Promise<ISupportTicket[]> {
    if (!userId) return mockTickets;
    return mockTickets.filter(t => t.userId === userId);
  }

  static async create(data: Partial<ISupportTicket>): Promise<ISupportTicket> {
    const item: ISupportTicket = {
      id: `ticket_${Date.now()}`,
      userId: data.userId || '',
      userName: data.userName || 'User',
      userEmail: data.userEmail || '',
      subject: data.subject || '',
      description: data.description || '',
      priority: data.priority || 'medium',
      status: 'open',
      createdAt: new Date().toISOString()
    };
    mockTickets.unshift(item);
    return item;
  }

  static async update(id: string, data: Partial<ISupportTicket>): Promise<ISupportTicket | null> {
    const idx = mockTickets.findIndex(t => t.id === id);
    if (idx === -1) return null;
    mockTickets[idx] = { ...mockTickets[idx], ...data };
    return mockTickets[idx];
  }
}
