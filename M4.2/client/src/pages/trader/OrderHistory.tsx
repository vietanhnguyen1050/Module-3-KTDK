import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IOrder } from '../../types';
import { ArrowLeftRight, CheckCircle, XCircle, Clock } from 'lucide-react';

export const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await api.getMyOrders();
    if (res.success && res.data) setOrders(res.data);
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Lịch Sử Lệnh Giao Dịch (TRD-TRD05)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
          Toàn bộ danh sách lệnh mua, bán, trạng thái khớp lệnh và chi tiết phí giao dịch
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Đang tải lịch sử...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã Lệnh</th>
                  <th>Thời gian</th>
                  <th>Cặp giao dịch</th>
                  <th>Loại</th>
                  <th>Mua / Bán</th>
                  <th>Giá thực hiện</th>
                  <th>Số lượng</th>
                  <th>Đã khớp</th>
                  <th>Tổng giá trị</th>
                  <th>Phí giao dịch</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.id}>
                    <td><code>{ord.id}</code></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {new Date(ord.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td><strong>{ord.symbol}</strong></td>
                    <td><code style={{ textTransform: 'uppercase' }}>{ord.type}</code></td>
                    <td>
                      <span className={ord.side === 'buy' ? 'badge badge-buy' : 'badge badge-sell'}>
                        {ord.side === 'buy' ? 'MUA' : 'BÁN'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>${ord.price.toLocaleString()}</td>
                    <td>{ord.amount}</td>
                    <td>{ord.filledAmount}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>${ord.totalValue.toLocaleString()} USDT</td>
                    <td style={{ color: 'var(--text-muted)' }}>${ord.fee} USDT</td>
                    <td>
                      {ord.status === 'completed' && <span className="badge badge-buy"><CheckCircle size={11} /> Đã Khớp</span>}
                      {ord.status === 'pending' && <span className="badge badge-primary"><Clock size={11} /> Đang Chờ</span>}
                      {ord.status === 'cancelled' && <span className="badge badge-secondary"><XCircle size={11} /> Đã Hủy</span>}
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
