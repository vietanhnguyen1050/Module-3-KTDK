import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Wallet, LogOut, Bell, Shield, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>BTC/USDT:</span>
          <span className="price-up" style={{ fontSize: 13 }}>$67,450.00 (+3.42%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>ETH/USDT:</span>
          <span className="price-down" style={{ fontSize: 13 }}>$3,520.50 (-1.15%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>SOL/USDT:</span>
          <span className="price-up" style={{ fontSize: 13 }}>$184.20 (+8.75%)</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {user ? (
          <>
            <Link to="/wallet" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Wallet size={14} color="var(--primary)" />
              <span>Ví Tài Sản</span>
            </Link>

            <Link to="/alerts" className="btn btn-secondary btn-sm" title="Cảnh báo giá">
              <Bell size={14} />
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', background: 'var(--bg-elevated)', borderRadius: 20, fontSize: 12 }}>
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt=""
                style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontWeight: 600 }}>{user.name}</span>
              <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                {user.role.toUpperCase()}
              </span>
            </div>

            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="btn btn-secondary btn-sm"
              title="Đăng xuất"
            >
              <LogOut size={14} />
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
