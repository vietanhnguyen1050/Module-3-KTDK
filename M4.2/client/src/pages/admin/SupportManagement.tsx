import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ISupportTicket } from '../../types';
import { HelpCircle, MessageSquare, CheckCircle, Send } from 'lucide-react';

export const SupportManagement: React.FC = () => {
  const [tickets, setTickets] = useState<ISupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<ISupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    const res = await api.getSupportTickets();
    if (res.success && res.data) setTickets(res.data);
    setLoading(false);
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText) return;

    await api.replySupportTicket(selectedTicket.id, {
      response: replyText,
      status: 'resolved'
    });

    setSelectedTicket(null);
    setReplyText('');
    fetchTickets();
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Xử Lý Phiếu Hỗ Trợ Kỹ Thuật (AD-ADM07)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
          Tiếp nhận thắc mắc và giải đáp sự cố nạp rút, giao dịch của trader
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Đang tải danh sách ticket...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedTicket ? '1.2fr 1fr' : '1fr', gap: 20 }}>
          {/* List */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Người gửi</th>
                    <th>Chuyên mục</th>
                    <th>Tiêu đề</th>
                    <th>Ưu tiên</th>
                    <th>Trạng thái</th>
                    <th>Thời gian</th>
                    <th style={{ textAlign: 'right' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <strong>{t.userName}</strong>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.userEmail}</div>
                      </td>
                      <td><code style={{ fontSize: 11 }}>{t.category.toUpperCase()}</code></td>
                      <td><strong>{t.subject}</strong></td>
                      <td>
                        <span className={`badge ${t.priority === 'high' ? 'badge-sell' : 'badge-primary'}`}>
                          {t.priority.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${t.status === 'resolved' ? 'badge-buy' : 'badge-primary'}`}>
                          {t.status === 'resolved' ? 'Đã Giải Quyết' : 'Đang Xử Lý'}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(t.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => { setSelectedTicket(t); setReplyText(t.response || ''); }}
                          className="btn btn-primary btn-sm"
                        >
                          Phản Hồi
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reply Panel */}
          {selectedTicket && (
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Phản Hồi Ticket #{selectedTicket.id}</h3>
              <div style={{ padding: 12, background: 'var(--bg-dark)', borderRadius: 6, marginBottom: 16, fontSize: 13 }}>
                <strong>Vấn đề:</strong> {selectedTicket.subject}
                <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>{selectedTicket.description}</p>
              </div>

              <form onSubmit={handleReply}>
                <div className="form-group">
                  <label className="form-label">Nội dung phản hồi cho Trader *</label>
                  <textarea
                    className="form-textarea"
                    rows={5}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button type="button" onClick={() => setSelectedTicket(null)} className="btn btn-secondary btn-sm">Hủy</button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    <Send size={13} /> Gửi Phản Hồi
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
