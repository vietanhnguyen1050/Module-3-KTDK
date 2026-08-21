import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IDashboard } from '../../types';
import { LayoutDashboard, Eye, Trash2, Globe, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardManagement: React.FC = () => {
  const [dashboards, setDashboards] = useState<IDashboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res = await api.getAdminDashboards();
    if (res.success && res.data) setDashboards(res.data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa bảng điều khiển này khỏi toàn hệ thống?')) return;
    await api.deleteDashboard(id);
    fetchData();
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Quản Lý Bảng Điều Khiển Hệ Thống (AD-ADM04)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Giám sát, kiểm duyệt và quản lý toàn bộ các dashboard được tạo bởi người dùng
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Đang tải danh sách dashboard...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên Dashboard</th>
                  <th>Chủ sở hữu</th>
                  <th>Danh mục</th>
                  <th>Bố cục & Theme</th>
                  <th>Trạng thái chia sẻ</th>
                  <th>Ngày tạo</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {dashboards.map((db) => (
                  <tr key={db.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <LayoutDashboard size={18} color="var(--primary)" />
                        <div>
                          <strong>{db.title}</strong>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{db.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{db.userName}</td>
                    <td><span className="badge badge-primary">{db.category}</span></td>
                    <td><code style={{ fontSize: 12 }}>{db.layout} / {db.theme}</code></td>
                    <td>
                      {db.isPublic ? (
                        <span className="badge badge-success"><Globe size={11} /> Public Web</span>
                      ) : (
                        <span className="badge badge-warning"><Lock size={11} /> Private</span>
                      )}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(db.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <Link to={`/dashboards/${db.id}`} className="btn btn-secondary btn-sm" title="Xem chi tiết">
                          <Eye size={13} />
                        </Link>
                        <button onClick={() => handleDelete(db.id)} className="btn btn-danger btn-sm" title="Xóa">
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
    </div>
  );
};
