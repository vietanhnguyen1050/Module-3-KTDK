import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Bell, User, LogOut, BookOpen, Shield, PlusCircle, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="nav-brand">
          <GraduationCap size={28} />
          <span>Edupress</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">Trang Chủ</Link>
          <Link to="/courses" className="nav-link">Tất Cả Khóa Học</Link>

          {user?.role === 'customer' && (
            <>
              <Link to="/my-courses" className="nav-link">
                <BookOpen size={16} /> Khóa Học Của Tôi
              </Link>
              <Link to="/register-provider" className="nav-link">
                <PlusCircle size={16} /> Trở Thành NCC
              </Link>
            </>
          )}

          {user?.role === 'provider' && (
            <Link to="/provider/courses" className="nav-link">
              <LayoutDashboard size={16} /> Quản Trị NCC
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link to="/admin/overview" className="nav-link">
              <Shield size={16} /> Bảng Điều Khiển Admin
            </Link>
          )}
        </div>

        <div className="nav-user">
          {user ? (
            <>
              <Link to="/notifications" className="nav-link" title="Thông báo">
                <Bell size={18} />
              </Link>
              <Link to="/profile" className="user-badge" title="Hồ sơ cá nhân">
                <img src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} alt="Avatar" className="user-avatar" />
                <span>{user.name.split(' ').slice(-2).join(' ')}</span>
                <span className={`role-tag ${user.role}`}>
                  {user.role === 'admin' ? 'Admin' : user.role === 'provider' ? 'NCC' : 'Học viên'}
                </span>
              </Link>
              <button onClick={() => { logout(); navigate('/'); }} className="btn btn-secondary btn-sm" title="Đăng xuất">
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Đăng Nhập</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Đăng Ký</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
