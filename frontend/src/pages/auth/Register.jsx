 import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const RegisterPage = () => {
  const [step, setStep] = useState('register'); // 'register' or 'verify'
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
    
    if (formData.password !== formData.confirmPassword) {
      setMessage('Password tidak cocok');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await authAPI.register(formData);
      setStep('verify');
      setMessage('Pendaftaran berhasil! Silakan cek email Anda untuk kode OTP.');
    } catch (error) {
      console.error('Register error:', error);
      setMessage(error.message || 'Pendaftaran gagal');
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
        // Auto-login after successful verification
        if (data.user && data.token) {
          login(data.user, data.token);
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
      <div className="min-h-screen bg-deep-space relative overflow-hidden flex">
        {/* Left Panel - Same as Login */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-comet-cyan via-plasma-purple to-cosmic-navy relative overflow-hidden">
          <div className="absolute inset-0 bg-void-black/20"></div>
          {/* Cosmic Background Elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-starlight/10 rounded-full blur-xl animate-cosmic-pulse"></div>
          <div className="absolute bottom-20 right-32 w-20 h-20 bg-nebula-pink/20 rounded-full blur-lg animate-stellar-drift"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            {/* Back to Home Button */}
            <button
              onClick={() => navigate('/')}
              className="absolute top-8 left-8 flex items-center text-starlight/80 hover:text-starlight transition-colors group animate-slide-in-left"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Beranda
            </button>

            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4 text-starlight animate-fade-in-up">Verifikasi Email</h1>
              <p className="text-xl text-moon-silver animate-slide-in-left">
                Langkah terakhir untuk mengaktifkan akun Anda
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 cosmic-glass rounded-full flex items-center justify-center animate-glow">
                  <span className="text-sm font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold">Pendaftaran Berhasil</h3>
                  <p className="text-purple-200 text-sm">Akun Anda telah dibuat</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-comet-cyan to-plasma-purple rounded-full flex items-center justify-center animate-glow">
                  <span className="text-sm font-semibold text-starlight">2</span>
                </div>
                <div>
                  <h3 className="font-semibold">Verifikasi Email</h3>
                  <p className="text-moon-silver text-sm">Masukkan kode OTP dari email</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 cosmic-glass rounded-full flex items-center justify-center animate-glow">
                  <span className="text-sm font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-starlight/60">Akun Aktif</h3>
                  <p className="text-moon-silver text-sm">Siap menggunakan platform</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Panel - Verification Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 cosmic-glass">
          <div className="w-full max-w-md">
            {/* Mobile Back Button */}
            <button
              onClick={() => navigate('/')}
              className="lg:hidden flex items-center text-moon-silver hover:text-starlight transition-colors group mb-8 animate-slide-in-left"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Beranda
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-comet-cyan to-plasma-purple rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
                <svg className="w-8 h-8 text-starlight animate-cosmic-twinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-starlight mb-2 animate-fade-in-up">Verifikasi Email</h2>
              <p className="text-moon-silver animate-slide-in-left">Masukkan kode OTP yang dikirim ke email Anda</p>
            </div>

            {message && (
              <div className={`p-4 rounded-xl mb-6 ${
                message.includes('berhasil') 
                  ? 'bg-green-900/50 text-green-300 border border-green-700' 
                  : 'bg-red-900/50 text-red-300 border border-red-700'
              }`}>
                <div className="flex items-center">
                  <span className="mr-2">
                    {message.includes('berhasil') ? '✅' : '❌'}
                  </span>
                  {message}
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleVerifyOTP}>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-moon-silver mb-2">
                  Kode OTP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-moon-silver animate-cosmic-twinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight placeholder-moon-silver focus:outline-none focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all animate-glow"
                    placeholder="Masukkan 6 digit kode OTP"
                    maxLength="6"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-comet-cyan to-plasma-purple hover:from-comet-cyan/80 hover:to-plasma-purple/80 text-starlight font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-comet-cyan disabled:opacity-50 disabled:cursor-not-allowed animate-glow"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memverifikasi...
                    </span>
                  ) : (
                    'Verifikasi Email'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="w-full text-sm text-comet-cyan hover:text-plasma-purple disabled:opacity-50 py-2 transition-colors animate-fade-in-up"
                >
                  Kirim ulang kode OTP
                </button>
              </div>
            </form>

            <div className="text-center mt-6">
              <button
                onClick={() => setStep('register')}
                className="text-sm text-moon-silver hover:text-starlight transition-colors animate-slide-in-left"
              >
                ← Kembali ke pendaftaran
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-space relative overflow-hidden flex">
      {/* Left Panel - Onboarding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-comet-cyan via-plasma-purple to-cosmic-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-void-black/20"></div>
        {/* Cosmic Background Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-starlight/10 rounded-full blur-xl animate-cosmic-pulse"></div>
        <div className="absolute bottom-20 right-32 w-20 h-20 bg-nebula-pink/20 rounded-full blur-lg animate-stellar-drift"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          {/* Back to Home Button */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-8 left-8 flex items-center text-starlight/80 hover:text-starlight transition-colors group animate-slide-in-left"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Beranda
          </button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-starlight animate-fade-in-up">Bergabung dengan EventHub</h1>
            <p className="text-xl text-moon-silver animate-slide-in-left">
              Platform terbaik untuk menemukan dan mengikuti event menarik
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 cosmic-glass rounded-full flex items-center justify-center animate-glow">
                <span className="text-sm font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold">Daftar Gratis</h3>
                <p className="text-moon-silver text-sm">Buat akun dengan mudah dan cepat</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 cosmic-glass rounded-full flex items-center justify-center animate-glow">
                <span className="text-sm font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold">Temukan Event</h3>
                <p className="text-moon-silver text-sm">Jelajahi berbagai kategori event menarik</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 cosmic-glass rounded-full flex items-center justify-center animate-glow">
                <span className="text-sm font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold">Daftar & Ikuti</h3>
                <p className="text-moon-silver text-sm">Registrasi mudah dan dapatkan tiket digital</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 cosmic-glass">
        <div className="w-full max-w-md">
          {/* Mobile Back Button */}
          <button
            onClick={() => navigate('/')}
            className="lg:hidden flex items-center text-moon-silver hover:text-starlight transition-colors group mb-8 animate-slide-in-left"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Beranda
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-comet-cyan to-plasma-purple rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
              <svg className="w-8 h-8 text-starlight animate-cosmic-twinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-starlight mb-2 animate-fade-in-up">Buat Akun Baru</h2>
            <p className="text-moon-silver animate-slide-in-left">Bergabung sebagai visitor untuk mengikuti event</p>
          </div>

          {message && (
            <div className={`p-4 rounded-xl mb-6 ${
              message.includes('berhasil') 
                ? 'bg-green-900/50 text-green-300 border border-green-700' 
                : 'bg-red-900/50 text-red-300 border border-red-700'
            }`}>
              <div className="flex items-center">
                <span className="mr-2">
                  {message.includes('berhasil') ? '✅' : '❌'}
                </span>
                {message}
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-1 gap-4">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-moon-silver mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-moon-silver animate-cosmic-twinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="w-full pl-10 pr-3 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight placeholder-moon-silver focus:outline-none focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all animate-glow"
                    placeholder="Masukkan username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-moon-silver animate-cosmic-twinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full pl-10 pr-3 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight placeholder-moon-silver focus:outline-none focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all animate-glow"
                    placeholder="Masukkan email aktif"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-2">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-moon-silver animate-cosmic-twinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    className="w-full pl-10 pr-3 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight placeholder-moon-silver focus:outline-none focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all animate-glow"
                    placeholder="Masukkan nama lengkap"
                    value={formData.full_name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Nomor Telepon
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-moon-silver animate-cosmic-twinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full pl-10 pr-3 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight placeholder-moon-silver focus:outline-none focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all animate-glow"
                    placeholder="08xxxxxxxxxx"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-moon-silver animate-cosmic-twinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full pl-10 pr-3 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight placeholder-moon-silver focus:outline-none focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all animate-glow"
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-moon-silver animate-cosmic-twinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="w-full pl-10 pr-3 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight placeholder-moon-silver focus:outline-none focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all animate-glow"
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-comet-cyan to-plasma-purple hover:from-comet-cyan/80 hover:to-plasma-purple/80 text-starlight font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-comet-cyan disabled:opacity-50 disabled:cursor-not-allowed animate-glow"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mendaftar...
                </span>
              ) : (
                <>
                  <span className="mr-2">🎉</span>
                  Daftar Sekarang
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-moon-silver">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-medium text-comet-cyan hover:text-plasma-purple transition-colors animate-glow">
                Login di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
