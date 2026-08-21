import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IReport, IDashboard } from '../../types';
import { FileText, Plus, Download, Trash2, Calendar, Mail } from 'lucide-react';

export const Reports: React.FC = () => {
  const [reports, setReports] = useState<IReport[]>([]);
  const [dashboards, setDashboards] = useState<IDashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    dashboardId: '',
    dashboardTitle: '',
    schedule: 'weekly' as any,
    format: 'pdf' as any,
    recipientEmail: 'user@dashstack.io'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [repRes, dbRes] = await Promise.all([
      api.getReports(),
      api.getDashboards()
    ]);
    if (repRes.success && repRes.data) setReports(repRes.data);
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
    await api.createReport({
      ...formData,
      dashboardTitle: selectedDb?.title || 'Dashboard'
    });
    setShowModal(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa lịch trình gửi báo cáo này?')) return;
    await api.deleteReport(id);
    fetchData();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Báo Cáo & Tự Động Hóa (USR-DBD04 / USR-DBD10)</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Tự động tạo và gửi báo cáo phân tích định kỳ qua Email theo lịch trình
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> Lên Lịch Báo Cáo Mới (USR-DBD10)
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Đang tải danh sách báo cáo...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên báo cáo</th>
                  <th>Nguồn Dashboard</th>
                  <th>Tần suất gửi</th>
                  <th>Định dạng file</th>
                  <th>Email nhận</th>
                  <th>Lần tạo gần nhất</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((rep) => (
                  <tr key={rep.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FileText size={18} color="var(--primary)" />
                        <strong>{rep.title}</strong>
                      </div>
                    </td>
                    <td>{rep.dashboardTitle || 'Dashboard'}</td>
                    <td>
                      <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
                        {rep.schedule === 'daily' ? 'Hàng ngày' : rep.schedule === 'weekly' ? 'Hàng tuần' : 'Hàng tháng'}
                      </span>
                    </td>
                    <td><strong>{rep.format.toUpperCase()}</strong></td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{rep.recipientEmail}</td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {new Date(rep.lastGeneratedAt).toLocaleString('vi-VN')}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          onClick={() => alert(`Đang tải file báo cáo mẫu định dạng ${rep.format.toUpperCase()}`)}
                          className="btn btn-secondary btn-sm"
                          title="Tải xuống ngay"
                        >
                          <Download size={13} />
                        </button>
                        <button onClick={() => handleDelete(rep.id)} className="btn btn-danger btn-sm">
                          <Trash2 size={13} />
                        </button>
                      </div>
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
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 18 }}>Tạo Lịch Báo Cáo Tự Động (USR-DBD10)</h3>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Tiêu đề báo cáo *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="VD: Báo cáo Doanh số Bán Hàng Tuần"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Chọn bảng điều khiển nguồn</label>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Tần suất xuất báo cáo</label>
                  <select
                    className="form-select"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value as any })}
                  >
                    <option value="daily">Hàng ngày (06:00 AM)</option>
                    <option value="weekly">Hàng tuần (Thứ Hai)</option>
                    <option value="monthly">Hàng tháng (Ngày 1)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Định dạng file</label>
                  <select
                    className="form-select"
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
                  >
                    <option value="pdf">Tài liệu PDF (.pdf)</option>
                    <option value="csv">Bảng dữ liệu CSV (.csv)</option>
                    <option value="json">Dữ liệu JSON (.json)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email người nhận</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.recipientEmail}
                  onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary">Kích Hoạt Lịch Trình</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
