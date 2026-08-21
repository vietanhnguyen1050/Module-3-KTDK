import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ISupportTicket } from '../../types';
import { HelpCircle, Plus, CheckCircle, Clock, MessageSquare, AlertCircle } from 'lucide-react';

export const SupportTicket: React.FC = () => {
  const [tickets, setTickets] = useState<ISupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium' as any
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    const res = await api.getSupportTickets();
    if (res.success && res.data) setTickets(res.data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createSupportTicket(formData);
    setShowModal(false);
    setFormData({ subject: '', description: '', priority: 'medium' });
    fetchTickets();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Yêu Cầu Hỗ Trợ Kỹ Thuật (USR-SPT01)</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Gửi thắc mắc hoặc sự cố tới đội ngũ kỹ thuật và theo dõi tiến độ xử lý
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> Gửi Ticket Mới (USR-SPT01)
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Đang tải tickets...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {tickets.map((t) => (
            <div key={t.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800 }}>{t.subject}</h3>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    Tạo lúc: {new Date(t.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <span className={`badge ${t.priority === 'high' ? 'badge-danger' : 'badge-primary'}`}>
                    Ưu tiên: {t.priority.toUpperCase()}
                  </span>
                  <span className={`badge ${t.status === 'resolved' ? 'badge-success' : 'badge-warning'}`}>
                    {t.status === 'resolved' ? 'Đã giải quyết' : t.status === 'in_progress' ? 'Đang xử lý' : 'Chờ tiếp nhận'}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.5, marginBottom: 14 }}>
                {t.description}
              </p>

              {t.response && (
                <div style={{ padding: 14, background: '#f8fafc', borderRadius: 8, borderLeft: '4px solid var(--primary)', fontSize: 13 }}>
                  <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: 4 }}>
                    💬 Phản hồi từ Quản trị viên:
                  </strong>
                  <span style={{ color: '#475569' }}>{t.response}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 20
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 500, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 18 }}>Tạo Yêu Cầu Hỗ Trợ Mới</h3>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Tiêu đề thắc mắc / Sự cố *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="VD: Không kết nối được nguồn dữ liệu MySQL"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mức độ ưu tiên</label>
                <select
                  className="form-select"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                >
                  <option value="low">Thấp (Low)</option>
                  <option value="medium">Bình thường (Medium)</option>
                  <option value="high">Cao (High)</option>
                  <option value="urgent">Khẩn cấp (Urgent)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Chi tiết sự cố *</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Mô tả chi tiết bước thực hiện và mã lỗi xuất hiện..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary">Gửi Yêu Cầu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
