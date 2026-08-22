import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Zap, Shield, User, Eye } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { user, switchRoleDemo } = useAuth();

  return (
    <div className="role-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
        <Zap size={16} color="var(--primary)" />
        <span style={{ color: 'var(--primary)' }}>CRYPTO PLANET ROLE SWITCHER:</span>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button
          onClick={() => switchRoleDemo('trader')}
          className={`role-btn ${user?.role === 'trader' ? 'active' : ''}`}
        >
          <User size={13} style={{ display: 'inline', marginRight: 4 }} />
          1. Trader (Giao Dịch / Ví)
        </button>

        <button
          onClick={() => switchRoleDemo('admin')}
          className={`role-btn ${user?.role === 'admin' ? 'active' : ''}`}
        >
          <Shield size={13} style={{ display: 'inline', marginRight: 4 }} />
          2. Admin (Quản Trị Sàn)
        </button>

        <button
          onClick={() => switchRoleDemo('viewer')}
          className={`role-btn ${user?.role === 'viewer' ? 'active' : ''}`}
        >
          <Eye size={13} style={{ display: 'inline', marginRight: 4 }} />
          3. Viewer (Xem Thị Trường)
        </button>

        <button
          onClick={() => switchRoleDemo('guest')}
          className={`role-btn ${!user ? 'active' : ''}`}
        >
          Khách Vãng Lai
        </button>
      </div>
    </div>
  );
};
