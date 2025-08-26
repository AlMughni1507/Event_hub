import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/main/HomePage';
import EventsPage from './pages/events/EventsPage';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import AdminDashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Events from './pages/admin/Events';
import Categories from './pages/admin/Categories';
import Registrations from './pages/admin/Registrations';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';

function App() {
  console.log('App component rendered');
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
                                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/admin/users" element={<Users />} />
                      <Route path="/admin/events" element={<Events />} />
                      <Route path="/admin/categories" element={<Categories />} />
                      <Route path="/admin/registrations" element={<Registrations />} />
                      <Route path="/admin/analytics" element={<Analytics />} />
                      <Route path="/admin/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
