import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import FallingStars from '../../components/FallingStars';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Clear any existing auth data first
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      console.log('🔍 Login attempt for email:', email);
      
      let response;
      
      // Check if this is an admin email and use appropriate endpoint
      if (email === 'abdul.mughni845@gmail.com' || email.includes('admin')) {
        console.log('🔍 Attempting admin login...');
        response = await authAPI.adminLogin({ email, password });
      } else {
        console.log('🔍 Attempting regular user login...');
        response = await authAPI.login({ email, password });
      }
      
      console.log('🔍 Login response:', response);
      
      // Check if response has the expected structure
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      const { user, token } = response.data;
      
      if (!user || !token) {
        throw new Error('Invalid response from server - missing user or token');
      }
      
      if (!user.role) {
        throw new Error('User data is incomplete');
      }
      
      console.log('🔍 User role:', user.role);
      
      login(user, token);
      
      if (user.role === 'admin') {
        console.log('✅ Redirecting to admin dashboard...');
        setSuccess('Admin login successful! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      } else {
        console.log('✅ Redirecting to home page...');
        setSuccess('Login successful! Welcome back!');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setError(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Falling Stars Background */}
      <FallingStars density="medium" />

      <div className="flex min-h-screen relative z-10">
        {/* Left Side - Hero Panel */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
          
          <div className="relative z-10 flex flex-col justify-center items-start px-16 py-12 text-white w-full">
            <div className="mb-12 flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">EventHub</h1>
            </div>

            <div className="max-w-lg">
              <h1 className="text-5xl font-bold mb-6 text-white leading-tight">
                Welcome Back
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Sign in to access your dashboard and manage events with our comprehensive platform
              </p>
            </div>

          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-12 py-12 relative">
          <button
            onClick={() => navigate('/')}
            className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
          >
            <span className="flex items-center space-x-2">
              <span>Back to website</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
          
          <div className="w-full max-w-xl bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-lg p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Sign In
              </h2>
              <p className="text-slate-400">
                Enter your credentials to access the platform
              </p>
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  <strong>Admin Access:</strong> Use admin credentials to access dashboard
                </p>
                <p className="text-blue-300 text-xs mt-1">
                  Email: abdul.mughni845@gmail.com | Password: admin123
                </p>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-lg mb-6 bg-red-900/50 text-red-300 border border-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 rounded-lg mb-6 bg-green-900/50 text-green-300 border border-green-700">
                {success}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full px-4 py-4 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-4 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center text-sm">
                <input 
                  type="checkbox" 
                  className="mr-2 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500" 
                />
                <span className="text-slate-400">Remember me</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

            <div className="text-center mt-6">
              <p className="text-slate-400 text-sm">
                Don't have an account? <span className="text-blue-400 cursor-pointer hover:text-blue-300 transition-colors" onClick={() => navigate('/register')}>Sign up</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
