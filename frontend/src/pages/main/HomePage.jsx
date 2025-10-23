import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowRight, Ticket, Star } from 'lucide-react';
import { eventsAPI } from '../../services/api';
import Footer from '../../components/Footer';
import ResponsiveNavbar from '../../components/ResponsiveNavbar';

const HomePage = () => {
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch highlighted event for hero section
        const highlightedResponse = await fetch('http://localhost:3000/api/events/highlighted/event');
        const highlightedData = await highlightedResponse.json();
        
        console.log('Highlighted event response:', highlightedData);
        console.log('Image URL:', highlightedData.data?.image_url);
        
        if (highlightedData.success && highlightedData.data) {
          setFeaturedEvent(highlightedData.data);
        }
        
        // Fetch upcoming events for sections below
        const response = await eventsAPI.getAll({ limit: 10, status: 'published' });
        const events = response?.data?.events || [];
        
        // Get upcoming events (filter out the highlighted one)
        const upcoming = events.filter(event => 
          new Date(event.event_date) > new Date() && 
          event.id !== highlightedData.data?.id
        );
        
        setUpcomingEvents(upcoming.slice(0, 6));
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Countdown timer for featured event
  useEffect(() => {
    if (!featuredEvent) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const eventDate = new Date(featuredEvent.event_date).getTime();
      const distance = eventDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [featuredEvent]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@300;400;600;700;900&display=swap');
        
        @keyframes neon-glow {
          0%, 100% { 
            text-shadow: 0 0 10px #ff006e, 0 0 20px #ff006e, 0 0 30px #ff006e, 0 0 40px #ff006e;
            filter: brightness(1);
          }
          50% { 
            text-shadow: 0 0 20px #ff006e, 0 0 30px #ff006e, 0 0 40px #ff006e, 0 0 50px #ff006e, 0 0 60px #ff006e;
            filter: brightness(1.2);
          }
        }
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 30px rgba(255, 0, 110, 0.6), 0 0 60px rgba(138, 43, 226, 0.4);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 50px rgba(255, 0, 110, 0.8), 0 0 80px rgba(138, 43, 226, 0.6);
            transform: scale(1.02);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes slide-up {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .font-bebas { font-family: 'Bebas Neue', cursive; }
        .font-poppins { font-family: 'Poppins', sans-serif; }
        .animate-neon-glow { animation: neon-glow 2s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        
        .text-stroke {
          -webkit-text-stroke: 2px rgba(255, 255, 255, 0.3);
          paint-order: stroke fill;
        }
        
        .countdown-box {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 0, 110, 0.5);
          position: relative;
          overflow: hidden;
        }
        
        .countdown-box::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #ff006e, #8a2be2, #ff006e);
          z-index: -1;
          filter: blur(10px);
          opacity: 0.7;
        }
      `}</style>

      {/* Custom Transparent Navbar for HomePage */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/90 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="font-bebas text-2xl text-white tracking-wider">EVENTHUB</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => navigate('/')} className="font-poppins text-pink-400 font-semibold">Home</button>
              <button onClick={() => navigate('/events')} className="font-poppins text-white hover:text-pink-400 transition-colors font-medium">Events</button>
              <button onClick={() => navigate('/blog')} className="font-poppins text-white hover:text-pink-400 transition-colors font-medium">Blog</button>
              <button onClick={() => navigate('/contact')} className="font-poppins text-white hover:text-pink-400 transition-colors font-medium">Contact</button>
              <button onClick={() => navigate('/about')} className="font-poppins text-white hover:text-pink-400 transition-colors font-medium">About</button>
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="hidden md:block font-poppins px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
              
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

      {/* Hero Section - Minimalist & Modern */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: featuredEvent?.image_url 
                ? `url(http://localhost:3000${featuredEvent.image_url})`
                : 'url(https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&h=1080&fit=crop)',
            }}
          ></div>
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-purple-900/70 to-purple-800/60"></div>
          
          {/* Bottom fade to white */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white"></div>
        </div>

        {/* Content - Compact & Modern */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-white py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-4 font-poppins">Loading...</p>
            </div>
          ) : featuredEvent ? (
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Left: Event Image Card */}
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                  {featuredEvent.image_url ? (
                    <img 
                      src={`http://localhost:3000${featuredEvent.image_url}`}
                      alt={featuredEvent.title}
                      className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        console.error('Image failed to load:', featuredEvent.image_url);
                        e.target.src = 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800';
                      }}
                    />
                  ) : (
                    <div className="w-full h-[400px] bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center">
                      <div className="text-center text-white">
                        <svg className="w-24 h-24 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <p className="text-xl font-bold">Event Image</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  {/* Highlight Badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full font-poppins font-bold text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Featured Event
                  </div>
                </div>
              </div>

              {/* Right: Event Info */}
              <div className="w-full lg:w-1/2 text-white">
                <h1 className="font-bebas text-5xl md:text-6xl font-black mb-4 leading-tight">
                  {featuredEvent.title}
                </h1>
                
                <p className="font-poppins text-gray-300 text-lg mb-6 line-clamp-3">
                  {featuredEvent.short_description || featuredEvent.description}
                </p>

                {/* Countdown - Compact */}
                <div className="flex gap-3 mb-6">
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 flex-1 border border-pink-500/30">
                    <div className="font-bebas text-4xl font-black text-pink-400">{countdown.days}</div>
                    <div className="font-poppins text-xs text-white/80">Days</div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 flex-1 border border-pink-500/30">
                    <div className="font-bebas text-4xl font-black text-pink-400">{countdown.hours}</div>
                    <div className="font-poppins text-xs text-white/80">Hours</div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 flex-1 border border-pink-500/30">
                    <div className="font-bebas text-4xl font-black text-pink-400">{countdown.minutes}</div>
                    <div className="font-poppins text-xs text-white/80">Min</div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 flex-1 border border-pink-500/30">
                    <div className="font-bebas text-4xl font-black text-pink-400">{countdown.seconds}</div>
                    <div className="font-poppins text-xs text-white/80">Sec</div>
                  </div>
                </div>

                {/* Event Details - Compact */}
                <div className="flex flex-wrap gap-3 mb-6 font-poppins text-sm">
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-pink-400" />
                    <span>{new Date(featuredEvent.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-lg">
                    <MapPin className="w-4 h-4 text-pink-400" />
                    <span>{featuredEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-lg">
                    <Users className="w-4 h-4 text-pink-400" />
                    <span>{featuredEvent.approved_registrations || 0} / {featuredEvent.max_participants}</span>
                  </div>
                </div>

                {/* CTA Button - Compact */}
                <button
                  onClick={() => navigate(`/events/${featuredEvent.id}`)}
                  className="group bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-poppins font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center gap-3"
                >
                  <Ticket className="w-5 h-5" />
                  Register Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-white">
              <h1 className="text-6xl font-bold mb-6">No Featured Events</h1>
              <p className="text-xl text-pink-200">Check back soon for upcoming events!</p>
            </div>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section - White Background like prototype */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-poppins text-lg font-bold text-gray-800 mb-2">CHOOSE EVENTS AND TICKETS</h3>
              <p className="font-poppins text-sm text-gray-600">with only a few clicks</p>
            </div>

            <div className="text-center p-6 group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-poppins text-lg font-bold text-gray-800 mb-2">BUY DIRECTLY FROM ORGANIZERS</h3>
              <p className="font-poppins text-sm text-gray-600">Pay online or cash on delivery</p>
            </div>

            <div className="text-center p-6 group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="font-poppins text-lg font-bold text-gray-800 mb-2">RECEIVE TICKETS</h3>
              <p className="font-poppins text-sm text-gray-600">via email or right in your door step</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section - White Background */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-600" />
              Upcoming Events
            </h2>
            <div className="flex gap-3">
              <button className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-poppins font-semibold text-sm transition-all shadow-md hover:shadow-lg">
                THIS WEEK
              </button>
              <button className="px-5 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg font-poppins font-semibold text-sm transition-all border border-gray-300">
                THIS MONTH
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.slice(0, 2).map((event, index) => (
              <div
                key={event.id}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={event.image_url ? `http://localhost:3000${event.image_url}` : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop'}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                    <MapPin className="w-5 h-5" />
                    <span className="font-poppins font-semibold text-sm drop-shadow-lg">{event.location}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-poppins text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-poppins text-sm font-semibold">{event.registration_fee === 0 ? 'FREE' : `Rp ${event.registration_fee.toLocaleString('id-ID')}`}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span className="font-poppins text-sm">{event.approved_registrations || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-blue-600 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span className="font-poppins text-sm font-semibold">
                      {new Date(event.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {upcomingEvents.length === 0 && !loading && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Upcoming Events</h3>
              <p className="text-gray-400">Check back soon for new events!</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Events Section - White Background */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <Star className="w-8 h-8 text-purple-600" />
              Featured Events
            </h2>
            <button 
              onClick={() => navigate('/events')}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-poppins font-semibold text-sm transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.slice(2, 5).map((event) => (
              <div
                key={event.id}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={event.image_url ? `http://localhost:3000${event.image_url}` : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop'}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-poppins font-bold">
                      {new Date(event.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-poppins text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <span className="font-poppins text-sm line-clamp-1">{event.location}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="font-poppins text-sm font-bold text-purple-600">
                      {event.registration_fee === 0 ? 'FREE' : `Rp ${event.registration_fee.toLocaleString('id-ID')}`}
                    </span>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span className="font-poppins text-xs">{event.approved_registrations || 0}/{event.max_participants}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App CTA Section */}
      <section className="py-20 bg-gradient-to-b from-white via-purple-900 to-black relative overflow-hidden">
        {/* Top fade-in gradient from white */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent"></div>
        
        {/* Bottom fade-out gradient to black/dark */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-pink-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <div className="inline-block mb-4">
                <span className="bg-pink-500/20 text-pink-400 px-4 py-2 rounded-full text-sm font-semibold border border-pink-500/30">
                  📱 Coming Soon
                </span>
              </div>
              
              <h2 className="font-bebas text-5xl md:text-7xl font-black mb-6 leading-tight">
                DOWNLOAD OUR
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  MOBILE APP
                </span>
              </h2>
              
              <p className="font-poppins text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                Akses semua event favorit Anda langsung dari smartphone. Daftar event, kelola tiket, dan dapatkan notifikasi real-time.
              </p>

              {/* Features List */}
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-white">Event Discovery</h4>
                    <p className="font-poppins text-sm text-gray-400">Temukan event menarik di sekitar Anda</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-white">Digital Tickets</h4>
                    <p className="font-poppins text-sm text-gray-400">Tiket digital langsung di smartphone Anda</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-white">Smart Notifications</h4>
                    <p className="font-poppins text-sm text-gray-400">Notifikasi untuk event yang Anda ikuti</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/mobile-app')}
                  className="group bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-poppins font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
                
                <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-poppins font-semibold px-8 py-4 rounded-full transition-all duration-300 border border-white/30">
                  Get Notified
                </button>
              </div>
            </div>

            {/* Right Content - Phone Mockup */}
            <div className="relative">
              <div className="relative mx-auto w-64 md:w-80">
                {/* Phone Frame */}
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  {/* Screen */}
                  <div className="bg-white rounded-[2.5rem] overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=800&fit=crop"
                      alt="EventHub Mobile App"
                      className="w-full h-auto"
                    />
                  </div>
                  
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-3xl"></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-pink-500 text-white px-4 py-2 rounded-full font-poppins font-bold text-sm shadow-lg animate-bounce">
                  New!
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-purple-600 text-white px-4 py-2 rounded-full font-poppins font-bold text-sm shadow-lg">
                  iOS & Android
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
