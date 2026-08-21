import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { IDashboard } from '../../types';
import {
  LayoutDashboard, Plus, Eye, Edit2, Trash2,
  Share2, Globe, Lock, Clock, Users
} from 'lucide-react';

export const DashboardList: React.FC = () => {
  const [dashboards, setDashboards] = useState<IDashboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboards();
  }, []);

  const fetchDashboards = async () => {
    setLoading(true);
    const res = await api.getDashboards();
    if (res.success && res.data) {
      setDashboards(res.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Bạn có chắc chắn muốn xóa bảng điều khiển này (USR-DBD02)?')) return;
    await api.deleteDashboard(id);
    fetchDashboards();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Bảng Điều Khiển Của Tôi (USR-DBD02)</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Quản lý, trực quan hóa và tùy chỉnh các dashboard số liệu của bạn
          </p>
        </div>

        <Link to="/dashboards/new" className="btn btn-primary">
          <Plus size={16} /> Tạo Dashboard Mới (USR-DBD01)
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Đang tải danh sách bảng điều khiển...</div>
      ) : dashboards.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {dashboards.map((db) => (
            <Link to={`/dashboards/${db.id}`} key={db.id} className="card" style={{ display: 'flex', flexDirection: 'column', transition: 'all 0.2s', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span className="badge badge-primary">{db.category}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {db.isPublic ? (
                    <span className="badge badge-success" title="Công khai"><Globe size={12} /> Public</span>
                  ) : (
                    <span className="badge badge-warning" title="Riêng tư"><Lock size={12} /> Private</span>
                  )}
                </div>
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8, lineHeight: 1.4 }}>
                {db.title}
              </h3>

              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {db.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-muted)', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={13} />
                  <span>Cập nhật: {new Date(db.updatedAt).toLocaleDateString('vi-VN')}</span>
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={(e) => handleDelete(db.id, e)}
                    className="btn btn-danger btn-sm"
                    style={{ padding: '4px 8px' }}
                    title="Xóa dashboard"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '60px 0' }}>
          <LayoutDashboard size={48} style={{ margin: '0 auto 16px auto', color: '#cbd5e1' }} />
          <h3>Bạn chưa có bảng điều khiển nào</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8, marginBottom: 20 }}>
            Tạo ngay bảng điều khiển đầu tiên để bắt đầu theo dõi dữ liệu!
          </p>
          <Link to="/dashboards/new" className="btn btn-primary">
            Tạo Bảng Điều Khiển Mới
          </Link>
        </div>
      )}
    </div>
  );
};
