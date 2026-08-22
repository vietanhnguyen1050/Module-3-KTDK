import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IPromotion } from '../../types';
import { Gift, Tag, CheckCircle2, Sparkles } from 'lucide-react';

export const Promotions: React.FC = () => {
  const [promos, setPromos] = useState<IPromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimedCodes, setClaimedCodes] = useState<string[]>([]);

  useEffect(() => {
    api.getPromotions().then(res => {
      if (res.success && res.data) setPromos(res.data);
      setLoading(false);
    });
  }, []);

  const handleClaim = (code: string) => {
    setClaimedCodes([...claimedCodes, code]);
    alert(`Đã áp dụng mã ưu đãi: ${code}! Ưu đãi sẽ tự động kích hoạt cho tài khoản.`);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Chương Trình Khuyến Mãi & Airdrop (TRD-PRM01)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
          Săn airdrop token, voucher miễn giảm phí giao dịch và các sự kiện độc quyền
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Đang tải khuyến mãi...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {promos.map((p) => (
            <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
              <div style={{ height: 140, overflow: 'hidden', position: 'relative' }}>
                <img src={p.bannerUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                  <span className="badge badge-primary" style={{ background: '#000', color: 'var(--primary)' }}>
                    <Sparkles size={11} /> {p.rewardText}
                  </span>
                </div>
              </div>

              <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>{p.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, flex: 1 }}>
                  {p.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Mã Voucher: </span>
                    <code style={{ color: 'var(--primary)', fontWeight: 700 }}>{p.code}</code>
                  </div>

                  <button
                    onClick={() => handleClaim(p.code)}
                    className={`btn btn-sm ${claimedCodes.includes(p.code) ? 'btn-secondary' : 'btn-primary'}`}
                    disabled={claimedCodes.includes(p.code)}
                  >
                    {claimedCodes.includes(p.code) ? 'Đã Nhận' : 'Nhận Ngay'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
