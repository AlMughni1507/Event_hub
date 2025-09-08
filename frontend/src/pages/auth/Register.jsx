import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import FallingStars from '../../components/FallingStars';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password || !formData.full_name) {
      setMessage('Semua field wajib diisi');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      setMessage('Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone || ''
      });
      
      if (response && response.success) {
        // Auto-login after successful registration
        if (response.data.user && response.data.token) {
          login(response.data.user, response.data.token);
          setMessage('Registrasi berhasil! Selamat datang di EventHub!');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          setMessage('Registrasi berhasil! Anda dapat login sekarang.');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } else {
        setMessage(response?.message || 'Registrasi gagal');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(error.message || 'Terjadi kesalahan saat registrasi');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden flex">
      <FallingStars density="medium" />
      
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <button
            onClick={() => navigate('/')}
            className="absolute top-8 left-8 flex items-center text-white/80 hover:text-white transition-colors group">
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Beranda
          </button>
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-white">Bergabung dengan EventHub</h1>
            <p className="text-xl text-slate-300">Temukan dan ikuti event menarik di seluruh Indonesia</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Daftar Akun Baru</h2>
            <p className="text-slate-400">Buat akun untuk mengakses semua fitur EventHub</p>
          </div>
          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.includes('berhasil') 
                ? 'bg-green-900/50 text-green-300 border border-green-700' 
                : 'bg-red-900/50 text-red-300 border border-red-700'
            }`}>
              {message}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-slate-300 mb-2">Nama Lengkap</label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full px-3 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan username"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan email"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">Nomor Telepon (Opsional)</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan nomor telepon"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">Konfirmasi Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Konfirmasi password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Mendaftar...' : 'Daftar'}
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-slate-400">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
