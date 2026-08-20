import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Star, MessageSquare, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export const CourseReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setSuccess('');
    setLoading(true);

    const res = await api.addCourseReview(id, { rating, comment });
    setLoading(false);

    if (res.success) {
      setSuccess('Cảm ơn bạn đã gửi đánh giá! Ý kiến của bạn giúp khóa học ngày càng hoàn thiện hơn.');
      setTimeout(() => navigate(`/courses/${id}`), 1800);
    } else {
      setError(res.message || 'Gửi đánh giá thất bại.');
    }
  };

  return (
    <div className="page-wrapper container" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: 540, padding: 36 }}>
        <div style={{ marginBottom: 24 }}>
          <Link to={`/courses/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
            <ArrowLeft size={14} /> Quay lại trang khóa học
          </Link>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>Đánh Giá Khóa Học</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
            Chia sẻ trải nghiệm học tập của bạn để cộng đồng học viên cùng tham khảo
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 8, fontSize: 13, marginBottom: 20 }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'var(--success-light)', color: 'var(--success)', borderRadius: 8, fontSize: 13, marginBottom: 20 }}>
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Star selector */}
          <div className="form-group" style={{ textAlign: 'center', margin: '24px 0' }}>
            <label className="form-label" style={{ marginBottom: 12 }}>Mức độ hài lòng của bạn:</label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{ transform: 'scale(1.2)', padding: 6, transition: 'transform 0.1s' }}
                >
                  <Star
                    size={28}
                    fill={star <= rating ? '#f59e0b' : 'none'}
                    color={star <= rating ? '#f59e0b' : '#cbd5e1'}
                  />
                </button>
              ))}
            </div>
            <span style={{ fontSize: 13, color: '#f59e0b', fontWeight: 700, marginTop: 8, display: 'block' }}>
              {rating === 5 ? 'Tuyệt vời (5 sao)' : rating === 4 ? 'Hài lòng (4 sao)' : rating === 3 ? 'Bình thường (3 sao)' : 'Chưa tốt'}
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Nhận xét chi tiết *</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Bạn cảm thấy nội dung bài giảng, chất lượng video và sự hỗ trợ của giảng viên thế nào?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            <MessageSquare size={18} />
            <span>{loading ? 'Đang gửi...' : 'Gửi Đánh Giá Ngay'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
