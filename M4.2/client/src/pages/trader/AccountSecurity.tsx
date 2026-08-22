import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { IApiKey } from '../../types';
import { Shield, Key, Lock, CheckCircle, AlertCircle, Save, Plus } from 'lucide-react';

export const AccountSecurity: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
    password: '',
    twoFactorEnabled: user?.twoFactorEnabled || false
  });

  const [apiKeys, setApiKeys] = useState<IApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    const res = await api.getAdminApiKeys(); // returns user's keys
    if (res.success && res.data) setApiKeys(res.data);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const res = await api.updateProfile(formData);
    setLoading(false);

    if (res.success) {
      setMsg({ type: 'success', text: 'Cập nhật tài khoản & chính sách 2FA thành công!' });
      await refreshUser();
    } else {
      setMsg({ type: 'error', text: res.message || 'Cập nhật thất bại.' });
    }
  };

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;
    await api.createAdminApiKey({ name: newKeyName, permissions: ['read', 'trade'] });
    setNewKeyName('');
    fetchApiKeys();
  };

  return (
    <div style={{ maxWidth: 840 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Cài Đặt Tài Khoản & Bảo Mật 2FA (TRD-ACC01)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
          Quản lý thông tin định danh, bảo mật hai lớp và khóa giao dịch thuật toán API
        </p>
      </div>

      {msg && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px',
          borderRadius: 6, fontSize: 13, marginBottom: 20,
          background: msg.type === 'success' ? 'var(--buy-light)' : 'var(--sell-light)',
          color: msg.type === 'success' ? 'var(--buy)' : 'var(--sell)'
        }}>
          {msg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Profile & 2FA Form */}
      <div className="card" style={{ padding: 28, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>Thông Tin Cá Nhân & Bảo Mật</h3>

        <form onSubmit={handleUpdate}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
            <img
              src={formData.avatar || user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt=""
              style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
            />
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700 }}>{user?.name}</h4>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email}</div>
              <div style={{ marginTop: 4 }}>
                <span className="badge badge-primary">VIP LEVEL {user?.vipLevel || 1}</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Họ và tên</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Link ảnh đại diện (Avatar URL)</label>
            <input
              type="text"
              className="form-input"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            />
          </div>

          {/* 2FA switch */}
          <div className="form-group" style={{ padding: 14, background: 'var(--bg-dark)', borderRadius: 6 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.twoFactorEnabled}
                onChange={(e) => setFormData({ ...formData, twoFactorEnabled: e.target.checked })}
              />
              <div>
                <strong style={{ fontSize: 13 }}>Kích hoạt xác thực 2 lớp (Google Authenticator 2FA)</strong>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Bảo vệ an toàn khi rút tiền và đăng nhập tài khoản</div>
              </div>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Đổi mật khẩu mới (Bỏ trống nếu giữ nguyên)</label>
            <input
              type="password"
              className="form-input"
              placeholder="Nhập mật khẩu mới"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Save size={16} />
            <span>{loading ? 'Đang lưu...' : 'Lưu Thay Đổi Hồ Sơ'}</span>
          </button>
        </form>
      </div>

      {/* API Key Management (AD-ADM09 / TRD) */}
      <div className="card" style={{ padding: 28 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>Khóa Giao Dịch API (Trading API Keys)</h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Dành cho kết nối bot giao dịch tự động qua Python CCXT / WebSockets</p>

        <form onSubmit={handleCreateApiKey} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Tên Bot (VD: Grid Bot Binance/CryptoPlanet)"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
            <Plus size={16} /> Tạo API Key
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {apiKeys.map((k) => (
            <div key={k.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-dark)', borderRadius: 6, border: '1px solid var(--border)' }}>
              <div>
                <strong style={{ fontSize: 13 }}>{k.name}</strong>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--primary)', marginTop: 2 }}>
                  {k.keyMasked}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge badge-buy">{k.status.toUpperCase()}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{k.rateLimit} req/min</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
