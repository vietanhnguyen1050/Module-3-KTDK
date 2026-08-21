import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IApiKey } from '../../types';
import { Key, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

export const ApiManagement: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<IApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    setLoading(true);
    const res = await api.getAdminApiKeys();
    if (res.success && res.data) setApiKeys(res.data);
    setLoading(false);
  };

  const handleRevoke = async (id: string) => {
    if (!window.confirm('Thu hồi API Key này? Ứng dụng tích hợp sẽ không thể truy cập được nữa.')) return;
    await api.revokeAdminApiKey(id);
    fetchKeys();
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Quản Lý API & Developer Keys (AD-ADM09)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Cấp quyền, quản lý Rate Limit và thu hồi các khóa truy cập API cho bên thứ ba
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Đang tải danh sách API Keys...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên ứng dụng / Mục đích</th>
                  <th>API Key Masked</th>
                  <th>Rate Limit</th>
                  <th>Lần sử dụng cuối</th>
                  <th>Trạng thái</th>
                  <th>Ngày cấp</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((k) => (
                  <tr key={k.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Key size={16} color="var(--primary)" />
                        <strong>{k.name}</strong>
                      </div>
                    </td>
                    <td><code>{k.keyMasked}</code></td>
                    <td>{k.rateLimit} req/min</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{k.lastUsedAt}</td>
                    <td>
                      {k.status === 'active' ? (
                        <span className="badge badge-success"><CheckCircle size={12} /> Hoạt động</span>
                      ) : (
                        <span className="badge badge-danger"><XCircle size={12} /> Đã thu hồi</span>
                      )}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(k.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td style={{ textAlign: 'right' }}>
                      {k.status === 'active' && (
                        <button onClick={() => handleRevoke(k.id)} className="btn btn-danger btn-sm">
                          Thu hồi
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
