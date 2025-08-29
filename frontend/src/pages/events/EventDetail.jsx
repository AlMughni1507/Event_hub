import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import '../../styles/theme.css';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.data);
    } catch (error) {
      console.error('Error fetching event:', error);
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setRegistering(true);
    try {
      const response = await api.post('/payments/create', {
        event_id: event.id
      });

      // Simple database payment - no external gateway
      if (response.data.data.status === 'success') {
        alert('🎉 Registration successful! You are now registered for this event.');
        navigate('/settings');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to register. Please try again.');
      }
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    if (price === 0) return 'GRATIS';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-starfield flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-starfield flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
          <button
            onClick={() => navigate('/events')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const isEventFull = event.approved_registrations >= event.max_participants;
  const isPastEvent = new Date(event.event_date) < new Date();

  return (
    <div className="min-h-screen bg-starfield">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        {event.image_url ? (
          <img
            src={`http://localhost:3000${event.image_url}`}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <div className="text-9xl">🎪</div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-4">
              <span className="bg-white/90 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold mr-4">
                {event.category_name}
              </span>
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                {formatPrice(event.registration_fee)}
              </span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">📝 About This Event</h2>
              <div className="text-purple-200 text-lg leading-relaxed whitespace-pre-wrap">
                {event.description}
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">ℹ️ Event Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <span className="text-2xl mr-4">📅</span>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Date & Time</h3>
                    <p className="text-purple-200">{formatDate(event.event_date)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-4">📍</span>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Location</h3>
                    <p className="text-purple-200">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-4">👥</span>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Participants</h3>
                    <p className="text-purple-200">
                      {event.approved_registrations || 0} / {event.max_participants} registered
                    </p>
                    <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(((event.approved_registrations || 0) / event.max_participants) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-4">💰</span>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Registration Fee</h3>
                    <p className="text-purple-200 text-xl font-bold">
                      {formatPrice(event.registration_fee)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 sticky top-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                🎟️ Registration
              </h2>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white mb-2">
                  {formatPrice(event.registration_fee)}
                </div>
                <p className="text-purple-200">per person</p>
              </div>

              {isPastEvent ? (
                <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 text-center">
                  <div className="text-red-400 font-semibold">
                    ⏰ This event has already passed
                  </div>
                </div>
              ) : isEventFull ? (
                <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-xl p-4 text-center">
                  <div className="text-yellow-400 font-semibold">
                    🔒 Event is Full
                  </div>
                  <p className="text-yellow-300 text-sm mt-2">
                    All spots have been taken
                  </p>
                </div>
              ) : !user ? (
                <div className="space-y-4">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Login to Register
                  </button>
                  <p className="text-purple-200 text-sm text-center">
                    You need to login first to register for this event
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {registering ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        🎫 Register Now
                      </>
                    )}
                  </button>
                  
                  <div className="bg-blue-500/20 border border-blue-500/40 rounded-xl p-4">
                    <div className="flex items-center text-blue-400 text-sm">
                      <span className="mr-2">🔒</span>
                      Secure payment powered by Midtrans
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-white/20">
                <h3 className="text-white font-semibold mb-4">📋 What's Included:</h3>
                <ul className="space-y-2 text-purple-200 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2">✅</span>
                    Event access
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✅</span>
                    Digital certificate
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✅</span>
                    Event materials
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✅</span>
                    Networking opportunities
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Midtrans Snap Script */}
      <script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key={process.env.REACT_APP_MIDTRANS_CLIENT_KEY}
      ></script>
    </div>
  );
};

export default EventDetail;
