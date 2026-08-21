import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IServicePackage } from '../../types';
import { Package, Check, Sparkles } from 'lucide-react';

export const PackageManagement: React.FC = () => {
  const [packages, setPackages] = useState<IServicePackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    const res = await api.getAdminPackages();
    if (res.success && res.data) setPackages(res.data);
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Quản Lý Các Gói Dịch Vụ (AD-ADM12)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Cấu hình quyền lợi, giới hạn số lượng Dashboard, Data Sources và mức phí theo từng gói cước
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Đang tải danh sách gói cước...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="card"
              style={{
                display: 'flex', flexDirection: 'column',
                border: pkg.isPopular ? '2px solid var(--primary)' : '1px solid var(--border)',
                position: 'relative'
              }}
            >
              {pkg.isPopular && (
                <div style={{
                  position: 'absolute', top: -12, right: 20,
                  background: 'var(--primary)', color: 'white',
                  padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 800
                }}>
                  PHỔ BIẾN NHẤT
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800 }}>{pkg.name}</h3>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)', margin: '10px 0' }}>
                  ${pkg.price} <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 400 }}>/ tháng</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Tốc độ làm mới: <strong>{pkg.refreshRate}</strong>
                </div>
              </div>

              <div style={{ padding: '12px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
                <div style={{ fontSize: 13, marginBottom: 6 }}>
                  • Giới hạn Dashboard: <strong>{pkg.maxDashboards >= 999 ? 'Không giới hạn' : `${pkg.maxDashboards} dashboards`}</strong>
                </div>
                <div style={{ fontSize: 13 }}>
                  • Nguồn dữ liệu kết nối: <strong>{pkg.maxDataSources >= 999 ? 'Không giới hạn' : `${pkg.maxDataSources} sources`}</strong>
                </div>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24, flex: 1 }}>
                {pkg.features.map((feat, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155' }}>
                    <Check size={15} color="var(--success)" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => alert(`Chức năng chỉnh sửa thông số gói ${pkg.name}`)}
                className={`btn ${pkg.isPopular ? 'btn-primary' : 'btn-secondary'}`}
              >
                Chỉnh Sửa Gói Dịch Vụ (AD-ADM12)
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
