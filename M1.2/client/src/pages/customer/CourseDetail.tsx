import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ICourse, ILesson, IReview } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Star, Users, CheckCircle, PlayCircle, Lock, Tag,
  CreditCard, ShieldCheck, BookOpen, MessageSquare
} from 'lucide-react';

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDetail();
  }, [id, user]);

  const fetchDetail = async () => {
    if (!id) return;
    setLoading(true);
    const res = await api.getCourseDetail(id);
    if (res.success && res.data) {
      setCourse(res.data);
    }

    if (user) {
      const enrRes = await api.getEnrolledCourses();
      if (enrRes.success && enrRes.data) {
        const found = enrRes.data.some((item: any) => item.course?.id === id);
        setIsEnrolled(found);
      }
    }
    setLoading(false);
  };

  const handleEnroll = async () => {
    if (!user) {
      return navigate('/login');
    }
    if (!id) return;

    setEnrolling(true);
    setEnrollMsg(null);
    const res = await api.enrollCourse(id, { discountCode, paymentMethod });
    setEnrolling(false);

    if (res.success) {
      setIsEnrolled(true);
      setEnrollMsg({ type: 'success', text: 'Đăng ký và thanh toán thành công! Bạn có thể bắt đầu học ngay.' });
    } else {
      setEnrollMsg({ type: 'error', text: res.message || 'Đăng ký thất bại.' });
    }
  };

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading || !course) {
    return <div className="page-wrapper container" style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải thông tin khóa học...</div>;
  }

  return (
    <div className="page-wrapper container">
      {/* Header Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40, alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <span className="badge badge-primary">{course.category}</span>
            <span className="badge badge-warning">{course.level}</span>
          </div>

          <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.3, marginBottom: 16 }}>
            {course.title}
          </h1>

          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
            {course.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 14, color: 'var(--text-muted)', marginBottom: 32, flexWrap: 'wrap' }}>
            <div>Đăng bởi: <strong style={{ color: 'var(--text-main)' }}>{course.providerName}</strong></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b', fontWeight: 700 }}>
              <Star size={16} fill="#f59e0b" />
              <span>{course.rating > 0 ? course.rating : '5.0'}</span>
              <span style={{ color: '#94a3b8', fontWeight: 400 }}>({course.reviewCount} đánh giá)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Users size={16} />
              <span>{course.enrolledCount} học viên đã tham gia</span>
            </div>
          </div>

          {/* Mục tiêu khóa học */}
          <div className="card" style={{ marginBottom: 32, background: '#f8fafc' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>🎯 Bạn sẽ học được gì?</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.5, color: '#334155' }}>
              <CheckCircle size={20} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{course.objective}</span>
            </div>
          </div>

          {/* Nội dung bài học (Curriculum) */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800 }}>📚 Nội Dung Khóa Học</h3>
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{course.lessons?.length || 0} bài giảng</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {course.lessons && course.lessons.length > 0 ? (
                course.lessons.map((lesson: ILesson, idx: number) => (
                  <div key={lesson.id} className="card" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {isEnrolled ? (
                        <PlayCircle size={20} color="var(--primary)" />
                      ) : (
                        <Lock size={18} color="#94a3b8" />
                      )}
                      <div>
                        <h4 style={{ fontSize: 15, fontWeight: 600 }}>{lesson.title}</h4>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lesson.description}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{lesson.duration}</span>
                  </div>
                ))
              ) : (
                <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa có bài giảng nào được tải lên.</div>
              )}
            </div>
          </div>

          {/* Đánh giá từ học viên */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800 }}>⭐ Đánh Giá Từ Học Viên</h3>
              {isEnrolled && (
                <Link to={`/courses/${course.id}/review`} className="btn btn-secondary btn-sm">
                  <MessageSquare size={14} /> Viết đánh giá
                </Link>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {course.reviews && course.reviews.length > 0 ? (
                course.reviews.map((rev: IReview) => (
                  <div key={rev.id} className="card" style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <strong style={{ fontSize: 14 }}>{rev.userName}</strong>
                      <div style={{ display: 'flex', gap: 2, color: '#f59e0b' }}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="#f59e0b" />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: '#475569' }}>{rev.comment}</p>
                    <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, display: 'block' }}>
                      {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa có nhận xét nào cho khóa học này.</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Checkout / Enrolled Card */}
        <div>
          <div className="card" style={{ position: 'sticky', top: 96, boxShadow: 'var(--shadow-lg)' }}>
            <img
              src={course.thumbnail}
              alt={course.title}
              style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }}
            />

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>
                  {formatVND(course.price)}
                </span>
                {course.originalPrice > course.price && (
                  <span style={{ fontSize: 15, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    {formatVND(course.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {enrollMsg && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 13,
                marginBottom: 16,
                background: enrollMsg.type === 'success' ? 'var(--success-light)' : 'var(--danger-light)',
                color: enrollMsg.type === 'success' ? 'var(--success)' : 'var(--danger)'
              }}>
                {enrollMsg.text}
              </div>
            )}

            {isEnrolled ? (
              <div>
                <div style={{
                  padding: 12,
                  background: 'var(--success-light)',
                  color: 'var(--success)',
                  borderRadius: 8,
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                  marginBottom: 14
                }}>
                  ✅ Bạn đã sở hữu khóa học này
                </div>
                <Link to={`/learn/${course.id}`} className="btn btn-primary" style={{ width: '100%' }}>
                  <PlayCircle size={18} /> Vào Học Ngay
                </Link>
              </div>
            ) : (
              <div>
                {/* Voucher code input */}
                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label" style={{ fontSize: 13 }}>Mã giảm giá (Nếu có):</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="VD: EDUPRESS2024"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>
                </div>

                {/* Payment method */}
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label" style={{ fontSize: 13 }}>Phương thức thanh toán:</label>
                  <select
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="momo">Ví Điện Tử MoMo</option>
                    <option value="vnpay">Cổng Thanh Toán VNPAY-QR</option>
                    <option value="credit_card">Thẻ Tín Dụng / Ghi Nợ (Visa/Mastercard)</option>
                    <option value="bank_transfer">Chuyển Khoản Ngân Hàng 24/7</option>
                  </select>
                </div>

                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginBottom: 12 }}
                >
                  <CreditCard size={18} />
                  <span>{enrolling ? 'Đang xử lý...' : 'Đăng Ký & Thanh Toán'}</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                  <ShieldCheck size={14} color="var(--success)" />
                  <span>Cam kết hoàn tiền trong 7 ngày nếu không hài lòng</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
