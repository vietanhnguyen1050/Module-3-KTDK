import { IReview } from '../types';

export const mockReviews: IReview[] = [
  {
    id: 'rev_1',
    courseId: 'course_1',
    userId: 'user_customer_1',
    userName: 'Nguyễn Văn Anh',
    rating: 5,
    comment: 'Khóa học cực kỳ chi tiết, giảng viên hỗ trợ tận tình! Rất đáng tiền!',
    createdAt: '2024-02-12T14:30:00Z'
  },
  {
    id: 'rev_2',
    courseId: 'course_1',
    userId: 'user_customer_2',
    userName: 'Trần Minh Đức',
    rating: 5,
    comment: 'Phần thực hành REST API và TypeScript chuẩn chỉnh, áp dụng được ngay vào công việc.',
    createdAt: '2024-02-15T09:15:00Z'
  },
  {
    id: 'rev_3',
    courseId: 'course_2',
    userId: 'user_customer_1',
    userName: 'Nguyễn Văn Anh',
    rating: 4,
    comment: 'Rất dễ hiểu cho người mới bắt đầu học lập trình web.',
    createdAt: '2024-02-16T18:00:00Z'
  }
];

export class ReviewModel {
  static async findByCourseId(courseId: string): Promise<IReview[]> {
    return mockReviews.filter(r => r.courseId === courseId);
  }

  static async create(data: Partial<IReview>): Promise<IReview> {
    const newRev: IReview = {
      id: `rev_${Date.now()}`,
      courseId: data.courseId || '',
      userId: data.userId || '',
      userName: data.userName || 'Học viên ẩn danh',
      rating: data.rating || 5,
      comment: data.comment || '',
      createdAt: new Date().toISOString()
    };
    mockReviews.push(newRev);
    return newRev;
  }
}
