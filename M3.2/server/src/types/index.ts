export type UserRole = 'admin' | 'user';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  packageId?: string;
  status: 'active' | 'blocked';
  createdAt: string;
}

export interface IDashboardShare {
  email: string;
  role: 'viewer' | 'editor';
}

export interface IDashboardChangeHistory {
  id: string;
  dashboardId: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
}

export interface IDashboard {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  category: string;
  layout: 'grid' | 'flex' | 'compact';
  theme: 'dark' | 'light' | 'indigo';
  isPublic: boolean;
  isShared: boolean;
  sharedWith: IDashboardShare[];
  widgetsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IWidget {
  id: string;
  dashboardId: string;
  title: string;
  type: 'metric' | 'line' | 'bar' | 'donut' | 'area' | 'table';
  dataSourceId?: string;
  config: {
    metricLabel?: string;
    metricValue?: string | number;
    metricChange?: string;
    isPositive?: boolean;
    color?: string;
    chartLabels?: string[];
    chartData?: number[];
    chartSecondaryData?: number[];
    tableColumns?: string[];
    tableRows?: any[];
  };
  size: 'small' | 'medium' | 'large' | 'full';
  order: number;
}

export interface IDataSource {
  id: string;
  userId: string;
  name: string;
  type: 'postgres' | 'mysql' | 'rest_api' | 'csv' | 'firebase' | 'mongodb' | 'slack' | 'google_drive' | 'zapier';
  host?: string;
  status: 'connected' | 'error' | 'syncing';
  lastSync: string;
  recordsCount?: number;
}

export interface IAlert {
  id: string;
  userId: string;
  dashboardId: string;
  dashboardTitle?: string;
  title: string;
  metricName: string;
  condition: '>' | '<' | '==' | '>=' | '<=';
  threshold: number;
  currentValue: number;
  status: 'active' | 'triggered' | 'muted';
  notifyChannel: 'email' | 'slack' | 'system';
  triggeredAt?: string;
}

export interface IReport {
  id: string;
  userId: string;
  dashboardId: string;
  dashboardTitle?: string;
  title: string;
  schedule: 'daily' | 'weekly' | 'monthly' | 'manual';
  format: 'pdf' | 'csv' | 'json';
  recipientEmail: string;
  lastGeneratedAt: string;
  status: 'active' | 'paused';
}

export interface ISupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  response?: string;
  createdAt: string;
}

export interface ISystemLog {
  id: string;
  level: 'info' | 'warn' | 'error';
  module: string;
  message: string;
  ip: string;
  timestamp: string;
}

export interface IEventLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  ip: string;
  timestamp: string;
}

export interface IBackup {
  id: string;
  filename: string;
  size: string;
  type: 'full' | 'incremental';
  status: 'completed' | 'running' | 'failed';
  createdAt: string;
}

export interface IPaymentAccount {
  id: string;
  provider: 'stripe' | 'momo' | 'vnpay' | 'paypal';
  accountName: string;
  status: 'active' | 'inactive';
  apiKeyMasked: string;
  transactionCount: number;
  totalProcessed: number;
}

export interface IServicePackage {
  id: string;
  name: 'Free' | 'Pro' | 'Enterprise';
  price: number;
  maxDashboards: number;
  maxDataSources: number;
  refreshRate: string;
  features: string[];
  isPopular?: boolean;
}

export interface IApiKey {
  id: string;
  userId: string;
  name: string;
  keyMasked: string;
  rateLimit: number; // req/min
  status: 'active' | 'revoked';
  lastUsedAt: string;
  createdAt: string;
}

export interface IActiveSession {
  id: string;
  userId: string;
  userName: string;
  ip: string;
  device: string;
  browser: string;
  loginTime: string;
  lastActive: string;
  isCurrent?: boolean;
}
