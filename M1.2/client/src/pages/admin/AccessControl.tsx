import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Shield, CheckCircle } from 'lucide-react';

export const AccessControl: React.FC = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminAccessControl().then(res => {
      if (res.success && res.data) setRoles(res.data);
      setLoading(false);
    });
  }, []);

  const roleColors: Record<string, string> = {
    admin: '#fee2e2',
    provider: '#fef3c7',
    customer: '#e0e7ff'
  };

  const roleTextColors: Record<string, string> = {
    admin: '#dc2626',
    provider: '#d97706',
    customer: '#4338ca'
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Quản Lý & Phân Quyền Truy Cập (AD-HT06)</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Xem cấu hình phân quyền theo vai trò người dùng trên hệ thống Edupress
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>Đang tải...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {roles.map((role) => (
            <div key={role.role} className="card" style={{ borderTop: `4px solid ${roleTextColors[role.role] || '#4f46e5'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{
                  padding: 10,
                  background: roleColors[role.role] || '#e0e7ff',
                  borderRadius: 10,
                  color: roleTextColors[role.role] || '#4338ca'
                }}>
                  <Shield size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800 }}>{role.name}</h3>
                  <span className={`role-tag ${role.role}`}>{role.role.toUpperCase()}</span>
                </div>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {role.permissions.map((perm: string, i: number) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#334155' }}>
                    <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
