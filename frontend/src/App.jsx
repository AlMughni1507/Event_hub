import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HomePage from './pages/main/HomePage';
import MobileAppPage from './pages/main/MobileAppPage';
import EventsPage from './pages/events/EventsPage';
import EventListPage from './pages/events/EventsListPage';
import EventDetail from './pages/events/EventDetailModern';
import CreateEvent from './pages/events/CreateEvent';
import EventDashboard from './pages/events/EventDashboard';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import ContactPage from './pages/contact/ContactPage';
import AboutPage from './pages/about/AboutPage';
import BlogPage from './pages/blog/BlogPage';
import ArticleDetailPage from './pages/blog/ArticleDetailPage';
import SettingsPage from './pages/settings/profile';
import AttendancePage from './pages/attendance/AttendancePage';
// Removed separate pages - now integrated into Settings

// Admin Components
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import EventsManagement from './pages/admin/EventsManagement';
import EditEvent from './pages/admin/EditEvent';
import CategoriesManagement from './pages/admin/CategoriesManagement';
import UsersManagement from './pages/admin/UsersManagement';
import RegistrationsManagement from './pages/admin/RegistrationsManagement';
import Analytics from './pages/admin/Analytics';
import StatisticsDashboard from './pages/admin/StatisticsDashboard';
import CertificateManagement from './pages/admin/CertificateManagement';
import BlogManagement from './pages/admin/BlogManagement';

import './styles/theme.css';

// Simple page transition animations CSS
const pageTransitionStyles = `
  .page-wrapper {
    position: relative;
    width: 100%;
    min-height: 100vh;
  }

  .page-content {
    animation: fadeInUp 0.5s ease-out forwards;
  }

  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <style>{pageTransitionStyles}</style>
          <AnimatedRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

// Animated Routes Component
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <div className="page-wrapper">
      <div className="page-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/mobile-app" element={<MobileAppPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events-dashboard" element={<EventDashboard />} />
          <Route path="/events-list" element={<EventListPage />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<ArticleDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/attendance/:eventId" element={<AttendancePage />} />
            
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="events" element={<EventsManagement />} />
            <Route path="events/edit/:id" element={<EditEvent />} />
            <Route path="categories" element={<CategoriesManagement />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="registrations" element={<RegistrationsManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="statistics" element={<StatisticsDashboard />} />
            <Route path="certificates" element={<CertificateManagement />} />
            <Route path="blogs" element={<BlogManagement />} />
          </Route>
            
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;

