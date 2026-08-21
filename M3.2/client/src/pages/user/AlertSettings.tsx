import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IAlert, IDashboard } from '../../types';
import { Bell, Plus, Trash2, AlertTriangle, CheckCircle, VolumeX } from 'lucide-react';

export const AlertSettings: React.FC = () => {
  const [alerts, setAlerts] = useState<IAlert[]>([]);
  const [dashboards, setDashboards] = useState<IDashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    dashboardId: '',
    dashboardTitle: '',
    metricName: 'CPU Usage',
    condition: '>=' as any,
    threshold: 80,
    notifyChannel: 'email' as any
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [altRes, dbRes] = await Promise.all([
      api.getAlerts(),
      api.getDashboards()
    ]);
    if (altRes.success && altRes.data) setAlerts(altRes.data);
    if (dbRes.success && dbRes.data) {
      setDashboards(dbRes.data);
      if (dbRes.data.length > 0) {
        setFormData(prev => ({ ...prev, dashboardId: dbRes.data[0].id, dashboardTitle: dbRes.data[0].title }));
      }
    }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDb = dashboards.find(d => d.id === formData.dashboardId);
    await api.createAlert({
      ...formData,
      dashboardTitle: selectedDb?.title || 'Dashboard',
      currentValue: formData.threshold - 5
    });
    setShowModal(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa cảnh báo này?')) return;
    await api.deleteAlert(id);
    fetchData();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Cài Đặt Cảnh Báo Ngưỡng Dữ Liệu (USR-ALRT01)</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Tự động kích hoạt thông báo khi chỉ số vượt ngưỡng hoặc có biến động bất thường
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> Thiết Lập Cảnh Báo Mới (USR-ALRT01)
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Đang tải danh sách cảnh báo...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên cảnh báo</th>
                  <th>Chỉ số theo dõi</th>
                  <th>Điều kiện kích hoạt</th>
                  <th>Giá trị hiện tại</th>
                  <th>Kênh nhận tin</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alt) => (
                  <tr key={alt.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Bell size={18} color={alt.status === 'triggered' ? 'var(--danger)' : 'var(--primary)'} />
                        <div>
                          <strong>{alt.title}</strong>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{alt.dashboardTitle}</div>
                        </div>
                      </div>
                    </td>
                    <td><code>{alt.metricName}</code></td>
                    <td>
                      <strong style={{ color: 'var(--danger)' }}>{alt.condition} {alt.threshold}</strong>
                    </td>
                    <td>{alt.currentValue}</td>
                    <td>
                      <span className="badge badge-primary" style={{ textTransform: 'uppercase' }}>
                        {alt.notifyChannel}
                      </span>
                    </td>
                    <td>
                      {alt.status === 'triggered' ? (
                        <span className="badge badge-danger"><AlertTriangle size={12} /> Đã Kích Hoạt</span>
                      ) : (
                        <span className="badge badge-success"><CheckCircle size={12} /> Đang Giám Sát</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleDelete(alt.id)} className="btn btn-danger btn-sm">
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
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 18 }}>Tạo Cảnh Báo Tự Động (USR-ALRT01)</h3>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Tên cảnh báo *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="VD: Cảnh báo CPU Máy Chủ > 85%"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bảng điều khiển</label>
                <select
                  className="form-select"
                  value={formData.dashboardId}
                  onChange={(e) => setFormData({ ...formData, dashboardId: e.target.value })}
                >
                  {dashboards.map(d => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Tên metric</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.metricName}
                    onChange={(e) => setFormData({ ...formData, metricName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phép so sánh</label>
                  <select
                    className="form-select"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                  >
                    <option value=">=">&gt;= (Lớn hơn bằng)</option>
                    <option value="<=">&lt;= (Nhỏ hơn bằng)</option>
                    <option value=">">&gt; (Lớn hơn)</option>
                    <option value="<">&lt; (Nhỏ hơn)</option>
                    <option value="==">== (Bằng)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Ngưỡng (Threshold)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.threshold}
                    onChange={(e) => setFormData({ ...formData, threshold: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Kênh thông báo khi vi phạm</label>
                <select
                  className="form-select"
                  value={formData.notifyChannel}
                  onChange={(e) => setFormData({ ...formData, notifyChannel: e.target.value as any })}
                >
                  <option value="email">Email Cá Nhân</option>
                  <option value="slack">Slack Webhook Channel</option>
                  <option value="system">Thông Báo Hệ Thống In-App</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Cảnh Báo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
