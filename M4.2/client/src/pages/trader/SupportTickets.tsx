import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ISupportTicket } from '../../types';
import { HelpCircle, Plus, MessageSquare, CheckCircle, Clock } from 'lucide-react';

export const SupportTickets: React.FC = () => {
  const [tickets, setTickets] = useState<ISupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    category: 'deposit_withdraw' as any,
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
    setFormData({ category: 'deposit_withdraw', subject: '', description: '', priority: 'medium' });
    fetchTickets();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Trung Tâm Trợ Giúp & Hỗ Trợ Kỹ Thuật (TRD-SPT01 / VWR-SPT01)</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Gửi yêu cầu hỗ trợ về nạp/rút tiền, lỗi đặt lệnh hoặc kích hoạt bảo mật
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> Gửi Phiếu Hỗ Trợ Mới
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Đang tải danh sách ticket...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {tickets.map((t) => (
            <div key={t.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800 }}>{t.subject}</h3>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    Chuyên mục: <b>{t.category.toUpperCase()}</b> • Tạo lúc: {new Date(t.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  <span className={`badge ${t.status === 'resolved' ? 'badge-buy' : 'badge-primary'}`}>
                    {t.status === 'resolved' ? 'Đã Giải Quyết' : t.status === 'in_progress' ? 'Đang Xử Lý' : 'Chờ Tiếp Nhận'}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: 13, color: '#c5cad3', marginBottom: 14 }}>{t.description}</p>

              {t.response && (
                <div style={{ padding: 12, background: 'var(--bg-dark)', borderRadius: 6, borderLeft: '3px solid var(--primary)', fontSize: 12 }}>
                  <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: 4 }}>
                    💬 Phản hồi từ Chuyên Viên Hỗ Trợ:
                  </strong>
                  <span>{t.response}</span>
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
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(3px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 20
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 480, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Tạo Phiếu Yêu Cầu Hỗ Trợ</h3>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Danh mục vấn đề</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                >
                  <option value="deposit_withdraw">Sự cố Nạp / Rút tiền</option>
                  <option value="trading">Lỗi khớp lệnh giao dịch</option>
                  <option value="account_security">Bảo mật tài khoản & 2FA</option>
                  <option value="other">Thắc mắc khác</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tiêu đề thắc mắc *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="VD: Không nhận được mã OTP xác thực"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả chi tiết *</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Mô tả sự cố của bạn..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
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
