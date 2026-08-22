const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('cryptoplanet_token');
export const setAuthToken = (token: string) => localStorage.setItem('cryptoplanet_token', token);
export const removeAuthToken = () => localStorage.removeItem('cryptoplanet_token');

export const getDemoUserId = () => localStorage.getItem('cryptoplanet_demo_user_id');
export const setDemoUserId = (id: string) => localStorage.setItem('cryptoplanet_demo_user_id', id);

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; message?: string; count?: number }> {
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
  updateProfile: (body: any) => request<any>('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),

  // Market
  getCoins: () => request<any>('/market/coins'),
  getPairs: () => request<any>('/market/pairs'),
  getPairDetail: (symbol: string) => request<any>(`/market/pairs/${symbol}`),
  getOrderBook: (symbol: string) => request<any>(`/market/orderbook?symbol=${symbol}`),
  getCandles: (symbol: string) => request<any>(`/market/candles?symbol=${symbol}`),
  getRecentTrades: (symbol: string) => request<any>(`/market/trades?symbol=${symbol}`),

  // Trading
  placeOrder: (body: any) => request<any>('/trading/order', { method: 'POST', body: JSON.stringify(body) }),
  cancelOrder: (id: string) => request<any>(`/trading/order/${id}`, { method: 'DELETE' }),
  swapCrypto: (body: any) => request<any>('/trading/swap', { method: 'POST', body: JSON.stringify(body) }),
  getMyOrders: () => request<any>('/trading/my-orders'),

  // Wallet
  getBalances: () => request<any>('/wallet/balances'),
  deposit: (body: any) => request<any>('/wallet/deposit', { method: 'POST', body: JSON.stringify(body) }),
  withdraw: (body: any) => request<any>('/wallet/withdraw', { method: 'POST', body: JSON.stringify(body) }),
  getTransactions: () => request<any>('/wallet/transactions'),

  // Alerts
  getAlerts: () => request<any>('/alerts'),
  createAlert: (body: any) => request<any>('/alerts', { method: 'POST', body: JSON.stringify(body) }),
  deleteAlert: (id: string) => request<any>(`/alerts/${id}`, { method: 'DELETE' }),

  // Promotions
  getPromotions: () => request<any>('/promotions'),
  createPromotion: (body: any) => request<any>('/promotions', { method: 'POST', body: JSON.stringify(body) }),
  updatePromotion: (id: string, body: any) => request<any>(`/promotions/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePromotion: (id: string) => request<any>(`/promotions/${id}`, { method: 'DELETE' }),

  // Support
  getSupportTickets: () => request<any>('/support'),
  createSupportTicket: (body: any) => request<any>('/support', { method: 'POST', body: JSON.stringify(body) }),
  replySupportTicket: (id: string, body: any) => request<any>(`/support/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  // Admin
  getAdminOverview: () => request<any>('/admin/overview'),
  getAdminUsers: () => request<any>('/admin/users'),
  createAdminUser: (body: any) => request<any>('/admin/users', { method: 'POST', body: JSON.stringify(body) }),
  updateAdminUser: (id: string, body: any) => request<any>(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteAdminUser: (id: string) => request<any>(`/admin/users/${id}`, { method: 'DELETE' }),
  getAdminOrders: () => request<any>('/admin/orders'),
  getAdminReserves: () => request<any>('/admin/reserves'),
  createAdminPair: (body: any) => request<any>('/admin/pairs', { method: 'POST', body: JSON.stringify(body) }),
  updateAdminPair: (id: string, body: any) => request<any>(`/admin/pairs/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteAdminPair: (id: string) => request<any>(`/admin/pairs/${id}`, { method: 'DELETE' }),
  getAdminNotifications: () => request<any>('/admin/notifications'),
  broadcastAdminNotification: (body: any) => request<any>('/admin/notifications', { method: 'POST', body: JSON.stringify(body) }),
  getAdminLogs: () => request<any>('/admin/logs'),
  getAdminApiKeys: () => request<any>('/admin/api-keys'),
  createAdminApiKey: (body: any) => request<any>('/admin/api-keys', { method: 'POST', body: JSON.stringify(body) }),
  revokeAdminApiKey: (id: string) => request<any>(`/admin/api-keys/${id}/revoke`, { method: 'PUT' })
};
