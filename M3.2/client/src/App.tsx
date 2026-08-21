import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleSwitcher } from './components/layout/RoleSwitcher';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// User Pages
import { DashboardList } from './pages/user/DashboardList';
import { DashboardView } from './pages/user/DashboardView';
import { DashboardCreate } from './pages/user/DashboardCreate';
import { DataIntegration } from './pages/user/DataIntegration';
import { Reports } from './pages/user/Reports';
import { AlertSettings } from './pages/user/AlertSettings';
import { HistoryChange } from './pages/user/HistoryChange';
import { SupportTicket } from './pages/user/SupportTicket';
import { AccountSettings } from './pages/user/AccountSettings';

// Admin Pages
import { AdminOverview } from './pages/admin/AdminOverview';
import { UserManagement } from './pages/admin/UserManagement';
import { DashboardManagement } from './pages/admin/DashboardManagement';
import { NotificationManagement } from './pages/admin/NotificationManagement';
import { SecurityManagement } from './pages/admin/SecurityManagement';
import { ApiManagement } from './pages/admin/ApiManagement';
import { SystemLogs } from './pages/admin/SystemLogs';
import { PaymentManagement } from './pages/admin/PaymentManagement';
import { PackageManagement } from './pages/admin/PackageManagement';
import { LoginManagement } from './pages/admin/LoginManagement';
import { BackupManagement } from './pages/admin/BackupManagement';

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
    return <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748b' }}>Đang tải Dashstack...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboards" replace />;
  }

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

        {/* User Protected Routes */}
        <Route path="/" element={<Navigate to="/dashboards" replace />} />
        <Route path="/dashboards" element={<ProtectedRoute><DashboardList /></ProtectedRoute>} />
        <Route path="/dashboards/new" element={<ProtectedRoute><DashboardCreate /></ProtectedRoute>} />
        <Route path="/dashboards/:id" element={<ProtectedRoute><DashboardView /></ProtectedRoute>} />
        <Route path="/datasources" element={<ProtectedRoute><DataIntegration /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><AlertSettings /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryChange /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><SupportTicket /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />

        {/* Admin Protected Routes */}
        <Route path="/admin/overview" element={<ProtectedRoute requireAdmin><AdminOverview /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requireAdmin><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/dashboards" element={<ProtectedRoute requireAdmin><DashboardManagement /></ProtectedRoute>} />
        <Route path="/admin/notifications" element={<ProtectedRoute requireAdmin><NotificationManagement /></ProtectedRoute>} />
        <Route path="/admin/security" element={<ProtectedRoute requireAdmin><SecurityManagement /></ProtectedRoute>} />
        <Route path="/admin/api-keys" element={<ProtectedRoute requireAdmin><ApiManagement /></ProtectedRoute>} />
        <Route path="/admin/logs" element={<ProtectedRoute requireAdmin><SystemLogs /></ProtectedRoute>} />
        <Route path="/admin/payments" element={<ProtectedRoute requireAdmin><PaymentManagement /></ProtectedRoute>} />
        <Route path="/admin/packages" element={<ProtectedRoute requireAdmin><PackageManagement /></ProtectedRoute>} />
        <Route path="/admin/sessions" element={<ProtectedRoute requireAdmin><LoginManagement /></ProtectedRoute>} />
        <Route path="/admin/backups" element={<ProtectedRoute requireAdmin><BackupManagement /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboards" replace />} />
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
