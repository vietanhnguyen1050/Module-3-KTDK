import React from 'react';
import { Link } from 'react-router-dom';
import { ICourse } from '../../types';
import { Star, Users, BookOpen } from 'lucide-react';

export const CourseCard: React.FC<{ course: ICourse }> = ({ course }) => {
  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <Link to={`/courses/${course.id}`} className="course-card">
      <div className="course-thumb-wrapper">
        <img src={course.thumbnail} alt={course.title} className="course-thumb" />
        <span className="course-category-badge">{course.category}</span>
      </div>

      <div className="course-body">
        <div className="course-provider">{course.providerName}</div>
        <h3 className="course-title">{course.title}</h3>
        <p className="course-desc">{course.description}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: '#64748b', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b', fontWeight: 700 }}>
            <Star size={14} fill="#f59e0b" />
            <span>{course.rating > 0 ? course.rating : '5.0'}</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>({course.reviewCount})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Users size={14} />
            <span>{course.enrolledCount} học viên</span>
          </div>
        </div>

        <div className="course-meta">
          <div className="course-price-wrap">
            <span className="course-price">{formatVND(course.price)}</span>
            {course.originalPrice > course.price && (
              <span className="course-original-price">{formatVND(course.originalPrice)}</span>
            )}
          </div>
          <span className="badge badge-primary">{course.level}</span>
        </div>
      </div>
    </Link>
  );
};
