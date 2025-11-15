import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import Footer from '../../components/Footer';
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Clock, Tag, CheckCircle } from 'lucide-react';

const EventDetailModern = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${id}`);
      // Response interceptor returns response.data which is { success, message, data }
      // So event is in response.data
      const eventData = response?.data || response;
      console.log('Event data:', eventData);
      console.log('Event image_url:', eventData?.image_url);
      setEvent(eventData);
    } catch (error) {
      console.error('Error fetching event:', error);
      setError('Event tidak ditemukan atau gagal dimuat');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price, isFree) => {
    if (isFree) return 'Gratis';
    if (!price || price === 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleRegister = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }
    navigate(`/register-event/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">{error || 'Event yang Anda cari tidak ditemukan'}</p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Daftar Event
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Kembali</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Image/Poster */}
            {(event.image_url || event.image) && (
              <div className="w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 mb-6 shadow-lg relative">
                <img
                  src={event.image_url 
                    ? `http://localhost:3000${event.image_url}` 
                    : event.image 
                    ? `http://localhost:3000${event.image}` 
                    : ''}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const parent = e.target.parentElement;
                    parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100"><p class="text-gray-500 text-sm">Gambar tidak tersedia</p></div>';
                  }}
                  onLoad={(e) => {
                    // Ensure image is visible when loaded
                    e.target.style.display = 'block';
                  }}
                />
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {event.title}
            </h1>

            {/* Category Badge */}
            {event.category_name && (
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full mb-4">
                <Tag className="w-3.5 h-3.5" />
                <span className="font-medium text-sm">{event.category_name}</span>
              </div>
            )}

            {/* Event Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Detail Event</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Calendar className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Tanggal Event</p>
                    <p className="text-gray-600">{formatDate(event.event_date)}</p>
                    {event.event_time && (
                      <p className="text-sm text-gray-500 mt-1">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {formatTime(event.event_date)}
                      </p>
                    )}
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Lokasi</p>
                      <p className="text-gray-600">{event.location}</p>
                      {event.address && (
                        <p className="text-sm text-gray-500 mt-1">{event.address}</p>
                      )}
                      {(event.city || event.province) && (
                        <p className="text-sm text-gray-500">
                          {event.city}{event.city && event.province ? ', ' : ''}{event.province}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {event.max_participants && (
                  <div className="flex items-start gap-4">
                    <Users className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Kapasitas</p>
                      <p className="text-gray-600">
                        {event.unlimited_participants 
                          ? 'Tidak Terbatas' 
                          : `${event.approved_registrations || 0} / ${event.max_participants} peserta`}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <DollarSign className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Biaya Pendaftaran</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(event.price, event.is_free)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Short Description */}
            {event.short_description && (
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 mb-4">
                <p className="text-gray-700 leading-relaxed text-sm">{event.short_description}</p>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Tentang Event</h2>
                <div 
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>
            )}
          </div>

          {/* Sidebar - Registration Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 sticky top-20">
              <div className="text-center mb-5">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {formatPrice(event.price, event.is_free)}
                </div>
                {!event.is_free && event.price > 0 && (
                  <p className="text-xs text-gray-500">per peserta</p>
                )}
              </div>

              <button
                onClick={handleRegister}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105 shadow-lg mb-4 text-sm"
              >
                {isAuthenticated ? 'Daftar Sekarang' : 'Login untuk Daftar'}
              </button>

              {event.registration_deadline && (
                <div className="text-center text-xs text-gray-500 mb-4 pb-4 border-b border-gray-200">
                  <p className="mb-1">Pendaftaran ditutup:</p>
                  <p className="font-semibold text-gray-700 text-sm">
                    {formatDate(event.registration_deadline)}
                  </p>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Konfirmasi instan</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>E-ticket via email</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Pembatalan mudah</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventDetailModern;

