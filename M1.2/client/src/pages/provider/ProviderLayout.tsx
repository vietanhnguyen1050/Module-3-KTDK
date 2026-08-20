import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BookOpen, Tag, Gift, DollarSign, Sparkles, Layers } from 'lucide-react';

export const ProviderLayout: React.FC = () => {
  return (
    <div className="page-wrapper container">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Khu Vực Quản Trị Nhà Cung Cấp (NCC)</h1>
        <p style={{ color: 'var(--text-muted)' }}>Quản lý các khóa học, bài giảng, mã giảm giá và báo cáo doanh thu</p>
      </div>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <ul className="sidebar-menu">
            <li>
              <NavLink to="/provider/courses" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                <BookOpen size={18} />
                <span>Quản Lý Khóa Học (IN-KH)</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/provider/discounts" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                <Tag size={18} />
                <span>Mã Giảm Giá (IN-UĐ01-03)</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/provider/promotions" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                <Sparkles size={18} />
                <span>Chương Trình Ưu Đãi (IN-UĐ04-06)</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/provider/gifts" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                <Gift size={18} />
                <span>Quản Lý Quà Tặng (IN-UĐ07)</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/provider/revenue" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                <DollarSign size={18} />
                <span>Báo Cáo Doanh Thu (N-DS)</span>
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
