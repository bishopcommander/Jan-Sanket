import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import './index.css';

// Pages
import LoginPage from './pages/LoginPage';

// Citizen
import CitizenLayout from './layouts/CitizenLayout';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ReportIssuePage from './pages/citizen/ReportIssuePage';
import MyComplaintsPage from './pages/citizen/MyComplaintsPage';
import ComplaintDetailPage from './pages/citizen/ComplaintDetailPage';
import NotificationsPage from './pages/citizen/NotificationsPage';
import CitizenProfilePage from './pages/citizen/CitizenProfilePage';

// Admin
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ComplaintManagementPage from './pages/admin/ComplaintManagementPage';
import AdminComplaintDetailPage from './pages/admin/AdminComplaintDetailPage';
import AdminGISMapPage from './pages/admin/AdminGISMapPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';

// Route Guards
function RequireAuth({ children, role }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (role && currentUser.role !== role) {
    return <Navigate to={currentUser.role === 'ADMIN' ? '/admin/dashboard' : '/citizen/dashboard'} replace />;
  }
  return children;
}

function RootRedirect() {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <Navigate to={currentUser.role === 'ADMIN' ? '/admin/dashboard' : '/citizen/dashboard'} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />

      {/* ====================== CITIZEN PORTAL ====================== */}
      <Route
        path="/citizen"
        element={
          <RequireAuth role="CITIZEN">
            <CitizenLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CitizenDashboard />} />
        <Route path="report" element={<ReportIssuePage />} />
        <Route path="my-complaints" element={<MyComplaintsPage />} />
        <Route path="complaints/:id" element={<ComplaintDetailPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<CitizenProfilePage />} />
      </Route>

      {/* ====================== ADMIN PORTAL ====================== */}
      <Route
        path="/admin"
        element={
          <RequireAuth role="ADMIN">
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="complaints" element={<ComplaintManagementPage />} />
        <Route path="complaints/:id" element={<AdminComplaintDetailPage />} />
        <Route path="map" element={<AdminGISMapPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
