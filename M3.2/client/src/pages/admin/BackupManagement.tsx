import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IBackup } from '../../types';
import { HardDrive, Plus, Download, CheckCircle, RefreshCw } from 'lucide-react';

export const BackupManagement: React.FC = () => {
  const [backups, setBackups] = useState<IBackup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    setLoading(true);
    const res = await api.getAdminBackups();
    if (res.success && res.data) setBackups(res.data);
    setLoading(false);
  };

  const handleCreateBackup = async (type: 'full' | 'incremental' = 'full') => {
    setCreating(true);
    await api.createAdminBackup({ type });
    setCreating(false);
    fetchBackups();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Quản Lý & Sao Lưu Dữ Liệu (AD-ADM15)</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Tạo bản sao lưu Snapshot toàn hệ thống (Full Backup) và sao lưu gia tăng (Incremental Backup)
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => handleCreateBackup('incremental')}
            className="btn btn-secondary"
            disabled={creating}
          >
            Sao Lưu Gia Tăng (Incremental)
          </button>

          <button
            onClick={() => handleCreateBackup('full')}
            className="btn btn-primary"
            disabled={creating}
          >
            <Plus size={16} />
            <span>{creating ? 'Đang sao lưu...' : 'Tạo Bản Sao Lưu Toàn Phần (Full)'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Đang tải danh sách bản sao lưu...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên tệp tin sao lưu</th>
                  <th>Dung lượng</th>
                  <th>Loại sao lưu</th>
                  <th>Trạng thái</th>
                  <th>Thời gian tạo</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {backups.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ padding: 8, background: 'var(--primary-light)', borderRadius: 8, color: 'var(--primary)' }}>
                          <HardDrive size={18} />
                        </div>
                        <code>{b.filename}</code>
                      </div>
                    </td>
                    <td><strong>{b.size}</strong></td>
                    <td>
                      <span className={`badge ${b.type === 'full' ? 'badge-primary' : 'badge-warning'}`}>
                        {b.type === 'full' ? 'FULL SNAPSHOT' : 'INCREMENTAL'}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success"><CheckCircle size={12} /> Hoàn tất</span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(b.createdAt).toLocaleString('vi-VN')}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => alert(`Tải xuống file sao lưu: ${b.filename}`)}
                        className="btn btn-secondary btn-sm"
                        title="Tải xuống tệp sao lưu"
                      >
                        <Download size={13} /> Tải file .gz
                      </button>
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
