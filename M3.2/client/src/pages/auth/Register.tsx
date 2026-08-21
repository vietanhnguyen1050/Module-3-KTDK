import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setAuthToken, setDemoUserId } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, UserPlus, AlertCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Mật khẩu và xác nhận mật khẩu không khớp.');
    }

    setLoading(true);
    const res = await api.register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
    setLoading(false);

    if (res.success && res.data) {
      setAuthToken(res.data.token);
      setDemoUserId(res.data.user.id);
      await refreshUser();
      navigate('/dashboards');
    } else {
      setError(res.message || 'Đăng ký thất bại.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 42px)', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 440, padding: 36 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', padding: 12, background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', marginBottom: 12 }}>
            <LayoutDashboard size={32} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>Tạo Tài Khoản Dashstack</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Bắt đầu tạo và quản lý các bảng điều khiển dữ liệu hiện đại
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 8, fontSize: 13, marginBottom: 20 }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Họ và tên *</label>
            <input
              type="text"
              className="form-input"
              placeholder="VD: Nguyễn Văn Anh"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Địa chỉ Email *</label>
            <input
              type="email"
              className="form-input"
              placeholder="VD: user@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu *</label>
            <input
              type="password"
              className="form-input"
              placeholder="Tối thiểu 6 ký tự"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Xác nhận mật khẩu *</label>
            <input
              type="password"
              className="form-input"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 12 }} disabled={loading}>
            <UserPlus size={18} />
            <span>{loading ? 'Đang tạo tài khoản...' : 'Hoàn Tất Đăng Ký'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
