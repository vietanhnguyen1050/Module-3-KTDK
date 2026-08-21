import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IDataSource } from '../../types';
import { Database, Plus, Trash2, CheckCircle, RefreshCw, Radio, Layers } from 'lucide-react';

export const DataIntegration: React.FC = () => {
  const [dataSources, setDataSources] = useState<IDataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'postgres' as any,
    host: ''
  });

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    setLoading(true);
    const res = await api.getDataSources();
    if (res.success && res.data) {
      setDataSources(res.data);
    }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createDataSource(formData);
    setShowModal(false);
    setFormData({ name: '', type: 'postgres', host: '' });
    fetchSources();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Ngắt kết nối nguồn dữ liệu này?')) return;
    await api.deleteDataSource(id);
    fetchSources();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Tích Hợp Dữ Liệu & Ứng Dụng Bên Thứ Ba (USR-DBD03 / USR-DBD11)</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Kết nối trực tiếp cơ sở dữ liệu, REST API, Google Drive, Slack và Webhooks
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> Kết Nối Nguồn Dữ Liệu Mới
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Đang tải danh sách nguồn dữ liệu...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nguồn dữ liệu / Dịch vụ</th>
                  <th>Loại kết nối</th>
                  <th>Địa chỉ Host / Endpoint</th>
                  <th>Số bản ghi</th>
                  <th>Trạng thái</th>
                  <th>Đồng bộ lần cuối</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {dataSources.map((ds) => (
                  <tr key={ds.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ padding: 8, background: 'var(--primary-light)', borderRadius: 8, color: 'var(--primary)' }}>
                          <Database size={18} />
                        </div>
                        <strong>{ds.name}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary" style={{ textTransform: 'uppercase' }}>
                        {ds.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td><code style={{ fontSize: 12 }}>{ds.host || 'N/A'}</code></td>
                    <td>{ds.recordsCount ? ds.recordsCount.toLocaleString() : 'N/A'}</td>
                    <td>
                      {ds.status === 'connected' && <span className="badge badge-success"><CheckCircle size={12} /> Đang kết nối</span>}
                      {ds.status === 'syncing' && <span className="badge badge-warning"><RefreshCw size={12} /> Đang sync</span>}
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {new Date(ds.lastSync).toLocaleString('vi-VN')}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleDelete(ds.id)} className="btn btn-danger btn-sm">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 20
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 500, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 18 }}>Kết Nối Nguồn Dữ Liệu (USR-DBD03)</h3>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Tên kết nối *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="VD: PostgreSQL Main Production DB"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Loại nguồn dữ liệu / Dịch vụ</label>
                <select
                  className="form-select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="postgres">PostgreSQL Database</option>
                  <option value="mysql">MySQL Database</option>
                  <option value="mongodb">MongoDB Atlas</option>
                  <option value="rest_api">RESTful API Endpoint</option>
                  <option value="firebase">Firebase Firestore</option>
                  <option value="google_drive">Google Drive Sheets</option>
                  <option value="slack">Slack Webhook</option>
                  <option value="zapier">Zapier Automated Trigger</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Host / Connection URI / Webhook URL</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="VD: postgresql://user:pass@host:5432/dbname"
                  value={formData.host}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary">Xác Nhận Kết Nối</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
