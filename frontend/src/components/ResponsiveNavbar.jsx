import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ResponsiveNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  // Icon components
  const Icon = ({ name, className = "w-5 h-5" }) => {
    const icons = {
      home: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      calendar: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      document: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      phone: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      mobile: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      settings: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      logout: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      user: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      chevron: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )
    };
    return icons[name] || null;
  };

  const navItems = [
    { name: 'Home', path: '/', icon: 'home' },
    { name: 'Events', path: '/events', icon: 'calendar' },
    { name: 'Blog', path: '/blog', icon: 'document' },
    { name: 'Contact', path: '/contact', icon: 'phone' },
    { name: 'About', path: '/about', icon: 'user' },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
          : 'bg-white/90 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white text-lg lg:text-xl font-bold">E</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  EventHub
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Your Event Platform</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 group ${
                    isActivePath(item.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Icon name={item.icon} className="w-5 h-5" />
                    <span>{item.name}</span>
                  </span>
                  
                  {/* Active indicator */}
                  {isActivePath(item.path) && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full animate-pulse"></div>
                  )}
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              ))}
            </div>

            {/* User Menu / Auth Buttons */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {/* Mobile App Link */}
                  <Link
                    to="/mobile-app"
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <Icon name="mobile" className="w-5 h-5" />
                    <span className="hidden md:inline">Mobile App</span>
                  </Link>

                  {/* Settings Link */}
                  <Link
                    to="/settings"
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                  >
                    <Icon name="settings" className="w-5 h-5" />
                    <span className="hidden md:inline">Settings</span>
                  </Link>

                  {/* User Profile Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <span className="hidden md:inline">{user?.name || 'User'}</span>
                      <Icon name="chevron" className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="p-2">
                        <div className="px-3 py-2 text-sm text-gray-500 border-b border-gray-100">
                          {user?.email}
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                        >
                          <Icon name="logout" className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Daftar
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105"
              >
                <div className={`w-5 h-5 relative transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45' : ''}`}>
                  <span className={`absolute top-0 left-0 w-full h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-90 translate-y-2' : 'translate-y-1'}`}></span>
                  <span className={`absolute top-1/2 left-0 w-full h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-90 -translate-y-2' : '-translate-y-1'}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 py-4 bg-white/95 backdrop-blur-md border-t border-gray-200/50">
            <div className="space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActivePath(item.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon name={item.icon} className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                <div className="pt-4 border-t border-gray-200/50 space-y-2">
                  <Link
                    to="/mobile-app"
                    className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium"
                  >
                    <Icon name="mobile" className="w-5 h-5" />
                    <span>Mobile App</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-3 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
                  >
                    <Icon name="settings" className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors duration-200"
                  >
                    <Icon name="logout" className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200/50 space-y-2">
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-xl font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium text-center"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
};

export default ResponsiveNavbar;

