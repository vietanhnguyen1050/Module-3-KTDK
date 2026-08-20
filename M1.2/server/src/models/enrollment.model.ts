import { IEnrollment } from '../types';

export const mockEnrollments: IEnrollment[] = [
  {
    id: 'enr_1',
    userId: 'user_customer_1',
    courseId: 'course_1',
    enrolledAt: '2024-02-11T10:00:00Z',
    completedLessonIds: ['lesson_1_1'],
    progressPercentage: 33,
    paymentId: 'pay_1'
  },
  {
    id: 'enr_2',
    userId: 'user_customer_1',
    courseId: 'course_2',
    enrolledAt: '2024-02-14T08:30:00Z',
    completedLessonIds: ['lesson_2_1', 'lesson_2_2'],
    progressPercentage: 100,
    paymentId: 'pay_2'
  }
];

export class EnrollmentModel {
  static async findByUserId(userId: string): Promise<IEnrollment[]> {
    return mockEnrollments.filter(e => e.userId === userId);
  }

  static async findByUserAndCourse(userId: string, courseId: string): Promise<IEnrollment | undefined> {
    return mockEnrollments.find(e => e.userId === userId && e.courseId === courseId);
  }

  static async create(data: Partial<IEnrollment>): Promise<IEnrollment> {
    const newEnr: IEnrollment = {
      id: `enr_${Date.now()}`,
      userId: data.userId || '',
      courseId: data.courseId || '',
      enrolledAt: new Date().toISOString(),
      completedLessonIds: [],
      progressPercentage: 0,
      paymentId: data.paymentId
    };
    mockEnrollments.push(newEnr);
    return newEnr;
  }

  static async updateProgress(userId: string, courseId: string, completedLessonIds: string[], progressPercentage: number): Promise<IEnrollment | null> {
    const enr = mockEnrollments.find(e => e.userId === userId && e.courseId === courseId);
    if (!enr) return null;
    enr.completedLessonIds = completedLessonIds;
    enr.progressPercentage = progressPercentage;
    return enr;
  }
}
