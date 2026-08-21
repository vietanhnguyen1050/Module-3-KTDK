import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, LogIn, AlertCircle } from 'lucide-react';

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

    const ok = await login(email, password);
    setLoading(false);

    if (ok) {
      navigate('/dashboards');
    } else {
      setError('Email hoặc mật khẩu không chính xác.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 42px)', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: 36 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', padding: 12, background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', marginBottom: 12 }}>
            <LayoutDashboard size={32} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>Đăng Nhập Dashstack</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Hệ thống quản lý bảng điều khiển & trực quan hóa dữ liệu
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
            <label className="form-label">Email tài khoản</label>
            <input
              type="email"
              className="form-input"
              placeholder="VD: user@dashstack.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-input"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            <LogIn size={18} />
            <span>{loading ? 'Đang xác thực...' : 'Đăng Nhập Ngay'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Đăng ký tài khoản mới (USR-REG01)
          </Link>
        </div>

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px dashed var(--border)', fontSize: 12, color: '#94a3b8' }}>
          💡 <b>Tài khoản test:</b>
          <br />• <b>User:</b> user@dashstack.io / password123
          <br />• <b>Admin:</b> admin@dashstack.io / password123
        </div>
      </div>
    </div>
  );
};
