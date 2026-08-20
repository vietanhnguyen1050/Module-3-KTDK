export type UserRole = 'customer' | 'provider' | 'admin';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'blocked' | 'pending_approval';
  providerInfo?: {
    organizationName: string;
    description: string;
    website?: string;
    approvedAt?: string;
  };
  deleteRequested?: boolean;
  deleteReason?: string;
  createdAt: string;
}

export interface ILesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string; // e.g. "12:30"
  order: number;
  resources?: string[];
}

export interface IReview {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface ICourse {
  id: string;
  providerId: string;
  providerName: string;
  title: string;
  slug: string;
  description: string;
  objective: string;
  price: number;
  originalPrice: number;
  thumbnail: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'disabled';
  isFeatured?: boolean;
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  createdAt: string;
}

export interface IEnrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedLessonIds: string[];
  progressPercentage: number;
  paymentId?: string;
}

export interface IDiscountCode {
  id: string;
  providerId: string;
  courseId?: string; // specific course or all
  code: string;
  discountPercent: number;
  maxUses: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface IPromotion {
  id: string;
  providerId: string;
  courseId: string;
  title: string;
  type: 'time_based' | 'quantity_based';
  discountValue: number; // percentage or fixed
  targetQuantity?: number;
  currentRegistrations?: number;
  startTime: string;
  endTime: string;
  status: 'active' | 'expired' | 'upcoming';
}

export interface IGift {
  id: string;
  providerId: string;
  courseId: string;
  giftName: string;
  giftDescription: string;
  giftType: 'ebook' | 'voucher' | 'consultation' | 'source_code';
  quantity: number;
  remainingQuantity: number;
}

export interface IPayment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  providerId: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'momo' | 'vnpay' | 'bank_transfer';
  createdAt: string;
}

export interface INotification {
  id: string;
  targetUserId?: string; // null means broadcast to all
  targetRole?: UserRole | 'all';
  title: string;
  message: string;
  type: 'system' | 'course' | 'promotion' | 'payment';
  isRead: boolean;
  createdAt: string;
}
