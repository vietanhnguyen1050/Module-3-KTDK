import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IPayment } from '../../types';
import { CreditCard } from 'lucide-react';

export const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    const res = await api.getAdminPayments();
    if (res.success && res.data) setPayments(res.data);
    setLoading(false);
  };

  const formatVND = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Quản Lý Thanh Toán Từ Khách Hàng (AD-CT02)</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Theo dõi tất cả giao dịch thanh toán và trạng thái của từng đơn mua
        </p>
      </div>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: '18px 24px' }}>
        <div style={{ padding: 12, background: 'var(--success-light)', borderRadius: 10, color: 'var(--success)' }}>
          <CreditCard size={24} />
        </div>
        <div>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Tổng Doanh Thu Toàn Hệ Thống</span>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--success)' }}>{formatVND(totalRevenue)}</h3>
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 14, color: 'var(--text-muted)' }}>{payments.length} giao dịch</span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>Đang tải...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã GD</th>
                  <th>Khách hàng</th>
                  <th>Email</th>
                  <th>Khóa học</th>
                  <th>Số tiền</th>
                  <th>Phương thức</th>
                  <th>Trạng thái</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((pay) => (
                  <tr key={pay.id}>
                    <td><code style={{ fontSize: 12 }}>{pay.id}</code></td>
                    <td><strong>{pay.userName}</strong></td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{pay.userEmail}</td>
                    <td style={{ maxWidth: 200 }}>{pay.courseTitle}</td>
                    <td><strong style={{ color: 'var(--primary)' }}>{formatVND(pay.amount)}</strong></td>
                    <td>
                      <span className="badge badge-primary" style={{ textTransform: 'uppercase' }}>
                        {pay.paymentMethod.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {pay.status === 'completed' && <span className="badge badge-success">Thành công</span>}
                      {pay.status === 'pending' && <span className="badge badge-warning">Đang xử lý</span>}
                      {pay.status === 'failed' && <span className="badge badge-danger">Thất bại</span>}
                      {pay.status === 'refunded' && <span className="badge badge-danger">Hoàn tiền</span>}
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {new Date(pay.createdAt).toLocaleString('vi-VN')}
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
