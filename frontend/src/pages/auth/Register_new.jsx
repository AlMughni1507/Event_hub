import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import FallingStars from '../../components/FallingStars';

const RegisterPage = () => {
  const [step, setStep] = useState('register');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: ''
  });
  const [otp, setOtp] = useState('');
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
        setMessage('Registrasi berhasil! Kode OTP telah dikirim ke email Anda.');
        setStep('verify');
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

  const handleResendOTP = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/request-email-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('OTP baru telah dikirim ke email Anda');
      } else {
        setMessage(data.message || 'Gagal mengirim OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setMessage('Terjadi kesalahan saat mengirim OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      setMessage('Masukkan kode OTP');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email, 
          otp: otp 
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.data && data.data.user && data.data.token) {
          login(data.data.user, data.data.token);
          setMessage('Verifikasi berhasil! Selamat datang!');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          setMessage('Verifikasi berhasil! Anda dapat login sekarang.');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } else {
        setMessage(data.message || 'Verifikasi gagal');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setMessage('Terjadi kesalahan saat verifikasi');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-slate-900 relative overflow-hidden flex">
        <FallingStars density="light" />
        
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
              <h1 className="text-4xl font-bold mb-4 text-white">Verifikasi Email</h1>
              <p className="text-xl text-slate-300">Langkah terakhir untuk mengaktifkan akun Anda</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Verification Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Verifikasi Email</h2>
              <p className="text-slate-400">Masukkan kode OTP yang dikirim ke email Anda</p>
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
            <form className="space-y-6" onSubmit={handleVerifyOTP}>
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Kode OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
                <div className="mt-2 p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    <strong>Testing:</strong> Jika email OTP tidak masuk, gunakan kode: <span className="font-mono">123456</span>
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Memverifikasi...' : 'Verifikasi Email'}
                </button>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="w-full text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50 py-2 transition-colors">
                  Kirim ulang kode OTP
                </button>
              </div>
            </form>
            <div className="text-center mt-6">
              <button
                onClick={() => setStep('register')}
                className="text-sm text-slate-400 hover:text-white transition-colors">
                ← Kembali ke pendaftaran
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
