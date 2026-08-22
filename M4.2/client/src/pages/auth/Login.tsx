import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Globe, LogIn, AlertCircle } from 'lucide-react';

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
      navigate('/trade');
    } else {
      setError('Email hoặc mật khẩu không chính xác.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 41px)', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'inline-flex', padding: 12, background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', marginBottom: 12 }}>
            <Globe size={32} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Đăng Nhập Crypto Planet</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Sàn giao dịch tiền điện tử tốc độ cao & bảo mật
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 12px', background: 'var(--sell-light)', color: 'var(--sell)', borderRadius: 6, fontSize: 12, marginBottom: 16 }}>
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email tài khoản</label>
            <input
              type="email"
              className="form-input"
              placeholder="VD: trader@cryptoplanet.io"
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
            <LogIn size={16} />
            <span>{loading ? 'Đang xác thực...' : 'Đăng Nhập Ngay'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Đăng ký mới
          </Link>
        </div>

        <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px dashed var(--border)', fontSize: 11, color: 'var(--text-muted)' }}>
          💡 <b>Tài khoản test demo:</b>
          <br />• <b>Trader:</b> trader@cryptoplanet.io / password123
          <br />• <b>Admin:</b> admin@cryptoplanet.io / password123
          <br />• <b>Viewer:</b> viewer@cryptoplanet.io / password123
        </div>
      </div>
    </div>
  );
};
