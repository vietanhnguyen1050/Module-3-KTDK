import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Shield, TrendingUp, Users, DollarSign, Activity, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminOverview: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminOverview().then(res => {
      if (res.success && res.data) setData(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Báo Cáo & Quản Lý Tài Chính Sàn (AD-ADM05 / AD-ADM10)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
          Tổng quan khối lượng giao dịch, doanh thu từ phí sàn, tài sản lưu ký và lợi nhuận ròng
        </p>
      </div>

      {loading || !data ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Đang tải báo cáo sàn...</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
            <div className="card" style={{ padding: 18 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>KHỐI LƯỢNG GIAO DỊCH 24H</span>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)', margin: '6px 0' }}>
                ${(data.financials.totalVolume24h / 1e6).toFixed(2)}M
              </h3>
              <span style={{ fontSize: 11, color: 'var(--buy)' }}>{data.financials.totalTradesCount.toLocaleString()} lượt khớp lệnh</span>
            </div>

            <div className="card" style={{ padding: 18 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>DOANH THU PHÍ SÀN (FEE REVENUE)</span>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--buy)', fontFamily: 'var(--font-mono)', margin: '6px 0' }}>
                ${data.financials.totalFeeRevenue.toLocaleString()}
              </h3>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Maker 0.1% + Taker 0.15%</span>
            </div>

            <div className="card" style={{ padding: 18 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>TÀI SẢN LƯU KÝ (EXCHANGE RESERVES)</span>
              <h3 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-mono)', margin: '6px 0' }}>
                ${(data.financials.platformReservesUSDT / 1e6).toFixed(1)}M
              </h3>
              <span style={{ fontSize: 11, color: 'var(--buy)' }}>Proof of Reserves 100%</span>
            </div>

            <div className="card" style={{ padding: 18 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>LỢI NHUẬN RÒNG SÀN (NET PROFIT)</span>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)', margin: '6px 0' }}>
                ${data.financials.netProfitUSDT.toLocaleString()}
              </h3>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Sau chi phí Server & An ninh mạng</span>
            </div>
          </div>

          {/* Recent Orders audit */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 800 }}>Lệnh Giao Dịch Khớp Gần Nhất (Audit)</h3>
              <Link to="/admin/orders" style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700 }}>Xem tất cả →</Link>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã Lệnh</th>
                    <th>Trader</th>
                    <th>Cặp Coin</th>
                    <th>Loại & Chiều</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Tổng (USDT)</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map((ord: any) => (
                    <tr key={ord.id}>
                      <td><code>{ord.id}</code></td>
                      <td>{ord.userName}</td>
                      <td><strong>{ord.symbol}</strong></td>
                      <td>
                        <span className={ord.side === 'buy' ? 'badge badge-buy' : 'badge badge-sell'}>
                          {ord.type.toUpperCase()} {ord.side === 'buy' ? 'BUY' : 'SELL'}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>${ord.price.toLocaleString()}</td>
                      <td>{ord.amount}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>${ord.totalValue.toLocaleString()}</td>
                      <td>
                        {ord.status === 'completed' && <span className="badge badge-buy">Đã Khớp</span>}
                        {ord.status === 'pending' && <span className="badge badge-primary">Chờ Khớp</span>}
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
