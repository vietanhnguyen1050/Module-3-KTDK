import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Key, Save, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatar: user?.avatar || '',
    newPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const res = await api.updateProfile(formData);
    setLoading(false);

    if (res.success) {
      setMsg({ type: 'success', text: 'Cập nhật thông tin hồ sơ thành công!' });
      await refreshUser();
    } else {
      setMsg({ type: 'error', text: res.message || 'Cập nhật thất bại.' });
    }
  };

  return (
    <div className="page-wrapper container" style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Hồ Sơ Cá Nhân (CT-QLTT04 / CT-QLTT05)</h1>
        <p style={{ color: 'var(--text-muted)' }}>Quản lý thông tin tài khoản và cập nhật mật khẩu</p>
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

      <div className="card" style={{ padding: 32 }}>
        <form onSubmit={handleSubmit}>
          {/* Avatar & Email */}
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
            <img
              src={formData.avatar || user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt="Avatar"
              style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-light)' }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>{user?.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
                <Mail size={14} />
                <span>{user?.email} (Không thể thay đổi email)</span>
              </div>
              <div style={{ marginTop: 8 }}>
                <span className={`role-tag ${user?.role}`}>
                  Vai trò: {user?.role === 'admin' ? 'Quản Trị Viên' : user?.role === 'provider' ? 'Nhà Cung Cấp' : 'Học Viên'}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input
                type="text"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Địa chỉ</label>
              <input
                type="text"
                className="form-input"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Link ảnh đại diện (Avatar URL)</label>
            <input
              type="text"
              className="form-input"
              placeholder="https://..."
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid var(--border)' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Key size={16} /> Đổi mật khẩu mới (Bỏ trống nếu không muốn đổi):
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Nhập mật khẩu mới"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
            <Link to="/delete-account" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--danger)', fontSize: 13, fontWeight: 600 }}>
              <AlertTriangle size={14} /> Yêu cầu xóa tài khoản
            </Link>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} />
              <span>{loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
