import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SettingsPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-space relative overflow-hidden">
        {/* Enhanced Space Background */}
        <div className="absolute inset-0 bg-gradient-space">
          {/* Large cosmic nebulae */}
          <div className="absolute top-20 left-20 w-80 h-80 bg-accent-cyan/10 rounded-full blur-3xl animate-nebula-drift"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-accent-violet/10 rounded-full blur-3xl animate-galaxy-rotate"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent-teal/6 rounded-full blur-2xl animate-gentle-pulse"></div>
          
          {/* Shooting stars */}
          <div className="absolute top-10 left-0 w-2 h-2 bg-white rounded-full animate-shooting-star" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-1/3 left-0 w-1.5 h-1.5 bg-accent-cyan rounded-full animate-shooting-star" style={{animationDelay: '3s'}}></div>
          <div className="absolute top-2/3 left-0 w-1 h-1 bg-accent-violet rounded-full animate-shooting-star" style={{animationDelay: '6s'}}></div>
          
          {/* Twinkling starfield */}
          <div className="absolute top-20 left-1/4 w-1 h-1 bg-white/80 rounded-full animate-cosmic-twinkle" style={{animationDelay: '0.2s'}}></div>
          <div className="absolute top-40 right-1/4 w-1 h-1 bg-accent-cyan/90 rounded-full animate-cosmic-twinkle" style={{animationDelay: '1.4s'}}></div>
          <div className="absolute bottom-32 left-1/3 w-1 h-1 bg-accent-violet/80 rounded-full animate-cosmic-twinkle" style={{animationDelay: '2.3s'}}></div>
          <div className="absolute bottom-16 right-1/3 w-1 h-1 bg-accent-teal/85 rounded-full animate-cosmic-twinkle" style={{animationDelay: '0.9s'}}></div>
          <div className="absolute top-60 left-2/3 w-0.5 h-0.5 bg-accent-pink/75 rounded-full animate-cosmic-twinkle" style={{animationDelay: '1.7s'}}></div>
          <div className="absolute top-80 right-2/3 w-0.5 h-0.5 bg-white/70 rounded-full animate-cosmic-twinkle" style={{animationDelay: '2.5s'}}></div>
        </div>
        
        {/* Navigation Header */}
        <div className="bg-deep-space/30 backdrop-blur-md border-b border-cyan-400/20 sticky top-0 z-50 relative overflow-hidden">
          {/* Background particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-20 w-24 h-24 bg-accent-cyan/8 rounded-full blur-xl animate-nebula-drift"></div>
            <div className="absolute top-0 right-20 w-16 h-16 bg-accent-violet/8 rounded-full blur-lg animate-gentle-pulse"></div>
            <div className="absolute top-2 left-1/2 w-1 h-1 bg-white/60 rounded-full animate-cosmic-twinkle"></div>
            <div className="absolute top-4 right-1/3 w-0.5 h-0.5 bg-accent-cyan/70 rounded-full animate-cosmic-twinkle" style={{animationDelay: '1s'}}></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-white hover:text-indigo-300 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </button>
            </div>
          </div>
        </div>

        {/* Login Required Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <div className="max-w-md w-full">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-cyan-400/20 text-center animate-cosmic-pulse">
              {/* User Icon */}
              <div className="w-24 h-24 bg-gradient-nebula rounded-full flex items-center justify-center mx-auto mb-6 animate-stellar-drift">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">Account Settings</h1>
              <p className="text-slate-300 mb-8">
                Please login to access your account settings and manage your profile.
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleLogin}
                  className="w-full bg-gradient-nebula text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 animate-cosmic-pulse"
                >
                  Login to Your Account
                </button>
                
                <button
                  onClick={handleRegister}
                  className="w-full bg-transparent hover:bg-cyan-500/10 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 border-2 border-cyan-400/40 hover:border-cyan-400/80 animate-aurora-wave"
                >
                  Create New Account
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-cyan-400/20">
                <p className="text-slate-400 text-sm">
                  New to EventHub? Register as a visitor to discover and join amazing events!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      {/* Navigation */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-white hover:text-indigo-300 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>
            
            <h1 className="text-xl font-bold text-white">Account Settings</h1>
            <div className="w-20"></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-cyan-400/20 mb-8 animate-cosmic-pulse">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-nebula rounded-full flex items-center justify-center animate-stellar-drift">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome, {user?.full_name || user?.username}!</h2>
              <p className="text-slate-300">Visitor Account</p>
              <p className="text-slate-400 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Information */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-slate-400 text-sm">Full Name</label>
                <p className="text-white">{user?.full_name || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Username</label>
                <p className="text-white">{user?.username}</p>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Email</label>
                <p className="text-white">{user?.email}</p>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Phone</label>
                <p className="text-white">{user?.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Account Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Account Type</span>
                <span className="text-green-400 font-semibold">Visitor</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email Verified</span>
                <span className="text-green-400 font-semibold">✓ Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Member Since</span>
                <span className="text-white">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}</span>
              </div>
            </div>
          </div>

          {/* My Events */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              My Events
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/events')}
                className="w-full text-left bg-white/5 hover:bg-cyan-500/10 p-3 rounded-lg transition-all border border-cyan-400/20 hover:border-cyan-400/60 animate-stellar-drift"
              >
                <div className="text-white font-semibold">Browse Events</div>
                <div className="text-slate-400 text-sm">Discover new events to join</div>
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Account Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 font-semibold py-3 px-4 rounded-lg transition-all border border-red-600/30 hover:border-red-600/50 animate-cosmic-pulse"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
