import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  Users, BookOpen, UserCheck, DollarSign,
  TrendingUp, Clock, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const OverviewReport: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    setLoading(true);
    const res = await api.getAdminOverview();
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Báo Cáo Tổng Quan Hệ Thống (AD-HT01)</h2>
        <p style={{ color: 'var(--text-muted)' }}>Theo dõi số lượng tài khoản, khóa học và doanh thu nền tảng Edupress</p>
      </div>

      {loading || !data ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>Đang tải dữ liệu tổng quan...</div>
      ) : (
        <>
          {/* Top Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 24 }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ padding: 12, background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 10 }}>
                <Users size={24} />
              </div>
              <div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Tổng Học Viên</span>
                <h3 style={{ fontSize: 20, fontWeight: 800 }}>{data.totalStudents}</h3>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ padding: 12, background: '#fef3c7', color: '#d97706', borderRadius: 10 }}>
                <UserCheck size={24} />
              </div>
              <div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Nhà Cung Cấp (NCC)</span>
                <h3 style={{ fontSize: 20, fontWeight: 800 }}>{data.totalProviders}</h3>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ padding: 12, background: '#e0e7ff', color: '#4338ca', borderRadius: 10 }}>
                <BookOpen size={24} />
              </div>
              <div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Tổng Khóa Học</span>
                <h3 style={{ fontSize: 20, fontWeight: 800 }}>{data.totalCourses}</h3>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ padding: 12, background: 'var(--success-light)', color: 'var(--success)', borderRadius: 10 }}>
                <DollarSign size={24} />
              </div>
              <div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Tổng Doanh Thu</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--success)' }}>{formatVND(data.totalRevenue)}</h3>
              </div>
            </div>
          </div>

          {/* Action Alerts */}
          {(data.pendingCourses > 0 || data.pendingProviders > 0) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
              {data.pendingCourses > 0 && (
                <div className="card" style={{ background: '#fffbeb', borderColor: '#fde68a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Clock size={20} color="#d97706" />
                    <div>
                      <strong style={{ color: '#92400e', fontSize: 14 }}>{data.pendingCourses} Khóa học chờ duyệt</strong>
                      <div style={{ fontSize: 12, color: '#b45309' }}>Khóa học mới do NCC gửi lên</div>
                    </div>
                  </div>
                  <Link to="/admin/courses" className="btn btn-primary btn-sm">Duyệt ngay</Link>
                </div>
              )}

              {data.pendingProviders > 0 && (
                <div className="card" style={{ background: '#eff6ff', borderColor: '#bfdbfe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <AlertTriangle size={20} color="#2563eb" />
                    <div>
                      <strong style={{ color: '#1e40af', fontSize: 14 }}>{data.pendingProviders} Hồ sơ NCC chờ duyệt</strong>
                      <div style={{ fontSize: 12, color: '#3b82f6' }}>Yêu cầu trở thành NCC từ học viên</div>
                    </div>
                  </div>
                  <Link to="/admin/providers" className="btn btn-primary btn-sm">Xem hồ sơ</Link>
                </div>
              )}
            </div>
          )}

          {/* Recent Payments */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>Giao Dịch Gần Đây</h3>
              <Link to="/admin/payments" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>Xem tất cả →</Link>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã GD</th>
                    <th>Người mua</th>
                    <th>Khóa học</th>
                    <th>Số tiền</th>
                    <th>Trạng thái</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentPayments?.map((pay: any) => (
                    <tr key={pay.id}>
                      <td><code>{pay.id}</code></td>
                      <td>{pay.userName}</td>
                      <td>{pay.courseTitle}</td>
                      <td><strong style={{ color: 'var(--primary)' }}>{formatVND(pay.amount)}</strong></td>
                      <td><span className="badge badge-success">Thành công</span></td>
                      <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date(pay.createdAt).toLocaleString('vi-VN')}</td>
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
