import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmModal from '../../components/ConfirmModal';
import { 
  LayoutDashboard, 
  Calendar, 
  FolderKanban, 
  Users, 
  ClipboardList, 
  TrendingUp, 
  BarChart3, 
  Award,
  FileText,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Bell,
  Settings
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      description: 'Overview & Analytics'
    },
    {
      id: 'events',
      label: 'Events',
      icon: Calendar,
      path: '/admin/events',
      description: 'Manage Events'
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: FolderKanban,
      path: '/admin/categories',
      description: 'Event Categories'
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      path: '/admin/users',
      description: 'User Management'
    },
    {
      id: 'registrations',
      label: 'Registrations',
      icon: ClipboardList,
      path: '/admin/registrations',
      description: 'Event Registrations'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      path: '/admin/analytics',
      description: 'Reports & Insights'
    },
    {
      id: 'statistics',
      label: 'Statistics',
      icon: BarChart3,
      path: '/admin/statistics',
      description: 'Bar Charts & Data'
    },
    {
      id: 'certificates',
      label: 'Certificates',
      icon: Award,
      path: '/admin/certificates',
      description: 'Certificate Management'
    },
    {
      id: 'blogs',
      label: 'Blog Management',
      icon: FileText,
      path: '/admin/blogs',
      description: 'Create & Manage Blogs'
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: MessageSquare,
      path: '/admin/reviews',
      description: 'User Reviews Management'
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
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-black" />
                ) : (
                  <Menu className="w-5 h-5 text-black" />
                )}
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
                <item.icon className={`w-5 h-5 mr-3 ${activeMenu === item.id ? 'text-white' : 'text-gray-600 group-hover:text-black'}`} />
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
                onClick={confirmLogout}
                className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
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
                  <Bell className="w-6 h-6 text-black" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6 bg-gray-50 min-h-screen">
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari akun admin?"
        confirmText="Ya, Logout"
        cancelText="Batal"
        type="danger"
      />
    </div>
  );
};

export default AdminLayout;
