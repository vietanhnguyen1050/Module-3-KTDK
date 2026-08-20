import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Sparkles, User, GraduationCap, Briefcase } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { user, switchRoleDemo } = useAuth();

  return (
    <div className="role-switcher-banner">
      <div className="role-switcher-left">
        <Sparkles size={16} className="text-yellow-400" />
        <span>CHẾ ĐỘ TEST NHANH VAI TRÒ (MODULE 1):</span>
      </div>
      <div className="role-buttons">
        <button
          onClick={() => switchRoleDemo('customer')}
          className={`role-btn ${user?.role === 'customer' ? 'active' : ''}`}
        >
          <User size={13} style={{ display: 'inline', marginRight: 4 }} />
          1. Khách Hàng (Học viên)
        </button>
        <button
          onClick={() => switchRoleDemo('provider')}
          className={`role-btn ${user?.role === 'provider' ? 'active' : ''}`}
        >
          <Briefcase size={13} style={{ display: 'inline', marginRight: 4 }} />
          2. Nhà Cung Cấp (NCC)
        </button>
        <button
          onClick={() => switchRoleDemo('admin')}
          className={`role-btn ${user?.role === 'admin' ? 'active' : ''}`}
        >
          <Shield size={13} style={{ display: 'inline', marginRight: 4 }} />
          3. Quản Trị Viên (Admin)
        </button>
        <button
          onClick={() => switchRoleDemo('guest')}
          className={`role-btn ${!user ? 'active' : ''}`}
        >
          Khách Vãng Lai (Chưa đăng nhập)
        </button>
      </div>
    </div>
  );
};
