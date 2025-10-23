import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set active menu based on current path
    const path = location.pathname.split('/')[2] || 'dashboard';
    setActiveMenu(path);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/admin/dashboard',
      description: 'Overview & Analytics'
    },
    {
      id: 'events',
      label: 'Events',
      icon: '🎪',
      path: '/admin/events',
      description: 'Manage Events'
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: '📂',
      path: '/admin/categories',
      description: 'Event Categories'
    },
    {
      id: 'users',
      label: 'Users',
      icon: '👥',
      path: '/admin/users',
      description: 'User Management'
    },
    {
      id: 'registrations',
      label: 'Registrations',
      icon: '📝',
      path: '/admin/registrations',
      description: 'Event Registrations'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      path: '/admin/analytics',
      description: 'Reports & Insights'
    },
    {
      id: 'statistics',
      label: 'Statistics',
      icon: '📊',
      path: '/admin/statistics',
      description: 'Bar Charts & Data'
    },
    {
      id: 'certificates',
      label: 'Certificates',
      icon: '🏆',
      path: '/admin/certificates',
      description: 'Certificate Management'
    },
    {
      id: 'blogs',
      label: 'Blog Management',
      icon: '📝',
      path: '/admin/blogs',
      description: 'Create & Manage Blogs'
    }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">

      <div className="flex relative z-10">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-72' : 'w-20'} transition-all duration-300 bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-lg`}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className={`${sidebarOpen ? 'block' : 'hidden'} transition-all duration-300`}>
                <h1 className="text-2xl font-bold text-black">
                  EventHub Admin
                </h1>
                <p className="text-sm text-gray-600 mt-1">Management Dashboard</p>
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2 flex-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center p-3 rounded-lg transition-colors group ${
                  activeMenu === item.id
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-100 text-gray-700 hover:text-black'
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <div className={`${sidebarOpen ? 'block' : 'hidden'} transition-all duration-300`}>
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className={`${sidebarOpen ? 'block' : 'hidden'} bg-gray-50 p-4 rounded-lg border border-gray-200`}>
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.full_name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-black font-medium">{user?.full_name || 'Admin'}</div>
                  <div className="text-gray-600 text-sm">{user?.role || 'Administrator'}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-black capitalize">
                  {activeMenu.replace('-', ' ')}
                </h2>
                <p className="text-gray-600 text-sm">
                  Manage your {activeMenu}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Quick Stats */}
                <div className="hidden md:flex items-center space-x-4">
                  <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg">
                    <div className="text-gray-600 text-sm">Active Events</div>
                    <div className="text-black font-bold">12</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg">
                    <div className="text-gray-600 text-sm">Total Users</div>
                    <div className="text-black font-bold">1,234</div>
                  </div>
                </div>

                {/* Notifications */}
                <button className="relative p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.07 2.82l3.12 3.12M7.05 5.84L3.93 2.72M2 12h4M20 12h4M7.05 18.16l3.12-3.12M17.95 18.16l-3.12-3.12" />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6 bg-gray-50 min-h-screen">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
