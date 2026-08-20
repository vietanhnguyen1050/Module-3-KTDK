import React, { useState } from 'react';
import { api } from '../../services/api';
import { Bell, Send, CheckCircle, AlertCircle } from 'lucide-react';

export const NotificationBroadcast: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetRole: 'all' as 'all' | 'customer' | 'provider'
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const res = await api.broadcastNotification(formData);
    setLoading(false);

    if (res.success) {
      setMsg({ type: 'success', text: 'Thông báo đã được gửi thành công đến tất cả người dùng được chọn!' });
      setFormData({ title: '', message: '', targetRole: 'all' });
    } else {
      setMsg({ type: 'error', text: res.message || 'Gửi thông báo thất bại.' });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Quản Lý & Gửi Thông Báo (AD-HT02)</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Tạo và gửi thông báo hệ thống tới các nhóm người dùng trên nền tảng
        </p>
      </div>

      <div className="card" style={{ maxWidth: 640, padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <Bell size={22} color="var(--primary)" />
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>Soạn Thông Báo Mới</h3>
        </div>

        {msg && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 16px', borderRadius: 8, fontSize: 13, marginBottom: 20,
            background: msg.type === 'success' ? 'var(--success-light)' : 'var(--danger-light)',
            color: msg.type === 'success' ? 'var(--success)' : 'var(--danger)'
          }}>
            {msg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Gửi đến nhóm người dùng:</label>
            <select
              className="form-select"
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value as any })}
            >
              <option value="all">🌐 Tất Cả Người Dùng (Học viên + NCC + Admin)</option>
              <option value="customer">👤 Chỉ Học Viên / Khách Hàng</option>
              <option value="provider">🏢 Chỉ Nhà Cung Cấp (NCC)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Tiêu đề thông báo *</label>
            <input
              type="text"
              className="form-input"
              placeholder="VD: Thông báo bảo trì hệ thống vào cuối tuần"
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
              placeholder="Nhập nội dung thông báo đầy đủ và chi tiết..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            <Send size={18} />
            <span>{loading ? 'Đang gửi thông báo...' : 'Gửi Thông Báo Hệ Thống'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
