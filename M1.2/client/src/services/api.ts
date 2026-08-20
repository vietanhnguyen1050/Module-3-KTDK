const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('edupress_token');
export const setAuthToken = (token: string) => localStorage.setItem('edupress_token', token);
export const removeAuthToken = () => localStorage.removeItem('edupress_token');

export const getDemoUserId = () => localStorage.getItem('edupress_demo_user_id');
export const setDemoUserId = (id: string) => localStorage.setItem('edupress_demo_user_id', id);

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
    return { success: false, message: error.message || 'Lỗi kết nối máy chủ' };
  }
}

export const api = {
  // Auth
  register: (body: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  forgotPassword: (body: any) => request<any>('/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request<any>('/auth/me'),

  // User
  getProfile: () => request<any>('/users/profile'),
  updateProfile: (body: any) => request<any>('/users/profile', { method: 'PUT', body: JSON.stringify(body) }),
  requestDeleteAccount: (body: any) => request<any>('/users/delete-request', { method: 'POST', body: JSON.stringify(body) }),
  getNotifications: () => request<any>('/users/notifications'),
  registerProvider: (body: any) => request<any>('/users/register-provider', { method: 'POST', body: JSON.stringify(body) }),
  getEnrolledCourses: () => request<any>('/users/enrolled-courses'),
  updateLessonProgress: (body: any) => request<any>('/users/progress', { method: 'POST', body: JSON.stringify(body) }),

  // Courses
  getCourses: (params?: { search?: string; category?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    return request<any>(`/courses?${query.toString()}`);
  },
  getCourseDetail: (id: string) => request<any>(`/courses/${id}`),
  enrollCourse: (id: string, body: { discountCode?: string; paymentMethod?: string }) => 
    request<any>(`/courses/${id}/enroll`, { method: 'POST', body: JSON.stringify(body) }),
  getCourseLessons: (id: string) => request<any>(`/courses/${id}/lessons`),
  addCourseReview: (id: string, body: { rating: number; comment: string }) =>
    request<any>(`/courses/${id}/reviews`, { method: 'POST', body: JSON.stringify(body) }),

  // Provider
  getMyCourses: () => request<any>('/provider/courses'),
  createCourse: (body: any) => request<any>('/provider/courses', { method: 'POST', body: JSON.stringify(body) }),
  updateCourse: (id: string, body: any) => request<any>(`/provider/courses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCourse: (id: string) => request<any>(`/provider/courses/${id}`, { method: 'DELETE' }),

  getProviderLessons: (courseId: string) => request<any>(`/provider/courses/${courseId}/lessons`),
  createLesson: (courseId: string, body: any) => request<any>(`/provider/courses/${courseId}/lessons`, { method: 'POST', body: JSON.stringify(body) }),
  updateLesson: (lessonId: string, body: any) => request<any>(`/provider/lessons/${lessonId}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteLesson: (lessonId: string) => request<any>(`/provider/lessons/${lessonId}`, { method: 'DELETE' }),

  getDiscounts: () => request<any>('/provider/discounts'),
  createDiscount: (body: any) => request<any>('/provider/discounts', { method: 'POST', body: JSON.stringify(body) }),
  updateDiscount: (id: string, body: any) => request<any>(`/provider/discounts/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteDiscount: (id: string) => request<any>(`/provider/discounts/${id}`, { method: 'DELETE' }),

  getPromotions: () => request<any>('/provider/promotions'),
  createPromotion: (body: any) => request<any>('/provider/promotions', { method: 'POST', body: JSON.stringify(body) }),
  updatePromotion: (id: string, body: any) => request<any>(`/provider/promotions/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePromotion: (id: string) => request<any>(`/provider/promotions/${id}`, { method: 'DELETE' }),

  getGifts: () => request<any>('/provider/gifts'),
  createGift: (body: any) => request<any>('/provider/gifts', { method: 'POST', body: JSON.stringify(body) }),
  updateGift: (id: string, body: any) => request<any>(`/provider/gifts/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteGift: (id: string) => request<any>(`/provider/gifts/${id}`, { method: 'DELETE' }),

  getProviderRevenue: () => request<any>('/provider/revenue'),

  // Admin
  getAdminProviders: () => request<any>('/admin/providers'),
  approveProvider: (id: string, action: 'approve' | 'reject' | 'toggle_status') =>
    request<any>(`/admin/providers/${id}/approve`, { method: 'PUT', body: JSON.stringify({ action }) }),
  getAdminNCCReviews: () => request<any>('/admin/ncc-reviews'),
  getAdminCourses: () => request<any>('/admin/courses'),
  approveCourse: (id: string, status: string) =>
    request<any>(`/admin/courses/${id}/approve`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getAdminCourseContent: (id: string) => request<any>(`/admin/courses/${id}/content`),
  getAdminCustomers: () => request<any>('/admin/customers'),
  toggleCustomerStatus: (id: string) => request<any>(`/admin/customers/${id}/toggle-status`, { method: 'PUT' }),
  getAdminPayments: () => request<any>('/admin/payments'),
  getAdminOverview: () => request<any>('/admin/overview'),
  broadcastNotification: (body: any) => request<any>('/admin/broadcast', { method: 'POST', body: JSON.stringify(body) }),
  getAdminFinancials: () => request<any>('/admin/financials'),
  getAdminAccessControl: () => request<any>('/admin/access-control'),
};
