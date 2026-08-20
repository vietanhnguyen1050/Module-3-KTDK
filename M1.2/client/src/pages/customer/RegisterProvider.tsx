import React, { useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export const RegisterProvider: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    organizationName: '',
    description: '',
    website: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const res = await api.registerProvider(formData);
    setLoading(false);

    if (res.success) {
      setMsg({
        type: 'success',
        text: 'Hồ sơ đăng ký của bạn đã được gửi thành công! Quản trị viên sẽ phê duyệt trong thời gian sớm nhất.'
      });
      await refreshUser();
    } else {
      setMsg({ type: 'error', text: res.message || 'Gửi hồ sơ thất bại.' });
    }
  };

  if (user?.role === 'provider') {
    return (
      <div className="page-wrapper container" style={{ maxWidth: 640 }}>
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ display: 'inline-flex', padding: 16, background: 'var(--success-light)', borderRadius: '50%', color: 'var(--success)', marginBottom: 16 }}>
            <CheckCircle size={40} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>Bạn Đã Là Nhà Cung Cấp Khóa Học</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 8, marginBottom: 24 }}>
            Tổ chức: <strong>{user.providerInfo?.organizationName || user.name}</strong>
          </p>
          <a href="/provider/courses" className="btn btn-primary">
            Truy Cập Trang Quản Trị NCC
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper container" style={{ maxWidth: 640 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', padding: 12, background: 'var(--primary-light)', borderRadius: '50%', color: 'var(--primary)', marginBottom: 12 }}>
          <Briefcase size={32} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Đăng Ký Làm Nhà Cung Cấp Khóa Học (CT-CLTT08)</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>
          Hợp tác cùng Edupress để phân phối và kinh doanh các khóa học chất lượng tới hàng nghìn học viên
        </p>
      </div>

      {msg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 16px',
          borderRadius: 8,
          fontSize: 13,
          marginBottom: 20,
          background: msg.type === 'success' ? 'var(--success-light)' : 'var(--danger-light)',
          color: msg.type === 'success' ? 'var(--success)' : 'var(--danger)'
        }}>
          {msg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{msg.text}</span>
        </div>
      )}

      {user?.status === 'pending_approval' ? (
        <div className="card" style={{ textAlign: 'center', padding: 32, background: 'var(--warning-light)', borderColor: '#fde68a' }}>
          <Sparkles size={32} color="var(--warning)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ color: '#92400e', fontWeight: 800 }}>Hồ Sơ Đang Chờ Phê Duyệt</h3>
          <p style={{ color: '#b45309', fontSize: 14, marginTop: 6 }}>
            Yêu cầu trở thành Nhà Cung Cấp của bạn đã được gửi tới Ban Quản Trị Edupress. Vui lòng kiểm tra lại sau hoặc thử chuyển sang tài khoản Admin để duyệt ngay.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Tên Doanh Nghiệp / Tổ Chức / Giảng Viên *</label>
              <input
                type="text"
                className="form-input"
                placeholder="VD: TechSkill Academy"
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả về khóa học dự kiến cung cấp *</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Giới thiệu về chuyên môn, các chủ đề giảng dạy và cam kết chất lượng..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Website / Portfolio (Tùy chọn)</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
              <Briefcase size={18} />
              <span>{loading ? 'Đang gửi hồ sơ...' : 'Nộp Hồ Sơ Đăng Ký NCC'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
