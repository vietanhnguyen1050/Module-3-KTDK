import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Bell, Send, CheckCircle } from 'lucide-react';

export const NotificationManagement: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [formData, setFormData] = useState({ title: '', message: '', target: 'all' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchNotifs();
  }, []);

  const fetchNotifs = async () => {
    const res = await api.getAdminNotifications();
    if (res.success && res.data) setNotifications(res.data);
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    const res = await api.broadcastAdminNotification(formData);
    setLoading(false);

    if (res.success) {
      setMsg('Đã phát thông báo thành công tới tất cả người dùng được chỉ định!');
      setFormData({ title: '', message: '', target: 'all' });
      fetchNotifs();
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Quản Lý & Gửi Thông Báo Hệ Thống (AD-ADM05)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Tạo và gửi thông báo khẩn cấp, bảo trì hoặc cập nhật tính năng tới người dùng
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 24 }}>
        {/* Form */}
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 18 }}>Soạn Thông Báo Mới</h3>

          {msg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', background: 'var(--success-light)', color: 'var(--success)', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
              <CheckCircle size={16} />
              <span>{msg}</span>
            </div>
          )}

          <form onSubmit={handleBroadcast}>
            <div className="form-group">
              <label className="form-label">Đối tượng nhận thông báo</label>
              <select
                className="form-select"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              >
                <option value="all">🌐 Toàn bộ người dùng hệ thống</option>
                <option value="users">👤 Chỉ người dùng gói Free & Pro</option>
                <option value="enterprise">🏢 Khách hàng Enterprise</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tiêu đề thông báo *</label>
              <input
                type="text"
                className="form-input"
                placeholder="VD: Cập nhật tính năng Realtime Chart"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nội dung chi tiết *</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Nhập nội dung thông báo..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
              <Send size={16} />
              <span>{loading ? 'Đang gửi...' : 'Phát Thông Báo Toàn Hệ Thống'}</span>
            </button>
          </form>
        </div>

        {/* History */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 18 }}>Lịch Sử Thông Báo Đã Gửi</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notifications.map((n) => (
              <div key={n.id} style={{ padding: 14, background: '#f8fafc', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ fontSize: 14 }}>{n.title}</strong>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <p style={{ fontSize: 13, color: '#475569' }}>{n.message}</p>
                <span className="badge badge-primary" style={{ marginTop: 8 }}>Mục tiêu: {n.target.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
