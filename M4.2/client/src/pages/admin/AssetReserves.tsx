import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DollarSign, ShieldCheck, Lock, HardDrive } from 'lucide-react';

export const AssetReserves: React.FC = () => {
  const [reserves, setReserves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminReserves().then(res => {
      if (res.success && res.data) setReserves(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Quản Lý Tài Sản Lưu Ký & Quỹ Dự Trữ Sàn (AD-ADM03)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
          Kiểm toán bằng chứng dự trữ (Proof of Reserves - PoR) và phân bổ Ví Nóng (Hot Wallet) / Ví Lạnh (Cold Wallet)
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Đang tải dữ liệu tài sản sàn...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
          {reserves.map((r) => (
            <div key={r.symbol} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={r.icon || 'https://assets.coingecko.com/coins/images/325/small/Tether.png'} alt="" style={{ width: 26, height: 26, borderRadius: '50%' }} />
                  <strong style={{ fontSize: 16 }}>{r.symbol}</strong>
                </div>
                <span className="badge badge-buy"><ShieldCheck size={12} /> 100% Backed</span>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Tổng Lượng Lưu Trữ</div>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  {r.totalReserveAmount.toLocaleString()} {r.symbol}
                </div>
                <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 700, marginTop: 2 }}>
                  ≈ ${r.totalValueUSDT.toLocaleString()} USDT
                </div>
              </div>

              <div style={{ padding: 10, background: 'var(--bg-dark)', borderRadius: 6, fontSize: 11, display: 'flex', justifyContent: 'space-between' }}>
                <span>🔒 Ví Lạnh (Cold Storage): <b>{r.coldWalletRatio}</b></span>
                <span>⚡ Ví Nóng: <b>{r.hotWalletRatio}</b></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
