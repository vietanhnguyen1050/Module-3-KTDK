import React, { useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DeleteAccount: React.FC = () => {
  const { user } = useAuth();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm('Bạn có chắc chắn muốn gửi yêu cầu xóa tài khoản khỏi hệ thống?')) return;

    setLoading(true);
    setMsg(null);

    const res = await api.requestDeleteAccount({ reason });
    setLoading(false);

    if (res.success) {
      setMsg({
        type: 'success',
        text: 'Yêu cầu xóa tài khoản đã được gửi tới Ban Quản Trị Edupress để xử lý.'
      });
    } else {
      setMsg({ type: 'error', text: res.message || 'Gửi yêu cầu thất bại.' });
    }
  };

  return (
    <div className="page-wrapper container" style={{ maxWidth: 540 }}>
      <div style={{ marginBottom: 24 }}>
        <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
          <ArrowLeft size={14} /> Quay lại Hồ Sơ
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--danger)' }}>
          <AlertTriangle size={24} />
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Yêu Cầu Xóa Tài Khoản (CT-QLTT06)</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>
          Khi xóa tài khoản, tất cả dữ liệu tiến độ học tập và thông tin cá nhân của bạn sẽ bị gỡ bỏ vĩnh viễn khỏi hệ thống.
        </p>
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

      <div className="card" style={{ padding: 28, borderColor: '#fca5a5' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Lý do bạn muốn rời khỏi Edupress:</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="VD: Không còn nhu cầu học tập, đổi địa chỉ email mới..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-danger" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            <span>{loading ? 'Đang gửi yêu cầu...' : 'Xác Nhận Gửi Yêu Cầu Xóa'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
