import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Bell, Send, CheckCircle } from 'lucide-react';

export const NotificationBroadcast: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [formData, setFormData] = useState({ title: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchNotifs();
  }, []);

  const fetchNotifs = async () => {
    const res = await api.getAdminNotifications();
    if (res.success && res.data) setNotifications(res.data);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    const res = await api.broadcastAdminNotification(formData);
    setLoading(false);

    if (res.success) {
      setMsg('Đã phát thông báo thành công tới toàn bộ người dùng!');
      setFormData({ title: '', message: '' });
      fetchNotifs();
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Phát Thông Báo Toàn Sàn (AD-ADM06)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
          Gửi thông báo bảo trì, niêm yết đồng coin mới hoặc cảnh báo bảo mật tới tất cả trader
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Form */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Soạn Thông Báo Hệ Thống</h3>

          {msg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 12px', background: 'var(--buy-light)', color: 'var(--buy)', borderRadius: 6, fontSize: 12, marginBottom: 14 }}>
              <CheckCircle size={14} />
              <span>{msg}</span>
            </div>
          )}

          <form onSubmit={handleSend}>
            <div className="form-group">
              <label className="form-label">Tiêu đề thông báo *</label>
              <input
                type="text"
                className="form-input"
                placeholder="VD: Thông báo niêm yết Solana (SOL/USDT)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nội dung chi tiết *</label>
              <textarea
                className="form-textarea"
                rows={5}
                placeholder="Nhập nội dung thông báo..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              <Send size={16} />
              <span>{loading ? 'Đang gửi...' : 'Phát Thông Báo Ngay'}</span>
            </button>
          </form>
        </div>

        {/* History */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>Lịch Sử Thông Báo Đã Phát</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notifications.map((n) => (
              <div key={n.id} style={{ padding: 12, background: 'var(--bg-dark)', borderRadius: 6, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ fontSize: 13 }}>{n.title}</strong>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
