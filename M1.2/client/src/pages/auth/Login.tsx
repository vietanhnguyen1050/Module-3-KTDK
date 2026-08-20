import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, LogIn, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      navigate('/');
    } else {
      setError('Email hoặc mật khẩu không chính xác.');
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: 440, padding: 36 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', padding: 12, background: 'var(--primary-light)', borderRadius: '50%', color: 'var(--primary)', marginBottom: 12 }}>
            <GraduationCap size={32} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>Đăng Nhập Edupress</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
            Chào mừng bạn quay trở lại nền tảng học tập trực tuyến
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 16px',
            background: 'var(--danger-light)',
            color: 'var(--danger)',
            borderRadius: 8,
            fontSize: 13,
            marginBottom: 20
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Địa chỉ Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="VD: student@edupress.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label className="form-label" style={{ margin: 0 }}>Mật khẩu</label>
              <Link to="/forgot-password" style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>
                Quên mật khẩu?
              </Link>
            </div>
            <input
              type="password"
              className="form-input"
              placeholder="Nhập mật khẩu của bạn"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8 }}
            disabled={loading}
          >
            <LogIn size={18} />
            <span>{loading ? 'Đang xác thực...' : 'Đăng Nhập Ngay'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-muted)' }}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Đăng ký học viên mới
          </Link>
        </div>

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px dashed var(--border)', fontSize: 12, color: '#94a3b8' }}>
          💡 <b>Mẹo Test Nhanh:</b> Bạn có thể dùng thanh Switcher ở trên cùng hoặc đăng nhập bằng:
          <br />• <b>Học viên:</b> student@edupress.com / password123
          <br />• <b>NCC:</b> provider@mindx.edu.vn / password123
          <br />• <b>Admin:</b> admin@edupress.com / password123
        </div>
      </div>
    </div>
  );
};
