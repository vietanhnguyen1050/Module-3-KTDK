import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IDashboardChangeHistory } from '../../types';
import { History, Clock, User, Activity } from 'lucide-react';

export const HistoryChange: React.FC = () => {
  const [history, setHistory] = useState<IDashboardChangeHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    const res = await api.getDashboardHistory('all');
    if (res.success && res.data) {
      setHistory(res.data);
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Lịch Sử Thay Đổi & Cập Nhật (USR-DBD08)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Theo dõi nhật ký chỉnh sửa, thêm widget và thay đổi cấu hình trên các bảng điều khiển
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Đang tải lịch sử...</div>
      ) : (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {history.map((h, idx) => (
              <div key={h.id} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', position: 'relative' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--primary-light)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Activity size={18} />
                </div>

                <div style={{ flex: 1, paddingBottom: 16, borderBottom: idx !== history.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <strong style={{ fontSize: 14 }}>{h.action}</strong>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {new Date(h.timestamp).toLocaleString('vi-VN')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>Thực hiện bởi: <strong style={{ color: 'var(--text-main)' }}>{h.userName}</strong></span>
                    <span>• Mã Dashboard: <code>{h.dashboardId}</code></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
