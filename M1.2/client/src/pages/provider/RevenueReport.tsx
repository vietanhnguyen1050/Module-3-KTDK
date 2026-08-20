import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DollarSign, Users, BookOpen, TrendingUp, Calendar } from 'lucide-react';

export const RevenueReport: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    const res = await api.getProviderRevenue();
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
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Báo Cáo & Chi Tiết Doanh Thu (N-DS01 / IN-DS02)</h2>
        <p style={{ color: 'var(--text-muted)' }}>Thống kê tổng quan doanh thu và số lượng học viên đăng ký theo từng khóa học</p>
      </div>

      {loading || !data ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>Đang tải báo cáo...</div>
      ) : (
        <>
          {/* Stat Cards (N-DS01) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ padding: 14, background: 'var(--success-light)', borderRadius: 12, color: 'var(--success)' }}>
                <DollarSign size={28} />
              </div>
              <div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Tổng Doanh Thu</span>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--success)' }}>{formatVND(data.totalRevenue)}</h3>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ padding: 14, background: 'var(--primary-light)', borderRadius: 12, color: 'var(--primary)' }}>
                <Users size={28} />
              </div>
              <div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Tổng Lượt Mua</span>
                <h3 style={{ fontSize: 22, fontWeight: 800 }}>{data.totalStudents} học viên</h3>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ padding: 14, background: 'var(--warning-light)', borderRadius: 12, color: 'var(--warning)' }}>
                <BookOpen size={28} />
              </div>
              <div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Khóa Học Đang Bán</span>
                <h3 style={{ fontSize: 22, fontWeight: 800 }}>{data.totalCourses} khóa</h3>
              </div>
            </div>
          </div>

          {/* Chi tiết từng khóa học (IN-DS02) */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 32 }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>Chi Tiết Doanh Thu Từng Khóa Học (IN-DS02)</h3>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Khóa học</th>
                    <th>Đơn giá</th>
                    <th>Số lượt bán</th>
                    <th>Tổng doanh thu</th>
                    <th>Đóng góp</th>
                  </tr>
                </thead>
                <tbody>
                  {data.courseBreakdown?.map((item: any) => {
                    const percent = data.totalRevenue > 0 ? Math.round((item.revenue / data.totalRevenue) * 100) : 0;
                    return (
                      <tr key={item.courseId}>
                        <td><strong>{item.courseTitle}</strong></td>
                        <td>{formatVND(item.price)}</td>
                        <td>{item.salesCount} lượt</td>
                        <td><strong style={{ color: 'var(--success)' }}>{formatVND(item.revenue)}</strong></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 80, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: `${percent}%`, height: '100%', background: 'var(--primary)' }} />
                            </div>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{percent}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lịch sử giao dịch gần đây */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>Giao Dịch Gần Đây</h3>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã GD</th>
                    <th>Khách hàng</th>
                    <th>Khóa học</th>
                    <th>Số tiền</th>
                    <th>Phương thức</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentTransactions?.map((tx: any) => (
                    <tr key={tx.id}>
                      <td><code>{tx.id}</code></td>
                      <td>{tx.userName} ({tx.userEmail})</td>
                      <td>{tx.courseTitle}</td>
                      <td><strong style={{ color: 'var(--primary)' }}>{formatVND(tx.amount)}</strong></td>
                      <td><span className="badge badge-primary">{tx.paymentMethod.toUpperCase()}</span></td>
                      <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {new Date(tx.createdAt).toLocaleString('vi-VN')}
                      </td>
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
