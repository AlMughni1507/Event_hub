import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import Footer from '../../components/Footer';
import ResponsiveNavbar from '../../components/ResponsiveNavbar';

// Lightweight icon set (stroke SVG)
const Icon = ({ name, className = 'w-5 h-5' }) => {
  const common = { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' };
  switch (name) {
    case 'calendar':
      return (
        <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
      );
    case 'map':
      return (
        <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      );
    case 'users':
      return (
        <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      );
    case 'ticket':
      return (
        <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5H9a2 2 0 00-2 2v2a2 2 0 01-2 2 2 2 0 002 2v2a2 2 0 002 2h6a2 2 0 002-2v-2a2 2 0 012-2 2 2 0 01-2-2V7a2 2 0 00-2-2z"/></svg>
      );
    case 'clock':
      return (
        <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      );
    case 'check':
      return (
        <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
      );
    case 'document':
      return (
        <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-6a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      );
    default:
      return null;
  }
};

const EventDetailModern = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [token, setToken] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [verifyingToken, setVerifyingToken] = useState(false);
  const [attendanceAvailability, setAttendanceAvailability] = useState(null);
  const [checkingAttendance, setCheckingAttendance] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [tokenDigits, setTokenDigits] = useState(Array(10).fill(''));
  const [resendCooldown, setResendCooldown] = useState(60);
  const tokenInputsRef = React.useRef([]);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (event) {
      checkAttendanceAvailability();
    }
  }, [event]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${id}`);
      const eventData = response.data?.data || response.data || response;
      
      if (!eventData || !eventData.id) {
        setEvent(null);
      } else {
        setEvent(eventData);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  const checkAttendanceAvailability = async () => {
    try {
      setCheckingAttendance(true);
      const response = await api.get(`/attendance/check/${id}`);
      setAttendanceAvailability(response.data?.data || response.data);
    } catch (error) {
      console.error('Error checking attendance availability:', error);
      setAttendanceAvailability({
        isAvailable: false,
        message: 'Tidak dapat mengecek ketersediaan daftar hadir'
      });
    } finally {
      setCheckingAttendance(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setRegistering(true);
    try {
      // First try test endpoint to debug token generation
      console.log('🧪 Testing token generation...');
      try {
        const testResponse = await api.post('/registrations/test-token', {
          event_id: event.id
        });
        console.log('✅ Test token response:', testResponse.data);
      } catch (testError) {
        console.log('❌ Test token failed:', testError.response?.data);
      }

      // Step 1: Generate token and send to email
      console.log('🚀 Starting registration...');
      const response = await api.post('/registrations', {
        event_id: event.id
      });

      console.log('Registration response:', response.data);

      // Check different response formats
      if (response.data.success || response.data.data || response.data.token) {
        // Show token input modal
        setShowTokenModal(true);
        alert('✅ Token berhasil dikirim ke email Anda! Silakan masukkan token untuk melanjutkan registrasi.');
      } else {
        console.log('Unexpected response format:', response.data);
        throw new Error('Registration failed - unexpected response format');
      }
    } catch (error) {
      console.error('Error generating token:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Failed to generate token. Please try again.');
      }
    } finally {
      setRegistering(false);
    }
  };

  const handleTokenVerification = async () => {
    const combined = tokenDigits.join('') || token;
    if (!combined || combined.length !== 10) {
      setTokenError('Token harus 10 digit');
      return;
    }

    setVerifyingToken(true);
    setTokenError('');
    
    try {
      // Step 2: Verify token and proceed to payment
      const response = await api.post('/attendance/verify-token', {
        token: combined,
        event_id: event.id
      });

      if (response.data.success) {
        // Show payment modal for confirmation
        setShowPaymentModal(true);
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      if (error.response?.data?.message) {
        setTokenError(error.response.data.message);
      } else {
        setTokenError('Token tidak valid atau sudah digunakan');
      }
    } finally {
      setVerifyingToken(false);
    }
  };

  const handleCreatePayment = async () => {
    try {
      setPaymentLoading(true);
      const combined = tokenDigits.join('') || token;
      const paymentResponse = await api.post('/payments/create', {
        event_id: event.id,
        token: combined
      });
      if (paymentResponse.data?.data?.status === 'success') {
        setShowPaymentModal(false);
        setShowTokenModal(false);
        alert('🎉 Registration successful! You are now registered for this event.');
        navigate('/settings');
      } else {
        alert(paymentResponse.data?.message || 'Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Create payment error:', err);
      alert(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  // segmented inputs handlers
  const handleDigitChange = (idx, value) => {
    if (!/^\d?$/.test(value)) return; // allow only single digit
    const next = [...tokenDigits];
    next[idx] = value;
    setTokenDigits(next);
    setToken(next.join(''));
    if (value && tokenInputsRef.current[idx + 1]) {
      tokenInputsRef.current[idx + 1].focus();
    }
  };

  const handleDigitKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !tokenDigits[idx] && tokenInputsRef.current[idx - 1]) {
      tokenInputsRef.current[idx - 1].focus();
    }
  };

  // resend cooldown timer
  useEffect(() => {
    if (!showTokenModal) return;
    setResendCooldown(60);
    const t = setInterval(() => setResendCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [showTokenModal]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes} WIB`;
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'GRATIS';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading amazing event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 flex items-center justify-center p-6">
        <div className="text-white text-center max-w-md">
          <div className="text-8xl mb-6 animate-bounce">😢</div>
          <h2 className="text-4xl font-bold mb-4">Oops! Event Not Found</h2>
          <p className="text-xl mb-8 opacity-90">The event you're looking for doesn't exist or has been removed.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/events')}
              className="bg-white text-purple-600 font-bold py-4 px-8 rounded-2xl hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-2xl"
            >
              ← Browse Events
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-white/20 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-2xl hover:bg-white/30 transition-all border-2 border-white"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isEventFull = event.approved_registrations >= event.max_participants;
  const isPastEvent = new Date(event.event_date) < new Date();
  const price = event.price || event.registration_fee || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom Navbar - Same as HomePage */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Icon name="ticket" className="w-6 h-6 text-white" />
              </div>
              <span className="font-bebas text-2xl text-white tracking-wider">EVENTHUB</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => navigate('/')} className="font-poppins text-white hover:text-pink-400 transition-colors font-medium">Home</button>
              <button onClick={() => navigate('/events')} className="font-poppins text-pink-400 font-semibold">Events</button>
              <button onClick={() => navigate('/blog')} className="font-poppins text-white hover:text-pink-400 transition-colors font-medium">Blog</button>
              <button onClick={() => navigate('/contact')} className="font-poppins text-white hover:text-pink-400 transition-colors font-medium">Contact</button>
              <button onClick={() => navigate('/about')} className="font-poppins text-white hover:text-pink-400 transition-colors font-medium">About</button>
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <button 
                  onClick={() => navigate('/settings')}
                  className="hidden md:block font-poppins px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  Dashboard
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="hidden md:block font-poppins px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  Get Started
                </button>
              )}
              
              {/* Mobile Menu Button */}
              <button className="md:hidden text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content Container */}
      <div className="pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <button onClick={() => navigate('/')} className="hover:text-pink-500">Home</button>
            <span>/</span>
            <button onClick={() => navigate('/events')} className="hover:text-pink-500">Events</button>
            <span>/</span>
            <span className="text-gray-900 font-medium">{event.title}</span>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Event Image & Info */}
            <div className="lg:col-span-2 space-y-4">
              {/* Event Image Card */}
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                {event.image_url ? (
                  <img
                    src={`http://localhost:3000${event.image_url}`}
                    alt={event.title}
                    className="w-full h-[300px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[300px] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-8xl">🎉</div>
                  </div>
                )}
                
                {/* Event Title & Badges */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex-1">
                      {event.title}
                    </h1>
                    <span className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${price === 0 ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'}`}>
                      {formatPrice(price)}
                    </span>
                  </div>

                  {/* Event Meta Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Icon name="calendar" className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Icon name="clock" className="w-4 h-4 text-gray-400" />
                      <span>{formatTime(event.event_time)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Icon name="map" className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="mt-4">
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                      {event.category_name || 'Event'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Deskripsi</h2>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </div>

          {/* Registration Sidebar - YesPlis Style */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Detail Pesanan</h3>
              
              {/* Event Summary */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex gap-3 mb-4">
                  {event.image_url ? (
                    <img 
                      src={`http://localhost:3000${event.image_url}`}
                      alt={event.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-3xl">🎉</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{event.title}</h4>
                    <p className="text-xs text-gray-600">{formatDate(event.event_date)}</p>
                    <p className="text-xs text-gray-600">{event.location}</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Mulai Dari</span>
                  <span className="text-2xl font-bold text-gray-900">{formatPrice(price)}</span>
                </div>
                <p className="text-xs text-gray-500">0 Tiket Dipesan</p>
              </div>

              {/* CTA Button */}
              {isPastEvent ? (
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="text-gray-600 font-medium">Event Telah Berakhir</p>
                </div>
              ) : isEventFull ? (
                <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
                  <p className="text-red-600 font-medium">Tiket Habis</p>
                </div>
              ) : !isAuthenticated ? (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Login untuk Daftar
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {registering ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </div>
                  ) : (
                    'Beli Sekarang'
                  )}
                </button>
              )}

              {/* Attendance Section */}
              {isAuthenticated && attendanceAvailability && (
                <div className="mt-6 pt-6 border-t-2 border-gray-200">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-900 text-white mb-2">
                      <Icon name="document" className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">Daftar Hadir</h3>
                  </div>
                  
                  {checkingAttendance ? (
                    <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-600 border-t-transparent mx-auto mb-2"></div>
                      <p className="text-gray-600 text-sm">Mengecek ketersediaan...</p>
                    </div>
                  ) : attendanceAvailability.isAvailable ? (
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                        <div className="text-green-600 text-sm font-medium">✅ Daftar Hadir Tersedia</div>
                        <p className="text-green-700 text-xs mt-1">{attendanceAvailability.message}</p>
                      </div>
                      <button
                        onClick={() => navigate(`/attendance/${id}`)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                      >
                        Isi Daftar Hadir
                      </button>
                    </div>
                  ) : (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
                      <div className="text-orange-600 text-sm font-medium">⏰ Belum Tersedia</div>
                      <p className="text-orange-700 text-xs mt-1">{attendanceAvailability.message}</p>
                      {attendanceAvailability.eventDate && (
                        <p className="text-orange-600 text-xs mt-2">
                          Event: {new Date(attendanceAvailability.eventDate).toLocaleDateString('id-ID')} {attendanceAvailability.eventTime}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 pt-6 border-t-2 border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">What's Included</h3>
                <ul className="space-y-3">
                  {['Event access', 'Digital certificate', 'Event materials', 'Networking opportunities'].map((item, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Icon name="check" className="w-4 h-4" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Token Verification Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Verifikasi Token</h3>
              <p className="text-gray-600 text-sm">Masukkan 10 digit token yang telah dikirim ke email Anda</p>
            </div>

            {/* Segmented token input */}
            <div className="flex items-center justify-center gap-2 mb-3">
              {tokenDigits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (tokenInputsRef.current[i] = el)}
                  value={d}
                  onChange={(e) => handleDigitChange(i, e.target.value.replace(/\D/g, '').slice(0, 1))}
                  onKeyDown={(e) => handleDigitKeyDown(i, e)}
                  inputMode="numeric"
                  maxLength={1}
                  className={`w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-semibold rounded-xl border ${tokenError ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
              ))}
            </div>
            {tokenError && <p className="text-center text-red-500 text-sm mb-3">{tokenError}</p>}

            {/* Resend + countdown */}
            <div className="text-center text-sm text-gray-600 mb-4">
              Tidak menerima email? <button disabled className="font-semibold text-blue-600 disabled:text-gray-400">Kirim ulang</button> {resendCooldown > 0 ? `dalam ${resendCooldown}s` : ''}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setShowTokenModal(false);
                  setToken('');
                  setTokenDigits(Array(10).fill(''));
                  setTokenError('');
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleTokenVerification}
                disabled={verifyingToken || (tokenDigits.join('').length !== 10 && token.length !== 10)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifyingToken ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Lanjutkan'
                )}
              </button>
            </div>

            <div className="mt-5 p-3 bg-blue-50 rounded-lg text-blue-800 text-sm">
              Tips: Periksa folder spam jika email tidak masuk ke inbox utama.
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Konfirmasi Pembayaran</h3>
              <p className="text-gray-600 text-sm mt-1">Periksa detail pesanan sebelum melanjutkan</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Event</span>
                <span className="font-semibold text-gray-900">{event.title}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Tanggal</span>
                <span className="font-semibold text-gray-900">{formatDate(event.event_date)} • {formatTime(event.event_time)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Lokasi</span>
                <span className="font-semibold text-gray-900">{event.location}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Total</span>
                <span className="text-2xl font-extrabold text-gray-900">{formatPrice(price)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                Kembali
              </button>
              <button
                onClick={handleCreatePayment}
                disabled={paymentLoading}
                className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Memproses...
                  </div>
                ) : (
                  'Bayar Sekarang'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default EventDetailModern;

