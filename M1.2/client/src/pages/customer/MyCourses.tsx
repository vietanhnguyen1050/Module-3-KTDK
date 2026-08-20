import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, PlayCircle, Award } from 'lucide-react';

export const MyCourses: React.FC = () => {
  const [enrolledItems, setEnrolledItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchEnrolledCourses();
  }, [user]);

  const fetchEnrolledCourses = async () => {
    setLoading(true);
    const res = await api.getEnrolledCourses();
    if (res.success && res.data) {
      setEnrolledItems(res.data);
    }
    setLoading(false);
  };

  return (
    <div className="page-wrapper container">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Khóa Học Của Tôi</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Theo dõi tiến độ học tập và tiếp tục các bài giảng bạn đã đăng ký.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Đang tải danh sách khóa học...</div>
      ) : enrolledItems.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {enrolledItems.map(({ course, enrollment }) => (
            <div key={enrollment.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <img
                src={course.thumbnail}
                alt={course.title}
                style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 14 }}
              />

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span className="badge badge-primary" style={{ alignSelf: 'flex-start', marginBottom: 8 }}>
                  {course.category}
                </span>

                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, lineHeight: 1.4 }}>
                  {course.title}
                </h3>

                {/* Progress bar */}
                <div style={{ marginTop: 'auto', marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tiến độ hoàn thành:</span>
                    <strong style={{ color: enrollment.progressPercentage === 100 ? 'var(--success)' : 'var(--primary)' }}>
                      {enrollment.progressPercentage}%
                    </strong>
                  </div>
                  <div style={{ width: '100%', height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      width: `${enrollment.progressPercentage}%`,
                      height: '100%',
                      background: enrollment.progressPercentage === 100 ? 'var(--success)' : 'var(--primary)',
                      borderRadius: 4,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <Link to={`/learn/${course.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    <PlayCircle size={15} /> Tiếp Tục Học
                  </Link>
                  <Link to={`/courses/${course.id}`} className="btn btn-secondary btn-sm">
                    Chi Tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <BookOpen size={48} style={{ margin: '0 auto 16px auto', color: '#cbd5e1' }} />
          <h3>Bạn chưa đăng ký khóa học nào</h3>
          <p style={{ fontSize: 14, marginTop: 8, marginBottom: 20 }}>
            Khám phá hàng trăm khóa học hấp dẫn và bắt đầu học ngay hôm nay!
          </p>
          <Link to="/courses" className="btn btn-primary">
            Khám Phá Khóa Học
          </Link>
        </div>
      )}
    </div>
  );
};
