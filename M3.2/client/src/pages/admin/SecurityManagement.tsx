import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Shield, Lock, Save, CheckCircle, AlertTriangle } from 'lucide-react';

export const SecurityManagement: React.FC = () => {
  const [security, setSecurity] = useState<any>({
    twoFactorAuth: true,
    passwordMinLength: 8,
    sessionTimeoutMinutes: 60,
    ipWhitelist: ['113.190.234.12', '14.232.18.99', '127.0.0.1'],
    failedLoginLockout: 5,
    sslEnforced: true
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.getAdminSecurity().then(res => {
      if (res.success && res.data) setSecurity(res.data);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    const res = await api.updateAdminSecurity(security);
    setLoading(false);

    if (res.success) {
      setMsg('Đã cập nhật chính sách bảo mật hệ thống thành công!');
    }
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Quản Lý & Cấu Hình Bảo Mật (AD-ADM08)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Thiết lập xác thực 2 yếu tố (2FA), chính sách mật khẩu, giới hạn session và IP Whitelist
        </p>
      </div>

      {msg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'var(--success-light)', color: 'var(--success)', borderRadius: 8, fontSize: 13, marginBottom: 20 }}>
          <CheckCircle size={16} />
          <span>{msg}</span>
        </div>
      )}

      <div className="card" style={{ padding: 32 }}>
        <form onSubmit={handleSave}>
          <div className="form-group" style={{ padding: 14, background: 'var(--bg-main)', borderRadius: 8, marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={security.twoFactorAuth}
                onChange={(e) => setSecurity({ ...security, twoFactorAuth: e.target.checked })}
              />
              <div>
                <strong style={{ fontSize: 14 }}>Bắt buộc xác thực 2 bước (2FA Enforcement)</strong>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Yêu cầu mã TOTP qua Google Authenticator khi đăng nhập</div>
              </div>
            </label>
          </div>

          <div className="form-group" style={{ padding: 14, background: 'var(--bg-main)', borderRadius: 8, marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={security.sslEnforced}
                onChange={(e) => setSecurity({ ...security, sslEnforced: e.target.checked })}
              />
              <div>
                <strong style={{ fontSize: 14 }}>Bắt buộc HTTPS & HSTS Strict Security</strong>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tự động chuyển hướng toàn bộ traffic sang kết nối mã hóa SSL/TLS</div>
              </div>
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Độ dài mật khẩu tối thiểu (ký tự)</label>
              <input
                type="number"
                min={6}
                max={32}
                className="form-input"
                value={security.passwordMinLength}
                onChange={(e) => setSecurity({ ...security, passwordMinLength: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Thời gian hết hạn phiên (Session Timeout - Phút)</label>
              <input
                type="number"
                min={5}
                max={1440}
                className="form-input"
                value={security.sessionTimeoutMinutes}
                onChange={(e) => setSecurity({ ...security, sessionTimeoutMinutes: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Số lần đăng nhập sai tối đa trước khi tạm khóa tài khoản</label>
            <input
              type="number"
              min={3}
              max={10}
              className="form-input"
              value={security.failedLoginLockout}
              onChange={(e) => setSecurity({ ...security, failedLoginLockout: Number(e.target.value) })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Danh sách IP Whitelist cho Admin (Phân cách bởi dấu phẩy)</label>
            <input
              type="text"
              className="form-input"
              value={security.ipWhitelist?.join(', ')}
              onChange={(e) => setSecurity({ ...security, ipWhitelist: e.target.value.split(',').map(s => s.trim()) })}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 12 }} disabled={loading}>
            <Save size={16} />
            <span>{loading ? 'Đang lưu...' : 'Lưu Cấu Hình Bảo Mật'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
