import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IActiveSession } from '../../types';
import { LogIn, Laptop, Smartphone, ShieldBan, CheckCircle } from 'lucide-react';

export const LoginManagement: React.FC = () => {
  const [sessions, setSessions] = useState<IActiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    const res = await api.getAdminSessions();
    if (res.success && res.data) setSessions(res.data);
    setLoading(false);
  };

  const handleTerminate = async (id: string) => {
    if (!window.confirm('Buộc đăng xuất và hủy phiên làm việc này?')) return;
    await api.terminateAdminSession(id);
    fetchSessions();
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Giám Sát & Quản Lý Đăng Nhập (AD-ADM13)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Giám sát các phiên đăng nhập thời gian thực và ngắt kết nối các thiết bị nghi vấn
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Đang tải danh sách phiên đăng nhập...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Thiết bị & Trình duyệt</th>
                  <th>Địa chỉ IP</th>
                  <th>Thời gian đăng nhập</th>
                  <th>Hoạt động gần nhất</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ padding: 8, background: 'var(--primary-light)', borderRadius: 8, color: 'var(--primary)' }}>
                          <LogIn size={16} />
                        </div>
                        <div>
                          <strong>{s.userName}</strong>
                          {s.isCurrent && <span className="badge badge-success" style={{ marginLeft: 6 }}>Thiết bị này</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {s.device.includes('iPhone') ? <Smartphone size={15} /> : <Laptop size={15} />}
                        <span>{s.device} • {s.browser}</span>
                      </div>
                    </td>
                    <td><code>{s.ip}</code></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(s.loginTime).toLocaleString('vi-VN')}</td>
                    <td><strong style={{ color: 'var(--success)' }}>{s.lastActive}</strong></td>
                    <td style={{ textAlign: 'right' }}>
                      {!s.isCurrent && (
                        <button onClick={() => handleTerminate(s.id)} className="btn btn-danger btn-sm">
                          <ShieldBan size={13} /> Buộc đăng xuất
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
