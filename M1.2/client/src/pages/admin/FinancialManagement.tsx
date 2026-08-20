import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DollarSign, TrendingUp, TrendingDown, Server } from 'lucide-react';

export const FinancialManagement: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminFinancials().then(res => {
      if (res.success && res.data) setData(res.data);
      setLoading(false);
    });
  }, []);

  const formatVND = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Quản Lý Tài Chính Hệ Thống (AD-HT03)</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Tổng quan doanh thu, phí nền tảng, chi trả NCC và lợi nhuận ròng của Edupress
        </p>
      </div>

      {loading || !data ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>Đang tải...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ padding: 14, background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 12 }}>
              <DollarSign size={28} />
            </div>
            <div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Tổng Doanh Thu Gộp</span>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>{formatVND(data.grossRevenue)}</h3>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{data.transactionCount} giao dịch</span>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ padding: 14, background: 'var(--success-light)', color: 'var(--success)', borderRadius: 12 }}>
              <TrendingUp size={28} />
            </div>
            <div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Phí Nền Tảng (20%)</span>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--success)' }}>{formatVND(data.platformFee)}</h3>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ padding: 14, background: 'var(--warning-light)', color: 'var(--warning)', borderRadius: 12 }}>
              <TrendingDown size={28} />
            </div>
            <div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Chi Trả NCC (80%)</span>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--warning)' }}>{formatVND(data.providerPayout)}</h3>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ padding: 14, background: '#fce7f3', color: '#db2777', borderRadius: 12 }}>
              <Server size={28} />
            </div>
            <div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Chi Phí Vận Hành</span>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#db2777' }}>{formatVND(data.serverAndOpCost)}</h3>
            </div>
          </div>

          <div className="card" style={{
            display: 'flex', alignItems: 'center', gap: 16,
            gridColumn: '1 / -1',
            background: data.netProfit >= 0 ? 'var(--success-light)' : 'var(--danger-light)',
            borderColor: data.netProfit >= 0 ? 'var(--success)' : 'var(--danger)'
          }}>
            <div style={{ padding: 14, background: 'white', borderRadius: 12, color: data.netProfit >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              <DollarSign size={32} />
            </div>
            <div>
              <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 700 }}>
                LỢI NHUẬN RÒNG = Phí Nền Tảng - Chi Phí Vận Hành
              </span>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: data.netProfit >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                {formatVND(data.netProfit)}
              </h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
