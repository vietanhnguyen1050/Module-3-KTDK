import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, User, Shield } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { user, switchRoleDemo } = useAuth();

  return (
    <div className="role-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
        <Sparkles size={16} color="#38bdf8" />
        <span>DASHSTACK DEMO ROLE SWITCHER:</span>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button
          onClick={() => switchRoleDemo('user')}
          className={`role-btn ${user?.role === 'user' ? 'active' : ''}`}
        >
          <User size={13} style={{ display: 'inline', marginRight: 4 }} />
          1. User (Người dùng / Analyst)
        </button>

        <button
          onClick={() => switchRoleDemo('admin')}
          className={`role-btn ${user?.role === 'admin' ? 'active' : ''}`}
        >
          <Shield size={13} style={{ display: 'inline', marginRight: 4 }} />
          2. Admin (Quản trị viên hệ thống)
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
