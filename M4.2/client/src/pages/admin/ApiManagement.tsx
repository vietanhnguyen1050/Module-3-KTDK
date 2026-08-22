import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IApiKey } from '../../types';
import { Key, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';

export const ApiManagement: React.FC = () => {
  const [keys, setKeys] = useState<IApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    setLoading(true);
    const res = await api.getAdminApiKeys();
    if (res.success && res.data) setKeys(res.data);
    setLoading(false);
  };

  const handleRevoke = async (id: string) => {
    if (!window.confirm('Thu hồi khóa API này? Bot giao dịch sẽ bị ngắt kết nối ngay lập tức.')) return;
    await api.revokeAdminApiKey(id);
    fetchKeys();
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Quản Lý API Giao Dịch Thuật Toán (AD-ADM09)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
          Cấp phát, phân quyền truy cập (Read / Trade / Withdraw) và kiểm soát Rate Limit cho API Trader
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Đang tải danh sách API Keys...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên Ứng Dụng Bot</th>
                  <th>API Key Masked</th>
                  <th>Quyền Hạn (Permissions)</th>
                  <th>Giới Hạn (Rate Limit)</th>
                  <th>Trạng Thái</th>
                  <th>Ngày Cấp</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Key size={16} color="var(--primary)" />
                        <strong>{k.name}</strong>
                      </div>
                    </td>
                    <td><code>{k.keyMasked}</code></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {k.permissions.map(p => (
                          <span key={p} className="badge badge-primary">{p.toUpperCase()}</span>
                        ))}
                      </div>
                    </td>
                    <td>{k.rateLimit} req/min</td>
                    <td>
                      {k.status === 'active' ? (
                        <span className="badge badge-buy">HOẠT ĐỘNG</span>
                      ) : (
                        <span className="badge badge-sell">ĐÃ THU HỒI</span>
                      )}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(k.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td style={{ textAlign: 'right' }}>
                      {k.status === 'active' && (
                        <button onClick={() => handleRevoke(k.id)} className="btn btn-danger btn-sm">
                          Thu Hồi
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
