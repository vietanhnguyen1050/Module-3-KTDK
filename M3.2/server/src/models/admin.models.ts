import {
  ISystemLog, IEventLog, IBackup, IPaymentAccount,
  IServicePackage, IApiKey, IActiveSession
} from '../types';

// System Logs (AD-ADM10)
export const mockSystemLogs: ISystemLog[] = [
  { id: 'log_1', level: 'info', module: 'AuthService', message: 'User user@dashstack.io logged in successfully', ip: '113.190.234.12', timestamp: '2024-02-20T14:30:00Z' },
  { id: 'log_2', level: 'warn', module: 'DataSync', message: 'PostgreSQL Datasource sync took > 4200ms', ip: '10.0.4.15', timestamp: '2024-02-20T14:25:00Z' },
  { id: 'log_3', level: 'error', module: 'WebhookManager', message: 'Slack Webhook returned HTTP 429 Too Many Requests', ip: '10.0.2.88', timestamp: '2024-02-20T14:10:00Z' },
  { id: 'log_4', level: 'info', module: 'BackupWorker', message: 'Automated DB snapshot backup completed (124 MB)', ip: '10.0.1.2', timestamp: '2024-02-20T03:00:00Z' }
];

// Event Logs (AD-ADM14)
export const mockEventLogs: IEventLog[] = [
  { id: 'evt_1', userId: 'user_dev', userName: 'Nguyễn Văn Anh', action: 'CREATE_DASHBOARD', target: 'E-Commerce Global Sales Dashboard', ip: '113.190.234.12', timestamp: '2024-02-20T13:45:00Z' },
  { id: 'evt_2', userId: 'user_admin', userName: 'Admin', action: 'UPDATE_SECURITY_POLICY', target: 'Enforce 2FA for all Users', ip: '14.232.18.99', timestamp: '2024-02-20T12:00:00Z' },
  { id: 'evt_3', userId: 'user_analyst', userName: 'Trần Thị Mai', action: 'EXPORT_DATA', target: 'Marketing Funnel (CSV)', ip: '118.70.124.5', timestamp: '2024-02-20T11:15:00Z' }
];

// Backups (AD-ADM15)
export const mockBackups: IBackup[] = [
  { id: 'bak_1', filename: 'dashstack_prod_db_20240220_0300.sql.gz', size: '124.5 MB', type: 'full', status: 'completed', createdAt: '2024-02-20T03:00:00Z' },
  { id: 'bak_2', filename: 'dashstack_prod_db_20240219_0300.sql.gz', size: '121.2 MB', type: 'full', status: 'completed', createdAt: '2024-02-19T03:00:00Z' },
  { id: 'bak_3', filename: 'dashstack_diff_backup_20240218.dump', size: '34.8 MB', type: 'incremental', status: 'completed', createdAt: '2024-02-18T12:00:00Z' }
];

// Payment Accounts (AD-ADM11)
export const mockPaymentAccounts: IPaymentAccount[] = [
  { id: 'pay_stripe', provider: 'stripe', accountName: 'Dashstack Global Inc (Stripe USD)', status: 'active', apiKeyMasked: 'sk_live_51Mv...8x9Q', transactionCount: 1420, totalProcessed: 142850 },
  { id: 'pay_momo', provider: 'momo', accountName: 'Dashstack VN Payment Hub (MoMo VND)', status: 'active', apiKeyMasked: 'MOMO_PARTNER_...8821', transactionCount: 890, totalProcessed: 45000000 },
  { id: 'pay_vnpay', provider: 'vnpay', accountName: 'VNPAY Merchant Gateway', status: 'active', apiKeyMasked: 'VNP_HASH_...9912', transactionCount: 520, totalProcessed: 28500000 },
  { id: 'pay_paypal', provider: 'paypal', accountName: 'Dashstack Express Checkout', status: 'inactive', apiKeyMasked: 'PAYPAL_CLIENT_...001', transactionCount: 110, totalProcessed: 8900 }
];

// Service Packages (AD-ADM12)
export const mockServicePackages: IServicePackage[] = [
  {
    id: 'pkg_free',
    name: 'Free',
    price: 0,
    maxDashboards: 3,
    maxDataSources: 2,
    refreshRate: '15 phút',
    features: ['3 Bảng điều khiển', '2 Nguồn dữ liệu', 'Xuất dữ liệu CSV', 'Hỗ trợ qua cộng đồng'],
    isPopular: false
  },
  {
    id: 'pkg_pro',
    name: 'Pro',
    price: 29,
    maxDashboards: 15,
    maxDataSources: 10,
    refreshRate: '1 phút (Realtime)',
    features: ['15 Bảng điều khiển', '10 Nguồn dữ liệu', 'Cảnh báo Slack & Email', 'Tự động gửi báo cáo', 'Hỗ trợ ưu tiên 24/7'],
    isPopular: true
  },
  {
    id: 'pkg_enterprise',
    name: 'Enterprise',
    price: 99,
    maxDashboards: 999,
    maxDataSources: 999,
    refreshRate: 'Tức thời (Sub-second)',
    features: ['Không giới hạn Dashboard & Data Sources', 'API Keys không giới hạn', 'Dedicated Database', 'Custom Domain & SSO / SAML', 'SLA 99.99%'],
    isPopular: false
  }
];

// API Keys (AD-ADM09)
export const mockApiKeys: IApiKey[] = [
  { id: 'key_1', userId: 'user_dev', name: 'Server Backend Sync Key', keyMasked: 'dsk_live_9f8a...3b21', rateLimit: 600, status: 'active', lastUsedAt: '2024-02-20T14:30:00Z', createdAt: '2024-01-10T00:00:00Z' },
  { id: 'key_2', userId: 'user_dev', name: 'Zapier Webhook Key', keyMasked: 'dsk_live_11ab...77ef', rateLimit: 120, status: 'active', lastUsedAt: '2024-02-19T08:15:00Z', createdAt: '2024-02-01T00:00:00Z' }
];

// Active Sessions (AD-ADM13)
export const mockActiveSessions: IActiveSession[] = [
  { id: 'sess_1', userId: 'user_dev', userName: 'Nguyễn Văn Anh', ip: '113.190.234.12', device: 'MacBook Pro 16" (macOS)', browser: 'Chrome 122.0', loginTime: '2024-02-20T08:00:00Z', lastActive: 'Vừa xong', isCurrent: true },
  { id: 'sess_2', userId: 'user_dev', userName: 'Nguyễn Văn Anh', ip: '14.232.18.5', device: 'iPhone 15 Pro (iOS)', browser: 'Safari Mobile', loginTime: '2024-02-19T20:15:00Z', lastActive: '12 giờ trước', isCurrent: false },
  { id: 'sess_3', userId: 'user_analyst', userName: 'Trần Thị Mai', ip: '118.70.124.5', device: 'Dell XPS 15 (Windows 11)', browser: 'Chrome 122.0', loginTime: '2024-02-20T09:00:00Z', lastActive: '5 phút trước', isCurrent: false }
];

// Admin Notifications (AD-ADM05)
export const mockAdminNotifications: any[] = [
  { id: 'notif_1', title: 'Bảo trì máy chủ định kỳ', message: 'Hệ thống Dashstack sẽ tiến hành nâng cấp Database trong 15 phút vào 03:00 sáng ngày 25/02.', target: 'all', createdAt: '2024-02-20T10:00:00Z' }
];

export class AdminDataModel {
  static getSystemLogs() { return mockSystemLogs; }
  static getEventLogs() { return mockEventLogs; }
  static getBackups() { return mockBackups; }
  static createBackup(type: 'full' | 'incremental' = 'full') {
    const b: IBackup = {
      id: `bak_${Date.now()}`,
      filename: `dashstack_manual_backup_${new Date().toISOString().slice(0,10)}.sql.gz`,
      size: '128.4 MB',
      type,
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    mockBackups.unshift(b);
    return b;
  }
  static getPaymentAccounts() { return mockPaymentAccounts; }
  static updatePaymentAccount(id: string, data: Partial<IPaymentAccount>) {
    const idx = mockPaymentAccounts.findIndex(p => p.id === id);
    if (idx !== -1) mockPaymentAccounts[idx] = { ...mockPaymentAccounts[idx], ...data };
    return mockPaymentAccounts[idx];
  }
  static getServicePackages() { return mockServicePackages; }
  static updatePackage(id: string, data: Partial<IServicePackage>) {
    const idx = mockServicePackages.findIndex(p => p.id === id);
    if (idx !== -1) mockServicePackages[idx] = { ...mockServicePackages[idx], ...data };
    return mockServicePackages[idx];
  }
  static getApiKeys(userId?: string) {
    if (!userId) return mockApiKeys;
    return mockApiKeys.filter(k => k.userId === userId);
  }
  static createApiKey(data: Partial<IApiKey>) {
    const k: IApiKey = {
      id: `key_${Date.now()}`,
      userId: data.userId || 'user_dev',
      name: data.name || 'Default API Key',
      keyMasked: `dsk_live_${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
      rateLimit: data.rateLimit || 300,
      status: 'active',
      lastUsedAt: 'Chưa sử dụng',
      createdAt: new Date().toISOString()
    };
    mockApiKeys.unshift(k);
    return k;
  }
  static revokeApiKey(id: string) {
    const idx = mockApiKeys.findIndex(k => k.id === id);
    if (idx !== -1) mockApiKeys[idx].status = 'revoked';
    return mockApiKeys[idx];
  }
  static getActiveSessions() { return mockActiveSessions; }
  static terminateSession(id: string) {
    const idx = mockActiveSessions.findIndex(s => s.id === id);
    if (idx !== -1) mockActiveSessions.splice(idx, 1);
    return true;
  }
  static getNotifications() { return mockAdminNotifications; }
  static broadcastNotification(title: string, message: string, target = 'all') {
    const n = { id: `notif_${Date.now()}`, title, message, target, createdAt: new Date().toISOString() };
    mockAdminNotifications.unshift(n);
    return n;
  }
}
