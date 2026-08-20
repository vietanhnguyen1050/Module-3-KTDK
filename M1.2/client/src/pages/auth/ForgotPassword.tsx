import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { KeyRound, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const res = await api.forgotPassword(email);
    setLoading(false);

    if (res.success) {
      setMessage(res.message || 'Đã gửi hướng dẫn đặt lại mật khẩu.');
    } else {
      setError(res.message || 'Không thể cấp lại mật khẩu.');
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: 440, padding: 36 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', padding: 12, background: 'var(--primary-light)', borderRadius: '50%', color: 'var(--primary)', marginBottom: 12 }}>
            <KeyRound size={32} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>Quên Mật Khẩu?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu từ hệ thống
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 8, fontSize: 13, marginBottom: 20 }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'var(--success-light)', color: 'var(--success)', borderRadius: 8, fontSize: 13, marginBottom: 20 }}>
            <CheckCircle size={16} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Địa chỉ Email đã đăng ký</label>
            <input
              type="email"
              className="form-input"
              placeholder="VD: student@edupress.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? 'Đang gửi yêu cầu...' : 'Gửi Hướng Dẫn Đặt Lại'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>
            <ArrowLeft size={16} />
            Quay lại trang Đăng Nhập
          </Link>
        </div>
      </div>
    </div>
  );
};
