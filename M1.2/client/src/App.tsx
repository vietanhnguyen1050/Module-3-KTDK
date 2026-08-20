import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleSwitcher } from './components/layout/RoleSwitcher';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { AllCourses } from './pages/customer/AllCourses';
import { CourseDetail } from './pages/customer/CourseDetail';
import { MyCourses } from './pages/customer/MyCourses';
import { LessonView } from './pages/customer/LessonView';
import { CourseReview } from './pages/customer/CourseReview';
import { Profile } from './pages/customer/Profile';
import { Notifications } from './pages/customer/Notifications';
import { RegisterProvider } from './pages/customer/RegisterProvider';
import { DeleteAccount } from './pages/customer/DeleteAccount';

// Provider
import { ProviderLayout } from './pages/provider/ProviderLayout';
import { CourseManagement } from './pages/provider/CourseManagement';
import { LessonManagement } from './pages/provider/LessonManagement';
import { DiscountManagement } from './pages/provider/DiscountManagement';
import { PromotionManagement } from './pages/provider/PromotionManagement';
import { GiftManagement } from './pages/provider/GiftManagement';
import { RevenueReport } from './pages/provider/RevenueReport';

// Admin
import { AdminLayout } from './pages/admin/AdminLayout';
import { OverviewReport } from './pages/admin/OverviewReport';
import { CourseApproval } from './pages/admin/CourseApproval';
import { NCCManagement } from './pages/admin/NCCManagement';
import { CustomerManagement } from './pages/admin/CustomerManagement';
import { PaymentManagement } from './pages/admin/PaymentManagement';
import { FinancialManagement } from './pages/admin/FinancialManagement';
import { NotificationBroadcast } from './pages/admin/NotificationBroadcast';
import { AccessControl } from './pages/admin/AccessControl';
import { UserRole } from './types';

// Protected Route
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: UserRole }> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748b' }}>Đang tải...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole && !(requiredRole === 'provider' && user.role === 'admin')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <RoleSwitcher />
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/courses" element={<AllCourses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />

        {/* Customer (requires login) */}
        <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
        <Route path="/learn/:courseId" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
        <Route path="/courses/:id/review" element={<ProtectedRoute><CourseReview /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/register-provider" element={<ProtectedRoute><RegisterProvider /></ProtectedRoute>} />
        <Route path="/delete-account" element={<ProtectedRoute><DeleteAccount /></ProtectedRoute>} />

        {/* Provider */}
        <Route path="/provider" element={<ProtectedRoute requiredRole="provider"><ProviderLayout /></ProtectedRoute>}>
          <Route path="courses" element={<CourseManagement />} />
          <Route path="courses/:courseId/lessons" element={<LessonManagement />} />
          <Route path="discounts" element={<DiscountManagement />} />
          <Route path="promotions" element={<PromotionManagement />} />
          <Route path="gifts" element={<GiftManagement />} />
          <Route path="revenue" element={<RevenueReport />} />
          <Route index element={<Navigate to="courses" replace />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
          <Route path="overview" element={<OverviewReport />} />
          <Route path="courses" element={<CourseApproval />} />
          <Route path="providers" element={<NCCManagement />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="payments" element={<PaymentManagement />} />
          <Route path="financials" element={<FinancialManagement />} />
          <Route path="notifications" element={<NotificationBroadcast />} />
          <Route path="access-control" element={<AccessControl />} />
          <Route index element={<Navigate to="overview" replace />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
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
