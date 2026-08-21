import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ISystemLog, IEventLog } from '../../types';
import { Activity, AlertTriangle, Info, ShieldAlert, ListFilter } from 'lucide-react';

export const SystemLogs: React.FC = () => {
  const [tab, setTab] = useState<'system' | 'event'>('system');
  const [systemLogs, setSystemLogs] = useState<ISystemLog[]>([]);
  const [eventLogs, setEventLogs] = useState<IEventLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const [sysRes, evtRes] = await Promise.all([
      api.getAdminSystemLogs(),
      api.getAdminEventLogs()
    ]);
    if (sysRes.success && sysRes.data) setSystemLogs(sysRes.data);
    if (evtRes.success && evtRes.data) setEventLogs(evtRes.data);
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Nhật Ký Hoạt Động & Event Logs (AD-ADM10 / AD-ADM14)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Theo dõi nhật ký lỗi hệ thống và toàn bộ hành động audit log của người dùng
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => setTab('system')}
          className={`btn ${tab === 'system' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Activity size={16} /> Nhật Ký Hệ Thống (System Logs - AD-ADM10)
        </button>
        <button
          onClick={() => setTab('event')}
          className={`btn ${tab === 'event' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <ListFilter size={16} /> Log Sự Kiện Người Dùng (Event Logs - AD-ADM14)
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Đang tải nhật ký...</div>
      ) : tab === 'system' ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mức độ (Level)</th>
                  <th>Phân hệ (Module)</th>
                  <th>Nội dung thông báo (Message)</th>
                  <th>Địa chỉ IP</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {systemLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      {log.level === 'info' && <span className="badge badge-primary"><Info size={11} /> INFO</span>}
                      {log.level === 'warn' && <span className="badge badge-warning"><AlertTriangle size={11} /> WARN</span>}
                      {log.level === 'error' && <span className="badge badge-danger"><ShieldAlert size={11} /> ERROR</span>}
                    </td>
                    <td><strong>{log.module}</strong></td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{log.message}</td>
                    <td><code>{log.ip}</code></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Người thực hiện</th>
                  <th>Hành động (Action)</th>
                  <th>Đối tượng tác động (Target)</th>
                  <th>Địa chỉ IP</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {eventLogs.map((evt) => (
                  <tr key={evt.id}>
                    <td><strong>{evt.userName}</strong></td>
                    <td><code style={{ color: 'var(--primary)', fontWeight: 700 }}>{evt.action}</code></td>
                    <td>{evt.target}</td>
                    <td><code>{evt.ip}</code></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(evt.timestamp).toLocaleString('vi-VN')}</td>
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
