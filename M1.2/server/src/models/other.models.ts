import { IDiscountCode, IPromotion, IGift, IPayment, INotification } from '../types';

// Discounts
export const mockDiscounts: IDiscountCode[] = [
  {
    id: 'disc_1',
    providerId: 'user_provider_1',
    code: 'EDUPRESS2024',
    discountPercent: 20,
    maxUses: 100,
    usedCount: 34,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true
  },
  {
    id: 'disc_2',
    providerId: 'user_provider_1',
    courseId: 'course_1',
    code: 'REACT50',
    discountPercent: 50,
    maxUses: 20,
    usedCount: 20,
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    isActive: false
  }
];

export class DiscountModel {
  static async findByProvider(providerId: string): Promise<IDiscountCode[]> {
    return mockDiscounts.filter(d => d.providerId === providerId);
  }

  static async findByCode(code: string): Promise<IDiscountCode | undefined> {
    return mockDiscounts.find(d => d.code.toUpperCase() === code.toUpperCase() && d.isActive);
  }

  static async create(data: Partial<IDiscountCode>): Promise<IDiscountCode> {
    const item: IDiscountCode = {
      id: `disc_${Date.now()}`,
      providerId: data.providerId || '',
      courseId: data.courseId,
      code: data.code?.toUpperCase() || `CODE${Date.now()}`,
      discountPercent: data.discountPercent || 10,
      maxUses: data.maxUses || 50,
      usedCount: 0,
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || '2025-12-31',
      isActive: true
    };
    mockDiscounts.push(item);
    return item;
  }

  static async update(id: string, data: Partial<IDiscountCode>): Promise<IDiscountCode | null> {
    const idx = mockDiscounts.findIndex(d => d.id === id);
    if (idx === -1) return null;
    mockDiscounts[idx] = { ...mockDiscounts[idx], ...data };
    return mockDiscounts[idx];
  }

  static async delete(id: string): Promise<boolean> {
    const idx = mockDiscounts.findIndex(d => d.id === id);
    if (idx === -1) return false;
    mockDiscounts.splice(idx, 1);
    return true;
  }
}

// Promotions
export const mockPromotions: IPromotion[] = [
  {
    id: 'promo_1',
    providerId: 'user_provider_1',
    courseId: 'course_1',
    title: 'Flash Sale Khai Xuân 2024 - Giảm 40%',
    type: 'time_based',
    discountValue: 40,
    startTime: '2024-02-10T00:00:00Z',
    endTime: '2024-03-31T23:59:59Z',
    status: 'active'
  },
  {
    id: 'promo_2',
    providerId: 'user_provider_1',
    courseId: 'course_2',
    title: 'Ưu đãi 50 suất đăng ký đầu tiên',
    type: 'quantity_based',
    discountValue: 35,
    targetQuantity: 50,
    currentRegistrations: 38,
    startTime: '2024-01-01T00:00:00Z',
    endTime: '2024-06-30T23:59:59Z',
    status: 'active'
  }
];

export class PromotionModel {
  static async findByProvider(providerId: string): Promise<IPromotion[]> {
    return mockPromotions.filter(p => p.providerId === providerId);
  }

  static async create(data: Partial<IPromotion>): Promise<IPromotion> {
    const item: IPromotion = {
      id: `promo_${Date.now()}`,
      providerId: data.providerId || '',
      courseId: data.courseId || '',
      title: data.title || '',
      type: data.type || 'time_based',
      discountValue: data.discountValue || 10,
      targetQuantity: data.targetQuantity,
      currentRegistrations: 0,
      startTime: data.startTime || new Date().toISOString(),
      endTime: data.endTime || '2025-12-31T23:59:59Z',
      status: 'active'
    };
    mockPromotions.push(item);
    return item;
  }

  static async update(id: string, data: Partial<IPromotion>): Promise<IPromotion | null> {
    const idx = mockPromotions.findIndex(p => p.id === id);
    if (idx === -1) return null;
    mockPromotions[idx] = { ...mockPromotions[idx], ...data };
    return mockPromotions[idx];
  }

  static async delete(id: string): Promise<boolean> {
    const idx = mockPromotions.findIndex(p => p.id === id);
    if (idx === -1) return false;
    mockPromotions.splice(idx, 1);
    return true;
  }
}

// Gifts
export const mockGifts: IGift[] = [
  {
    id: 'gift_1',
    providerId: 'user_provider_1',
    courseId: 'course_1',
    giftName: 'Ebook: 100 Câu hỏi phỏng vấn React & Node.js',
    giftDescription: 'Bộ tài liệu chuẩn ôn luyện phỏng vấn Web Fullstack do Senior Engineer biên soạn.',
    giftType: 'ebook',
    quantity: 200,
    remainingQuantity: 142
  },
  {
    id: 'gift_2',
    providerId: 'user_provider_1',
    courseId: 'course_1',
    giftName: 'Source code 5 dự án thực chiến chuẩn Production',
    giftDescription: 'Mã nguồn hoàn chỉnh 5 dự án E-Commerce, Chat App, LMS, Booking và Blog.',
    giftType: 'source_code',
    quantity: 100,
    remainingQuantity: 42
  }
];

export class GiftModel {
  static async findByProvider(providerId: string): Promise<IGift[]> {
    return mockGifts.filter(g => g.providerId === providerId);
  }

  static async create(data: Partial<IGift>): Promise<IGift> {
    const item: IGift = {
      id: `gift_${Date.now()}`,
      providerId: data.providerId || '',
      courseId: data.courseId || '',
      giftName: data.giftName || '',
      giftDescription: data.giftDescription || '',
      giftType: data.giftType || 'ebook',
      quantity: data.quantity || 50,
      remainingQuantity: data.quantity || 50
    };
    mockGifts.push(item);
    return item;
  }

  static async update(id: string, data: Partial<IGift>): Promise<IGift | null> {
    const idx = mockGifts.findIndex(g => g.id === id);
    if (idx === -1) return null;
    mockGifts[idx] = { ...mockGifts[idx], ...data };
    return mockGifts[idx];
  }

  static async delete(id: string): Promise<boolean> {
    const idx = mockGifts.findIndex(g => g.id === id);
    if (idx === -1) return false;
    mockGifts.splice(idx, 1);
    return true;
  }
}

// Payments
export const mockPayments: IPayment[] = [
  {
    id: 'pay_1',
    userId: 'user_customer_1',
    userName: 'Nguyễn Văn Anh',
    userEmail: 'student@edupress.com',
    courseId: 'course_1',
    courseTitle: 'Lập trình Web Fullstack với React & Node.js',
    providerId: 'user_provider_1',
    amount: 1499000,
    status: 'completed',
    paymentMethod: 'momo',
    createdAt: '2024-02-11T10:00:00Z'
  },
  {
    id: 'pay_2',
    userId: 'user_customer_1',
    userName: 'Nguyễn Văn Anh',
    userEmail: 'student@edupress.com',
    courseId: 'course_2',
    courseTitle: 'HTML, CSS & JavaScript Chuyên Sâu Cho Người Mới',
    providerId: 'user_provider_1',
    amount: 799000,
    status: 'completed',
    paymentMethod: 'vnpay',
    createdAt: '2024-02-14T08:30:00Z'
  }
];

export class PaymentModel {
  static async findAll(): Promise<IPayment[]> {
    return mockPayments;
  }

  static async findByProvider(providerId: string): Promise<IPayment[]> {
    return mockPayments.filter(p => p.providerId === providerId);
  }

  static async create(data: Partial<IPayment>): Promise<IPayment> {
    const item: IPayment = {
      id: `pay_${Date.now()}`,
      userId: data.userId || '',
      userName: data.userName || '',
      userEmail: data.userEmail || '',
      courseId: data.courseId || '',
      courseTitle: data.courseTitle || '',
      providerId: data.providerId || '',
      amount: data.amount || 0,
      status: 'completed',
      paymentMethod: data.paymentMethod || 'momo',
      createdAt: new Date().toISOString()
    };
    mockPayments.push(item);
    return item;
  }
}

// Notifications
export const mockNotifications: INotification[] = [
  {
    id: 'notif_1',
    targetRole: 'all',
    title: 'Chào mừng bạn đến với Edupress!',
    message: 'Nền tảng học trực tuyến hàng đầu với hàng trăm khóa học ưu đãi hấp dẫn.',
    type: 'system',
    isRead: false,
    createdAt: '2024-02-01T08:00:00Z'
  },
  {
    id: 'notif_2',
    targetUserId: 'user_customer_1',
    title: 'Thanh toán thành công khóa học React & Node.js',
    message: 'Bạn đã đăng ký thành công khóa học. Hãy bắt đầu bài học đầu tiên ngay!',
    type: 'payment',
    isRead: true,
    createdAt: '2024-02-11T10:01:00Z'
  },
  {
    id: 'notif_3',
    targetRole: 'provider',
    title: 'Khóa học của bạn đã được kiểm duyệt',
    message: 'Admin đã duyệt khóa học "Mastering TypeScript & Modern Backend".',
    type: 'course',
    isRead: false,
    createdAt: '2024-02-02T16:00:00Z'
  }
];

export class NotificationModel {
  static async findForUser(userId: string, role: string): Promise<INotification[]> {
    return mockNotifications.filter(n => 
      !n.targetUserId || n.targetUserId === userId || n.targetRole === 'all' || n.targetRole === role
    );
  }

  static async create(data: Partial<INotification>): Promise<INotification> {
    const item: INotification = {
      id: `notif_${Date.now()}`,
      targetUserId: data.targetUserId,
      targetRole: data.targetRole || 'all',
      title: data.title || '',
      message: data.message || '',
      type: data.type || 'system',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    mockNotifications.push(item);
    return item;
  }
}
