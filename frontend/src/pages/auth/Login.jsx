import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('user');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await authAPI.login({ email, password, role: activeTab });
      
      // Use AuthContext login method
      login(response.user, response.token);
      
      // Redirect based on role
      if (response.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
      
      setMessage('Login berhasil!');
    } catch (error) {
      console.error('Login error:', error);
      setMessage(error.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-space flex">
      {/* Left Side - Gradient Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-space"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          {/* Logo */}
          <div className="mb-8 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-nebula rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">EventHub</h2>
          </div>

          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold mb-4">
              Get Started with Us
            </h1>
            <p className="text-purple-200 mb-8 leading-relaxed">
              Complete these easy steps to register your account
            </p>

            {/* Steps */}
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">1</span>
                </div>
                <span className="text-sm">Sign up your account</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg opacity-60">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <span className="text-sm">Set up your workspace</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg opacity-60">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <span className="text-sm">Set up your profile</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Space Decorative Elements */}
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent-violet/12 rounded-full blur-2xl animate-nebula-drift"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl animate-galaxy-rotate"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-accent-teal/8 rounded-full blur-xl animate-gentle-pulse"></div>
        
        {/* Shooting stars */}
        <div className="absolute top-10 left-0 w-2 h-2 bg-white rounded-full animate-shooting-star" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-40 left-0 w-1.5 h-1.5 bg-accent-cyan rounded-full animate-shooting-star" style={{animationDelay: '4s'}}></div>
        
        {/* Twinkling stars */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/80 rounded-full animate-cosmic-twinkle" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-accent-cyan/70 rounded-full animate-cosmic-twinkle" style={{animationDelay: '1.2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-0.5 h-0.5 bg-accent-violet/60 rounded-full animate-cosmic-twinkle" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-accent-teal/55 rounded-full animate-cosmic-twinkle" style={{animationDelay: '1.8s'}}></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-deep-space relative">
        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 flex items-center text-white/80 hover:text-cyan-300 transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>
        
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Sign In Account
            </h2>
            <p className="text-gray-400">
              Enter your personal data to access your account
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="flex items-center justify-center px-4 py-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
              GitHub
            </button>
          </div>

          {/* Role Tabs */}
          <div className="flex bg-deep-space/50 rounded-xl p-1 mb-6 border border-cyan-400/20">
            <button
              onClick={() => setActiveTab('user')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'user'
                  ? 'bg-gradient-nebula text-white shadow-lg'
                  : 'text-gray-400 hover:text-cyan-300'
              }`}
            >
              Visitor
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-gradient-nebula text-white shadow-lg'
                  : 'text-gray-400 hover:text-cyan-300'
              }`}
            >
              Admin
            </button>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.includes('berhasil') 
                ? 'bg-green-900/50 text-green-300 border border-green-800' 
                : 'bg-red-900/50 text-red-300 border border-red-800'
            }`}>
              <div className="flex items-center">
                <span className="mr-2">
                  {message.includes('berhasil') ? '✅' : '❌'}
                </span>
                {message}
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-4 py-3 bg-deep-space/50 border border-cyan-400/30 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                placeholder="eg. John"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 bg-deep-space/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all pr-12"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-400">
                <input type="checkbox" className="mr-2 rounded border-gray-700 bg-gray-900 text-purple-600 focus:ring-purple-500" />
                Must be at least 8 characters
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-nebula text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
