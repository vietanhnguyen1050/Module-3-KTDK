import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ISystemLog } from '../../types';
import { ShieldAlert, Activity, Lock, AlertTriangle, CheckCircle } from 'lucide-react';

export const SecurityControl: React.FC = () => {
  const [logs, setLogs] = useState<ISystemLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminLogs().then(res => {
      if (res.success && res.data) setLogs(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Kiểm Soát Rủi Ro & Nhật Ký Bảo Mật Sàn (AD-ADM08)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
          Giám sát hoạt động matching engine, phát hiện rút tiền bất thường và bảo mật hệ thống
        </p>
      </div>

      {/* Security Policies Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 24 }}>
        <div className="card" style={{ padding: 18 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>CHÍNH SÁCH 2FA BẮT BUỘC</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <span className="badge badge-buy"><CheckCircle size={12} /> ĐANG BẬT</span>
            <span style={{ fontSize: 12 }}>Cho lệnh rút &gt; 5,000 USDT</span>
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>GIỚI HẠN TẦN SUẤT API (RATE LIMIT)</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <span className="badge badge-primary">1,200 req/min</span>
            <span style={{ fontSize: 12 }}>Anti-DDoS WAF active</span>
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>CẢNH BÁO RỦI RO BLOCKCHAIN</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <span className="badge badge-buy">TỰ ĐỘNG KHÓA VÍ</span>
            <span style={{ fontSize: 12 }}>Khi phát hiện rút bất thường</span>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800 }}>Nhật Ký Bảo Mật & Hệ Thống Thời Gian Thực</h3>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Đang tải nhật ký...</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mức độ</th>
                  <th>Phân hệ</th>
                  <th>Nội dung sự kiện</th>
                  <th>Địa chỉ IP</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      {log.level === 'info' && <span className="badge badge-primary">INFO</span>}
                      {log.level === 'warn' && <span className="badge badge-sell"><AlertTriangle size={11} /> CẢNH BÁO</span>}
                    </td>
                    <td><strong>{log.module}</strong></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{log.message}</td>
                    <td><code>{log.ip}</code></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
