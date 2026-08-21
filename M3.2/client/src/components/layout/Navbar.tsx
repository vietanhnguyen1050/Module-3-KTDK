import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, LogOut, Search, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 380 }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Tìm kiếm dashboard, báo cáo, widget..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--bg-main)',
              fontSize: 13
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {user ? (
          <>
            <Link to="/alerts" className="btn btn-secondary btn-sm" title="Thông báo & Cảnh báo">
              <Bell size={16} />
            </Link>

            <Link to="/account" className="user-profile-badge">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt=""
                style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
              />
              <span>{user.name}</span>
              <span className={`badge ${user.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>
                {user.role.toUpperCase()}
              </span>
            </Link>

            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="btn btn-secondary btn-sm"
              title="Đăng xuất"
            >
              <LogOut size={15} />
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/login" className="btn btn-secondary btn-sm">Đăng Nhập</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Đăng Ký</Link>
          </div>
        )}
      </div>
    </header>
  );
};
