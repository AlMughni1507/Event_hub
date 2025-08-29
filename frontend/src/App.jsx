import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/main/HomePage';
import EventsPage from './pages/events/EventsPage';
import EventList from './pages/events/EventList';
import EventDetail from './pages/events/EventDetail';
import CreateEvent from './pages/events/CreateEvent';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import ContactPage from './pages/contact/ContactPage';
import BlogPage from './pages/blog/BlogPage';
import ArticleDetailPage from './pages/blog/ArticleDetailPage';
import SettingsPage from './pages/settings/SettingsPage';
import LoadingScreen from './components/LoadingScreen';
import './styles/theme.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  // TODO: Replace with actual auth check
  const isAuthenticated = true; // For demo purposes
  const isAdmin = true; // For demo purposes

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; 
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }
  
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/events/create" element={<CreateEvent />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<ArticleDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
