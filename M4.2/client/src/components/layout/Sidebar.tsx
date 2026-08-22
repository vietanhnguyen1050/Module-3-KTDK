import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  TrendingUp, BarChart2, Wallet, ArrowLeftRight,
  Bell, Gift, HelpCircle, Shield, Users,
  CheckCircle2, DollarSign, Tag, Key, Lock, Activity, Globe
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isTrader = user?.role === 'trader' || isAdmin;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Globe size={24} />
        <span>CryptoPlanet</span>
      </div>

      <div className="sidebar-nav">
        {/* Market & Viewing (Viewer / All) */}
        <div className="nav-heading">Thị Trường</div>
        <NavLink to="/market" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Globe size={16} />
          <span>Bảng Giá Thị Trường</span>
        </NavLink>
        <NavLink to="/chart" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <BarChart2 size={16} />
          <span>Biểu Đồ Phân Tích</span>
        </NavLink>

        {/* Trader Navigation */}
        {isTrader && (
          <>
            <div className="nav-heading" style={{ marginTop: 10 }}>Giao Dịch (Spot)</div>
            <NavLink to="/trade" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <TrendingUp size={16} />
              <span>Giao Dịch Giao Ngay</span>
            </NavLink>
            <NavLink to="/orders" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <ArrowLeftRight size={16} />
              <span>Lịch Sử Lệnh & Khớp</span>
            </NavLink>
            <NavLink to="/wallet" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Wallet size={16} />
              <span>Ví & Quản Lý Tài Sản</span>
            </NavLink>
          </>
        )}

        <div className="nav-heading" style={{ marginTop: 10 }}>Tiện Ích & Hỗ Trợ</div>
        <NavLink to="/alerts" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Bell size={16} />
          <span>Cảnh Báo Giá Coin</span>
        </NavLink>
        <NavLink to="/promotions" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Gift size={16} />
          <span>Sự Kiện & Airdrop</span>
        </NavLink>
        <NavLink to="/support" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <HelpCircle size={16} />
          <span>Yêu Cầu Hỗ Trợ</span>
        </NavLink>
        {user && (
          <NavLink to="/security" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Lock size={16} />
            <span>Hồ Sơ & Bảo Mật (2FA)</span>
          </NavLink>
        )}

        {/* Admin Navigation */}
        {isAdmin && (
          <>
            <div className="nav-heading" style={{ marginTop: 14, color: 'var(--primary)' }}>Quản Trị Sàn (Admin)</div>
            <NavLink to="/admin/overview" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Shield size={16} />
              <span>Báo Cáo & Tài Chính</span>
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={16} />
              <span>Quản Lý Người Dùng</span>
            </NavLink>
            <NavLink to="/admin/orders" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <CheckCircle2 size={16} />
              <span>Kiểm Duyệt Giao Dịch</span>
            </NavLink>
            <NavLink to="/admin/reserves" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <DollarSign size={16} />
              <span>Tài Sản Lưu Ký Sàn</span>
            </NavLink>
            <NavLink to="/admin/pairs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Tag size={16} />
              <span>Cặp Giao Dịch & Phí</span>
            </NavLink>
            <NavLink to="/admin/promotions" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Gift size={16} />
              <span>Quản Lý Khuyến Mãi</span>
            </NavLink>
            <NavLink to="/admin/support" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <HelpCircle size={16} />
              <span>Xử Lý Ticket Hỗ Trợ</span>
            </NavLink>
            <NavLink to="/admin/security" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Activity size={16} />
              <span>Bảo Mật & System Logs</span>
            </NavLink>
            <NavLink to="/admin/api-keys" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Key size={16} />
              <span>Quản Lý API Bot</span>
            </NavLink>
            <NavLink to="/admin/broadcast" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Bell size={16} />
              <span>Phát Thông Báo Toàn Sàn</span>
            </NavLink>
          </>
        )}
      </div>
    </aside>
  );
};
