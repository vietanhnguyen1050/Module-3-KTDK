import { ILesson } from '../types';

export const mockLessons: ILesson[] = [
  // Course 1 lessons
  {
    id: 'lesson_1_1',
    courseId: 'course_1',
    title: 'Bài 1: Giới thiệu khóa học & Thiết lập môi trường React + Node.js',
    description: 'Tổng quan kiến trúc dự án Fullstack, cài đặt Node.js, VS Code, Vite và Git.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '14:20',
    order: 1,
    resources: ['https://nodejs.org', 'https://vitejs.dev']
  },
  {
    id: 'lesson_1_2',
    courseId: 'course_1',
    title: 'Bài 2: React State & Custom Hooks chuyên sâu',
    description: 'Tìm hiểu useState, useEffect, useMemo, useCallback và cách tự viết custom hook để tái sử dụng logic.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '22:45',
    order: 2,
    resources: ['Slide_React_Hooks.pdf']
  },
  {
    id: 'lesson_1_3',
    courseId: 'course_1',
    title: 'Bài 3: Xây dựng RESTful API chuẩn REST với Express & TypeScript',
    description: 'Tổ chức cấu trúc MVC, định nghĩa Controller, Router, Service và Middleware xác thực.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '30:10',
    order: 3,
    resources: ['Postman_Collection.json', 'SourceCode_Lesson3.zip']
  },
  // Course 2 lessons
  {
    id: 'lesson_2_1',
    courseId: 'course_2',
    title: 'Bài 1: Cấu trúc HTML5 ngữ nghĩa và chuẩn SEO',
    description: 'Phân tích các thẻ semantic: header, nav, main, article, section, footer.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '18:05',
    order: 1
  },
  {
    id: 'lesson_2_2',
    courseId: 'course_2',
    title: 'Bài 2: Làm chủ CSS Flexbox & CSS Grid trong 30 phút',
    description: 'Thực hành dàn layout responsive tương thích trên Mobile, Tablet và Desktop.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '28:15',
    order: 2
  }
];

export class LessonModel {
  static async findByCourseId(courseId: string): Promise<ILesson[]> {
    return mockLessons.filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order);
  }

  static async findById(id: string): Promise<ILesson | undefined> {
    return mockLessons.find(l => l.id === id);
  }

  static async create(data: Partial<ILesson>): Promise<ILesson> {
    const newLesson: ILesson = {
      id: `lesson_${Date.now()}`,
      courseId: data.courseId || '',
      title: data.title || '',
      description: data.description || '',
      videoUrl: data.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: data.duration || '10:00',
      order: data.order || (mockLessons.filter(l => l.courseId === data.courseId).length + 1),
      resources: data.resources || []
    };
    mockLessons.push(newLesson);
    return newLesson;
  }

  static async update(id: string, updateData: Partial<ILesson>): Promise<ILesson | null> {
    const index = mockLessons.findIndex(l => l.id === id);
    if (index === -1) return null;
    mockLessons[index] = { ...mockLessons[index], ...updateData };
    return mockLessons[index];
  }

  static async delete(id: string): Promise<boolean> {
    const index = mockLessons.findIndex(l => l.id === id);
    if (index === -1) return false;
    mockLessons.splice(index, 1);
    return true;
  }
}
