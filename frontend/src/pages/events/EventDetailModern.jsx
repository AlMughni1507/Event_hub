import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Instagram, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import Footer from '../../components/Footer';

const EventDetailModern = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [performers, setPerformers] = useState([]);

  useEffect(() => {
    fetchEventDetails();
    fetchPerformers();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.event || response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformers = async () => {
    try {
      const response = await api.get(`/performers/event/${id}`);
      setPerformers(response.data.performers || []);
    } catch (error) {
      console.error('Error fetching performers:', error);
      setPerformers([]);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setRegistering(true);
    try {
      await api.post('/registrations', {
        event_id: event.id,
        user_id: user.id
      });
      alert('Registrasi berhasil!');
      navigate('/settings');
    } catch (error) {
      console.error('Error registering:', error);
      alert(error.response?.data?.message || 'Gagal melakukan registrasi');
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event tidak ditemukan</h2>
          <button onClick={() => navigate('/events')} className="text-purple-600 hover:underline">
            Kembali ke Events
          </button>
        </div>
      </div>
    );
  }

  const isPastEvent = new Date(event.event_date) < new Date();
  const price = event.is_free ? 0 : (event.price || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/events')}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            ← Kembali
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Performers Grid (2 columns) */}
          <div className="lg:col-span-2">
            {/* Event Image Banner */}
            {event.image_url && (
              <div 
                className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden"
                style={{ aspectRatio: event.image_aspect_ratio?.replace(':', '/') || '16/9' }}
              >
                <img
                  src={`http://localhost:3000${event.image_url}`}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Performers</h2>
              <div className="grid grid-cols-2 gap-4">
                {performers.length > 0 ? (
                  performers.map((performer) => (
                    <div key={performer.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-14 h-14 rounded-lg flex-shrink-0 shadow-md overflow-hidden">
                        {performer.photo_url ? (
                          <img
                            src={`http://localhost:3000${performer.photo_url}`}
                            alt={performer.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center ${performer.photo_url ? 'hidden' : 'flex'}`}>
                          <span className="text-white text-2xl">🎭</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{performer.name}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    <p className="text-sm">Lineup belum tersedia</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Event Details Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6 shadow-sm">
              {/* Event Title */}
              <h1 className="text-xl font-bold text-gray-900 mb-6 leading-tight">
                {event.title}
              </h1>

              {/* Date */}
              <div className="flex items-start gap-3 mb-4">
                <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">{formatDate(event.event_date)}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-3 mb-4">
                <Clock className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">{event.event_time} WIB</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3 mb-2">
                <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-gray-900 font-medium leading-snug">{event.location}</p>
                </div>
              </div>

              {/* Petunjuk Arah Link */}
              <div className="ml-8 mb-6">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                >
                  Petunjuk Arah
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Organizer */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Dibuat Oleh</p>
                <p className="text-gray-900 font-medium">
                  {event.organizer || 'EventHub Team'}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Mulai Dari</p>
                <p className="text-2xl font-bold text-gray-900">
                  {event.is_free ? 'Gratis' : formatPrice(price)}
                </p>
              </div>

              {/* CTA Button */}
              {isPastEvent ? (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-600 font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
                >
                  Event Telah Berakhir
                </button>
              ) : !isAuthenticated ? (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Login untuk Beli
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {registering ? 'Processing...' : 'Beli Sekarang'}
                </button>
              )}

              {/* Media Sosial */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-900 mb-3">Media Sosial</p>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-pink-600" />
                    <span className="text-sm text-gray-700">Instagram</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                    </svg>
                    <span className="text-sm text-gray-700">TikTok</span>
                  </a>
                </div>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mt-3"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="text-sm text-gray-700">X</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section Below */}
        <div className="mt-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Deskripsi</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventDetailModern;
