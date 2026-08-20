import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, UserCheck,
  CreditCard, Bell, Shield, DollarSign
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  return (
    <div className="page-wrapper container">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Bảng Điều Khiển Quản Trị Hệ Thống (Admin)</h1>
        <p style={{ color: 'var(--text-muted)' }}>Giám sát toàn bộ hoạt động, kiểm duyệt khóa học, quản lý NCC và tài chính</p>
      </div>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <ul className="sidebar-menu">
            <li>
              <NavLink to="/admin/overview" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={18} />
                <span>Báo Cáo Tổng Quan (AD-HT01)</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/courses" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                <BookOpen size={18} />
                <span>Duyệt & Quản Lý Khóa Học (AD-KH)</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/providers" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                <UserCheck size={18} />
                <span>Quản Lý & Duyệt NCC (AD-NCC)</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/customers" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                <Users size={18} />
                <span>Quản Lý Khách Hàng (AD-CT01)</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/payments" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                <CreditCard size={18} />
                <span>Quản Lý Thanh Toán (AD-CT02)</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/financials" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                <DollarSign size={18} />
                <span>Quản Lý Tài Chính (AD-HT03)</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/notifications" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                <Bell size={18} />
                <span>Gửi Thông Báo (AD-HT02)</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/access-control" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                <Shield size={18} />
                <span>Phân Quyền Truy Cập (AD-HT06)</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
