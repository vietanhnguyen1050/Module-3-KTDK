import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Database, Bell, FileText, Share2,
  History, HelpCircle, User, Shield, Users, Lock,
  Key, Activity, CreditCard, Package, LogIn, HardDrive, PlusCircle
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <LayoutDashboard size={26} color="var(--primary)" />
        <span>Dashstack</span>
      </div>

      <div className="sidebar-nav">
        {/* User Navigation (USR-DBD...) */}
        <div className="nav-heading">Bảng Điều Khiển</div>
        <NavLink to="/dashboards" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={17} />
          <span>Danh Sách Dashboard</span>
        </NavLink>
        <NavLink to="/dashboards/new" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <PlusCircle size={17} />
          <span>Tạo Bảng Điều Khiển</span>
        </NavLink>
        <NavLink to="/datasources" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Database size={17} />
          <span>Tích Hợp Dữ Liệu</span>
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FileText size={17} />
          <span>Báo Cáo & Xuất File</span>
        </NavLink>
        <NavLink to="/alerts" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Bell size={17} />
          <span>Cài Đặt Cảnh Báo</span>
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <History size={17} />
          <span>Lịch Sử Thay Đổi</span>
        </NavLink>
        <NavLink to="/support" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <HelpCircle size={17} />
          <span>Yêu Cầu Hỗ Trợ</span>
        </NavLink>
        <NavLink to="/account" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <User size={17} />
          <span>Tài Khoản Cá Nhân</span>
        </NavLink>

        {/* Admin Navigation (AD-ADM...) */}
        {isAdmin && (
          <>
            <div className="nav-heading" style={{ marginTop: 12 }}>Quản Trị Hệ Thống</div>
            <NavLink to="/admin/overview" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Shield size={17} />
              <span>Tổng Quan Hệ Thống</span>
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={17} />
              <span>Quản Lý Người Dùng</span>
            </NavLink>
            <NavLink to="/admin/dashboards" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={17} />
              <span>Quản Lý Dashboards</span>
            </NavLink>
            <NavLink to="/admin/notifications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Bell size={17} />
              <span>Gửi Thông Báo</span>
            </NavLink>
            <NavLink to="/admin/security" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Lock size={17} />
              <span>Cấu Hình Bảo Mật</span>
            </NavLink>
            <NavLink to="/admin/api-keys" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Key size={17} />
              <span>Quản Lý API</span>
            </NavLink>
            <NavLink to="/admin/logs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Activity size={17} />
              <span>Nhật Ký & Event Logs</span>
            </NavLink>
            <NavLink to="/admin/payments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <CreditCard size={17} />
              <span>Tài Khoản Thanh Toán</span>
            </NavLink>
            <NavLink to="/admin/packages" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Package size={17} />
              <span>Gói Dịch Vụ</span>
            </NavLink>
            <NavLink to="/admin/sessions" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LogIn size={17} />
              <span>Giám Sát Đăng Nhập</span>
            </NavLink>
            <NavLink to="/admin/backups" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <HardDrive size={17} />
              <span>Backup Dữ Liệu</span>
            </NavLink>
          </>
        )}
      </div>
    </aside>
  );
};
