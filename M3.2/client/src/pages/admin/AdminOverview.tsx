import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  Users, LayoutDashboard, Database, HelpCircle,
  TrendingUp, Shield, Activity, HardDrive
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminOverview: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res = await api.getAdminOverview();
    if (res.success && res.data) setData(res.data);
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Báo Cáo Tổng Quan Hệ Thống (AD-ADM07)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Giám sát hoạt động, số lượng bảng điều khiển, người dùng và tài nguyên hệ thống Dashstack
        </p>
      </div>

      {loading || !data ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Đang tải báo cáo tổng quan...</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="stat-grid" style={{ marginBottom: 32 }}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                <Users size={26} />
              </div>
              <div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Tổng Người Dùng</span>
                <h3 style={{ fontSize: 24, fontWeight: 800 }}>{data.totalUsers}</h3>
                <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 700 }}>{data.activeUsers} đang hoạt động</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                <LayoutDashboard size={26} />
              </div>
              <div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Tổng Bảng Điều Khiển</span>
                <h3 style={{ fontSize: 24, fontWeight: 800 }}>{data.totalDashboards}</h3>
                <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700 }}>Dashboards realtime</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                <Database size={26} />
              </div>
              <div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Nguồn Dữ Liệu Tích Hợp</span>
                <h3 style={{ fontSize: 24, fontWeight: 800 }}>{data.totalDataSources}</h3>
                <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 700 }}>100% kết nối ổn định</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
                <HelpCircle size={26} />
              </div>
              <div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Hỗ Trợ Chờ Xử Lý</span>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: data.openTickets > 0 ? 'var(--danger)' : 'var(--success)' }}>
                  {data.openTickets}
                </h3>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Tickets kỹ thuật</span>
              </div>
            </div>
          </div>

          {/* Recent Dashboards Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 32 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>Bảng Điều Khiển Mới Nhất</h3>
              <Link to="/admin/dashboards" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 700 }}>Quản lý tất cả →</Link>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tên Dashboard</th>
                    <th>Tác giả</th>
                    <th>Danh mục</th>
                    <th>Layout</th>
                    <th>Theme</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentDashboards?.map((d: any) => (
                    <tr key={d.id}>
                      <td><strong>{d.title}</strong></td>
                      <td>{d.userName}</td>
                      <td><span className="badge badge-primary">{d.category}</span></td>
                      <td><code style={{ textTransform: 'capitalize' }}>{d.layout}</code></td>
                      <td><code style={{ textTransform: 'capitalize' }}>{d.theme}</code></td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(d.createdAt).toLocaleDateString('vi-VN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
