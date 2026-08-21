import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { IApiKey } from '../../types';
import { User, Key, Shield, Save, Plus, CheckCircle, AlertCircle } from 'lucide-react';

export const AccountSettings: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
    password: ''
  });

  const [apiKeys, setApiKeys] = useState<IApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    const res = await api.getApiKeys();
    if (res.success && res.data) setApiKeys(res.data);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const res = await api.updateProfile(formData);
    setLoading(false);

    if (res.success) {
      setMsg({ type: 'success', text: 'Cập nhật tài khoản thành công!' });
      await refreshUser();
    } else {
      setMsg({ type: 'error', text: res.message || 'Cập nhật thất bại.' });
    }
  };

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;
    await api.createApiKey({ name: newKeyName });
    setNewKeyName('');
    fetchApiKeys();
  };

  return (
    <div style={{ maxWidth: 840 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Cài Đặt Tài Khoản Cá Nhân (USR-ACC01)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Cập nhật hồ sơ, mật khẩu và quản lý khóa API tích hợp (Developer API Keys)
        </p>
      </div>

      {msg && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 8,
          fontSize: 13, marginBottom: 20,
          background: msg.type === 'success' ? 'var(--success-light)' : 'var(--danger-light)',
          color: msg.type === 'success' ? 'var(--success)' : 'var(--danger)'
        }}>
          {msg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="card" style={{ padding: 32, marginBottom: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Thông Tin Người Dùng</h3>

        <form onSubmit={handleUpdateProfile}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
            <img
              src={formData.avatar || user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt="Avatar"
              style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-light)' }}
            />
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700 }}>{user?.name}</h4>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{user?.email}</div>
              <div style={{ marginTop: 6 }}>
                <span className={`badge ${user?.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>
                  {user?.role.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Họ và tên *</label>
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

          <div className="form-group" style={{ background: 'var(--bg-main)', padding: 16, borderRadius: 8 }}>
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

      {/* Developer API Keys (AD-ADM09 / USR) */}
      <div className="card" style={{ padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Khóa Tích Hợp API (API Keys)</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sử dụng để đẩy số liệu hoặc tích hợp với Zapier / Webhooks</p>
          </div>
        </div>

        <form onSubmit={handleCreateApiKey} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Tên ứng dụng (VD: Mobile App Sync Key)"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
            <Plus size={16} /> Tạo API Key
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {apiKeys.map((k) => (
            <div key={k.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div>
                <strong>{k.name}</strong>
                <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--primary)', marginTop: 2 }}>
                  {k.keyMasked}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="badge badge-success">{k.status.toUpperCase()}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Limit: {k.rateLimit} req/min</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
