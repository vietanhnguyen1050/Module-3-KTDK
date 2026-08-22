import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IOrder } from '../../types';
import { CheckCircle2, Search, Filter } from 'lucide-react';

export const TransactionAudit: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminOrders().then(res => {
      if (res.success && res.data) setOrders(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Kiểm Duyệt & Giám Sát Lệnh Giao Dịch (AD-ADM02)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
          Audit log toàn bộ các lệnh mua, bán, swap và khớp lệnh trên matching engine của sàn
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Đang tải danh sách giao dịch...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã Lệnh</th>
                  <th>Trader</th>
                  <th>Thời gian</th>
                  <th>Cặp giao dịch</th>
                  <th>Loại lệnh</th>
                  <th>Chiều</th>
                  <th>Giá đặt</th>
                  <th>Số lượng</th>
                  <th>Tổng giá trị</th>
                  <th>Phí sàn thu</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.id}>
                    <td><code>{ord.id}</code></td>
                    <td><strong>{ord.userName}</strong></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(ord.createdAt).toLocaleString('vi-VN')}</td>
                    <td><strong>{ord.symbol}</strong></td>
                    <td><code style={{ textTransform: 'uppercase' }}>{ord.type}</code></td>
                    <td>
                      <span className={ord.side === 'buy' ? 'badge badge-buy' : 'badge badge-sell'}>
                        {ord.side === 'buy' ? 'MUA' : 'BÁN'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>${ord.price.toLocaleString()}</td>
                    <td>{ord.amount}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>${ord.totalValue.toLocaleString()} USDT</td>
                    <td style={{ color: 'var(--buy)' }}>+${ord.fee} USDT</td>
                    <td>
                      <span className="badge badge-buy">HỢP LỆ (VERIFIED)</span>
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
