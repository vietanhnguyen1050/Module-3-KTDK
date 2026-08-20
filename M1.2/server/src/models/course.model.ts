import { ICourse } from '../types';

export const mockCourses: ICourse[] = [
  {
    id: 'course_1',
    providerId: 'user_provider_1',
    providerName: 'MindX Academy',
    title: 'Lập trình Web Fullstack với React & Node.js',
    slug: 'lap-trinh-web-fullstack-react-nodejs',
    description: 'Khóa học toàn diện từ cơ bản đến nâng cao về React, TypeScript, Express, RESTful API và kiến trúc MVC.',
    objective: 'Nắm vững tư duy lập trình web hiện đại, xây dựng được ứng dụng hoàn chỉnh và tự tin ứng tuyển vị trí Web Developer.',
    price: 1499000,
    originalPrice: 2500000,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600',
    category: 'Lập Trình Web',
    level: 'Intermediate',
    status: 'approved',
    isFeatured: true,
    rating: 4.9,
    reviewCount: 42,
    enrolledCount: 158,
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'course_2',
    providerId: 'user_provider_1',
    providerName: 'MindX Academy',
    title: 'HTML, CSS & JavaScript Chuyên Sâu Cho Người Mới',
    slug: 'html-css-javascript-chuyen-sau',
    description: 'Xây dựng nền tảng vững chắc về giao diện, DOM manipulation, responsive web và các hiệu ứng động.',
    objective: 'Tự tay cắt giao diện chuẩn Pixel, làm chủ CSS Flexbox/Grid và viết JavaScript thuần thành thạo.',
    price: 799000,
    originalPrice: 1200000,
    thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600',
    category: 'Frontend',
    level: 'Beginner',
    status: 'approved',
    isFeatured: true,
    rating: 4.8,
    reviewCount: 88,
    enrolledCount: 320,
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'course_3',
    providerId: 'user_provider_1',
    providerName: 'MindX Academy',
    title: 'Mastering TypeScript & Modern Backend Architecture',
    slug: 'mastering-typescript-modern-backend',
    description: 'Khám phá sâu về Type System, Decorators, Clean Architecture, Repository Pattern và TDD trong Node.js.',
    objective: 'Viết code backend an toàn kiểu dữ liệu, dễ mở rộng, sẵn sàng cho các hệ thống microservices quy mô lớn.',
    price: 1890000,
    originalPrice: 2800000,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
    category: 'Backend',
    level: 'Advanced',
    status: 'approved',
    isFeatured: false,
    rating: 5.0,
    reviewCount: 19,
    enrolledCount: 75,
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'course_pending_1',
    providerId: 'user_provider_1',
    providerName: 'MindX Academy',
    title: 'UI/UX Design cho Lập Trình Viên từ Figma đến Code',
    slug: 'ui-ux-design-cho-developer',
    description: 'Học cách thiết kế Design System trên Figma và chuyển đổi mượt mà sang Tailwind CSS.',
    objective: 'Hiểu tư duy trải nghiệm người dùng, tạo wireframe, prototype và xuất mã nguồn CSS chất lượng cao.',
    price: 990000,
    originalPrice: 1500000,
    thumbnail: 'https://images.unsplash.com/photo-1581291518655-9523c93269c3?w=600',
    category: 'UI/UX Design',
    level: 'Beginner',
    status: 'pending_approval',
    isFeatured: false,
    rating: 0,
    reviewCount: 0,
    enrolledCount: 0,
    createdAt: '2024-02-18T00:00:00Z'
  }
];

export class CourseModel {
  static async findAll(filter?: { status?: string; category?: string; search?: string; providerId?: string }): Promise<ICourse[]> {
    let result = [...mockCourses];
    if (filter?.status) {
      result = result.filter(c => c.status === filter.status);
    }
    if (filter?.category && filter.category !== 'All') {
      result = result.filter(c => c.category === filter.category);
    }
    if (filter?.providerId) {
      result = result.filter(c => c.providerId === filter.providerId);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    return result;
  }

  static async findById(id: string): Promise<ICourse | undefined> {
    return mockCourses.find(c => c.id === id);
  }

  static async create(data: Partial<ICourse>): Promise<ICourse> {
    const newCourse: ICourse = {
      id: `course_${Date.now()}`,
      providerId: data.providerId || '',
      providerName: data.providerName || 'Nhà Cung Cấp',
      title: data.title || '',
      slug: data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `course-${Date.now()}`,
      description: data.description || '',
      objective: data.objective || '',
      price: data.price || 0,
      originalPrice: data.originalPrice || (data.price || 0) * 1.5,
      thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
      category: data.category || 'Công Nghệ Thông Tin',
      level: data.level || 'Beginner',
      status: data.status || 'pending_approval',
      isFeatured: data.isFeatured || false,
      rating: 0,
      reviewCount: 0,
      enrolledCount: 0,
      createdAt: new Date().toISOString()
    };
    mockCourses.push(newCourse);
    return newCourse;
  }

  static async update(id: string, updateData: Partial<ICourse>): Promise<ICourse | null> {
    const index = mockCourses.findIndex(c => c.id === id);
    if (index === -1) return null;
    mockCourses[index] = { ...mockCourses[index], ...updateData };
    return mockCourses[index];
  }

  static async delete(id: string): Promise<boolean> {
    const index = mockCourses.findIndex(c => c.id === id);
    if (index === -1) return false;
    mockCourses.splice(index, 1);
    return true;
  }
}
