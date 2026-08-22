import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleSwitcher } from './components/layout/RoleSwitcher';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Market Pages
import { MarketOverview } from './pages/market/MarketOverview';
import { ChartAnalysis } from './pages/market/ChartAnalysis';

// Trader Pages
import { SpotTrading } from './pages/trader/SpotTrading';
import { OrderHistory } from './pages/trader/OrderHistory';
import { AssetWallet } from './pages/trader/AssetWallet';
import { PriceAlerts } from './pages/trader/PriceAlerts';
import { Promotions } from './pages/trader/Promotions';
import { SupportTickets } from './pages/trader/SupportTickets';
import { AccountSecurity } from './pages/trader/AccountSecurity';

// Admin Pages
import { AdminOverview } from './pages/admin/AdminOverview';
import { UserManagement } from './pages/admin/UserManagement';
import { TransactionAudit } from './pages/admin/TransactionAudit';
import { AssetReserves } from './pages/admin/AssetReserves';
import { PairManagement } from './pages/admin/PairManagement';
import { PromotionManagement } from './pages/admin/PromotionManagement';
import { SupportManagement } from './pages/admin/SupportManagement';
import { SecurityControl } from './pages/admin/SecurityControl';
import { ApiManagement } from './pages/admin/ApiManagement';
import { NotificationBroadcast } from './pages/admin/NotificationBroadcast';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({ children, requireAdmin }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>Đang kết nối Crypto Planet...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/market" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppLayout>{children}</AppLayout>;
};

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <RoleSwitcher />
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Market & Chart (Public / Viewer) */}
        <Route path="/" element={<Navigate to="/market" replace />} />
        <Route path="/market" element={<PublicLayout><MarketOverview /></PublicLayout>} />
        <Route path="/chart" element={<PublicLayout><ChartAnalysis /></PublicLayout>} />

        {/* Trader Protected Routes */}
        <Route path="/trade" element={<ProtectedRoute><SpotTrading /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><AssetWallet /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><PriceAlerts /></ProtectedRoute>} />
        <Route path="/promotions" element={<ProtectedRoute><Promotions /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><SupportTickets /></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute><AccountSecurity /></ProtectedRoute>} />

        {/* Admin Protected Routes */}
        <Route path="/admin/overview" element={<ProtectedRoute requireAdmin><AdminOverview /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requireAdmin><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute requireAdmin><TransactionAudit /></ProtectedRoute>} />
        <Route path="/admin/reserves" element={<ProtectedRoute requireAdmin><AssetReserves /></ProtectedRoute>} />
        <Route path="/admin/pairs" element={<ProtectedRoute requireAdmin><PairManagement /></ProtectedRoute>} />
        <Route path="/admin/promotions" element={<ProtectedRoute requireAdmin><PromotionManagement /></ProtectedRoute>} />
        <Route path="/admin/support" element={<ProtectedRoute requireAdmin><SupportManagement /></ProtectedRoute>} />
        <Route path="/admin/security" element={<ProtectedRoute requireAdmin><SecurityControl /></ProtectedRoute>} />
        <Route path="/admin/api-keys" element={<ProtectedRoute requireAdmin><ApiManagement /></ProtectedRoute>} />
        <Route path="/admin/broadcast" element={<ProtectedRoute requireAdmin><NotificationBroadcast /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/market" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
