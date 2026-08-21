const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('dashstack_token');
export const setAuthToken = (token: string) => localStorage.setItem('dashstack_token', token);
export const removeAuthToken = () => localStorage.removeItem('dashstack_token');

export const getDemoUserId = () => localStorage.getItem('dashstack_demo_user_id');
export const setDemoUserId = (id: string) => localStorage.setItem('dashstack_demo_user_id', id);

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; message?: string; count?: number; downloadUrl?: string }> {
  const token = getAuthToken();
  const demoUserId = getDemoUserId();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(demoUserId ? { 'x-user-id': demoUserId } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || 'Đã xảy ra lỗi' };
    }
    return data;
  } catch (error: any) {
    return { success: false, message: error.message || 'Lỗi kết nối máy chủ API' };
  }
}

export const api = {
  // Auth
  register: (body: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request<any>('/auth/me'),

  // User
  getProfile: () => request<any>('/users/profile'),
  updateProfile: (body: any) => request<any>('/users/profile', { method: 'PUT', body: JSON.stringify(body) }),
  getApiKeys: () => request<any>('/users/api-keys'),
  createApiKey: (body: any) => request<any>('/users/api-keys', { method: 'POST', body: JSON.stringify(body) }),

  // Dashboards
  getDashboards: () => request<any>('/dashboards'),
  getDashboardById: (id: string) => request<any>(`/dashboards/${id}`),
  createDashboard: (body: any) => request<any>('/dashboards', { method: 'POST', body: JSON.stringify(body) }),
  updateDashboard: (id: string, body: any) => request<any>(`/dashboards/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteDashboard: (id: string) => request<any>(`/dashboards/${id}`, { method: 'DELETE' }),
  shareDashboard: (id: string, body: any) => request<any>(`/dashboards/${id}/share`, { method: 'POST', body: JSON.stringify(body) }),
  getDashboardHistory: (id: string) => request<any>(`/dashboards/${id}/history`),
  exportDashboardData: (id: string, format = 'json') => request<any>(`/dashboards/${id}/export?format=${format}`),

  // Widgets
  createWidget: (dashboardId: string, body: any) => request<any>(`/dashboards/${dashboardId}/widgets`, { method: 'POST', body: JSON.stringify(body) }),
  updateWidget: (widgetId: string, body: any) => request<any>(`/dashboards/widgets/${widgetId}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteWidget: (widgetId: string) => request<any>(`/dashboards/widgets/${widgetId}`, { method: 'DELETE' }),

  // Data Sources
  getDataSources: () => request<any>('/datasources'),
  createDataSource: (body: any) => request<any>('/datasources', { method: 'POST', body: JSON.stringify(body) }),
  updateDataSource: (id: string, body: any) => request<any>(`/datasources/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteDataSource: (id: string) => request<any>(`/datasources/${id}`, { method: 'DELETE' }),

  // Alerts
  getAlerts: () => request<any>('/alerts'),
  createAlert: (body: any) => request<any>('/alerts', { method: 'POST', body: JSON.stringify(body) }),
  updateAlert: (id: string, body: any) => request<any>(`/alerts/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteAlert: (id: string) => request<any>(`/alerts/${id}`, { method: 'DELETE' }),

  // Reports
  getReports: () => request<any>('/reports'),
  createReport: (body: any) => request<any>('/reports', { method: 'POST', body: JSON.stringify(body) }),
  deleteReport: (id: string) => request<any>(`/reports/${id}`, { method: 'DELETE' }),

  // Support
  getSupportTickets: () => request<any>('/support'),
  createSupportTicket: (body: any) => request<any>('/support', { method: 'POST', body: JSON.stringify(body) }),
  updateSupportTicket: (id: string, body: any) => request<any>(`/support/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  // Admin
  getAdminOverview: () => request<any>('/admin/overview'),
  getAdminUsers: () => request<any>('/admin/users'),
  createAdminUser: (body: any) => request<any>('/admin/users', { method: 'POST', body: JSON.stringify(body) }),
  updateAdminUser: (id: string, body: any) => request<any>(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteAdminUser: (id: string) => request<any>(`/admin/users/${id}`, { method: 'DELETE' }),
  getAdminDashboards: () => request<any>('/admin/dashboards'),
  getAdminNotifications: () => request<any>('/admin/notifications'),
  broadcastAdminNotification: (body: any) => request<any>('/admin/notifications', { method: 'POST', body: JSON.stringify(body) }),
  getAdminSecurity: () => request<any>('/admin/security'),
  updateAdminSecurity: (body: any) => request<any>('/admin/security', { method: 'PUT', body: JSON.stringify(body) }),
  getAdminApiKeys: () => request<any>('/admin/api-keys'),
  revokeAdminApiKey: (id: string) => request<any>(`/admin/api-keys/${id}/revoke`, { method: 'PUT' }),
  getAdminSystemLogs: () => request<any>('/admin/system-logs'),
  getAdminEventLogs: () => request<any>('/admin/event-logs'),
  getAdminPayments: () => request<any>('/admin/payments'),
  updateAdminPayment: (id: string, body: any) => request<any>(`/admin/payments/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  getAdminPackages: () => request<any>('/admin/packages'),
  updateAdminPackage: (id: string, body: any) => request<any>(`/admin/packages/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  getAdminSessions: () => request<any>('/admin/sessions'),
  terminateAdminSession: (id: string) => request<any>(`/admin/sessions/${id}`, { method: 'DELETE' }),
  getAdminBackups: () => request<any>('/admin/backups'),
  createAdminBackup: (body: any) => request<any>('/admin/backups', { method: 'POST', body: JSON.stringify(body) })
};
