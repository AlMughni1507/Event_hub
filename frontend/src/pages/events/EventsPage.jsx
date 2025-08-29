import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI, categoriesAPI } from '../../services/api';
import FallingStars from '../../components/FallingStars';

const EventsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch categories and events in parallel
      const [categoriesResponse, eventsResponse] = await Promise.all([
        categoriesAPI.getAll({ is_active: true }),
        eventsAPI.getAll({ limit: 50 })
      ]);
      
      // Add 'all' category at the beginning
      const allCategories = [
        { id: 'all', name: 'Semua Kategori', icon: '🎪' },
        ...categoriesResponse.data.categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon || '🎪'
        }))
      ];
      
      setCategories(allCategories);
      setEvents(eventsResponse.data.events || []);
      setIsLoaded(true);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal memuat data. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes} WIB`;
  };

  const formatPrice = (price, isFree) => {
    if (isFree || price === 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'olahraga': '🏃‍♂️',
      'seminar': '🎓',
      'pertunjukan': '🎭',
      'pameran': '🎪',
      'workshop': '🛠️',
      'konser': '🎵',
      'festival': '🎉',
      'kompetisi': '🏆'
    };
    return iconMap[categoryName?.toLowerCase()] || '🎪';
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category_id == selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-deep-space relative overflow-hidden">
      {/* Falling Stars Background */}
      <FallingStars density="medium" />
      {/* Cosmic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-comet-cyan/10 rounded-full blur-3xl animate-cosmic-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-plasma-purple/10 rounded-full blur-3xl animate-stellar-drift"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-aurora-green/8 rounded-full blur-3xl animate-nebula-swirl"></div>
        <div className="absolute top-10 right-10 w-48 h-48 bg-nebula-pink/8 rounded-full blur-2xl animate-space-float"></div>
        
        {/* Floating cosmic particles */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-starlight/15 rounded-full animate-cosmic-twinkle" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-comet-cyan/25 rounded-full animate-stellar-drift" style={{animationDelay: '1.2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-plasma-purple/30 rounded-full animate-cosmic-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-aurora-green/20 rounded-full animate-space-float" style={{animationDelay: '1.8s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="cosmic-glass border-b border-starlight/10 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={handleBackToHome}
                className="flex items-center text-starlight hover:text-comet-cyan transition-colors group animate-slide-in-left"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke Beranda
              </button>
            </div>
            
            <div className="flex items-center animate-slide-in-right">
              <div className="w-8 h-8 bg-gradient-to-r from-comet-cyan to-plasma-purple rounded-full flex items-center justify-center animate-glow">
                <svg className="w-5 h-5 text-starlight animate-cosmic-twinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section className="pt-20 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space/95 via-cosmic-navy/30 to-void-black/95"></div>
        
        {/* Background Elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-comet-cyan/8 rounded-full blur-3xl animate-cosmic-pulse"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-plasma-purple/8 rounded-full blur-2xl animate-stellar-drift"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-starlight mb-6 animate-fade-in-up">
              Event Terbaru
            </h1>
            <p className="text-lg md:text-xl text-moon-silver mb-8 max-w-3xl mx-auto animate-slide-in-left">
              Temukan event menarik yang sesuai dengan minat Anda dan bergabunglah dengan komunitas yang luar biasa
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8 animate-zoom-in">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari event..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 cosmic-glass border border-starlight/20 rounded-xl text-starlight placeholder-moon-silver focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all animate-glow"
                />
                <svg className="absolute left-3 top-3.5 h-5 w-5 text-moon-silver animate-cosmic-twinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center animate-zoom-in animate-glow ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-comet-cyan to-plasma-purple text-starlight shadow-lg shadow-comet-cyan/30'
                      : 'cosmic-glass text-moon-silver hover:bg-cosmic-navy/20 border border-starlight/20'
                  }`}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <span className="mr-2 text-lg animate-cosmic-twinkle">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-plasma-purple/5 rounded-full blur-3xl animate-stellar-drift"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-aurora-green/5 rounded-full blur-2xl animate-cosmic-pulse"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="text-6xl mb-4 animate-spin">⏳</div>
              <h3 className="text-xl font-semibold text-starlight mb-2 animate-cosmic-twinkle">Memuat event...</h3>
              <p className="text-moon-silver animate-fade-in-up">Mohon tunggu sebentar</p>
            </div>
          ) : error || events.length === 0 ? (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="text-6xl mb-4 animate-bounce-slow">🎪</div>
              <h3 className="text-xl font-semibold text-starlight mb-2 animate-cosmic-twinkle">Event Coming Soon</h3>
              <p className="text-moon-silver mb-6 animate-fade-in-up">Event menarik akan segera hadir. Pantau terus untuk update terbaru!</p>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={handleBackToHome}
                  className="bg-gradient-to-r from-comet-cyan to-plasma-purple hover:from-comet-cyan/80 hover:to-plasma-purple/80 text-starlight font-medium py-2 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-comet-cyan/30 animate-glow"
                >
                  Kembali ke Beranda
                </button>
                {error && (
                  <button 
                    onClick={fetchData}
                    className="cosmic-glass border border-starlight/20 hover:bg-cosmic-navy/20 text-starlight font-medium py-2 px-6 rounded-xl transition-all transform hover:scale-105 animate-glow"
                  >
                    Coba Lagi
                  </button>
                )}
              </div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="text-6xl mb-4 animate-bounce-slow">🔍</div>
              <h3 className="text-xl font-semibold text-starlight mb-2 animate-cosmic-twinkle">Tidak ada event ditemukan</h3>
              <p className="text-moon-silver animate-fade-in-up">Coba ubah filter atau kata kunci pencarian Anda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <div key={event.id} className="cosmic-glass rounded-2xl overflow-hidden border border-starlight/10 hover:border-comet-cyan/50 transition-all group cursor-pointer animate-zoom-in animate-glow" style={{animationDelay: `${index * 0.2}s`}}>
                  {/* Event Image */}
                  <div className="h-48 bg-gradient-to-br from-comet-cyan/30 to-plasma-purple/30 flex items-center justify-center relative overflow-hidden">
                    {event.image ? (
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="text-6xl group-hover:scale-110 transition-transform animate-cosmic-twinkle" style={{display: event.image ? 'none' : 'flex'}}>
                      {getCategoryIcon(event.category_name)}
                    </div>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all"></div>
                    
                    {/* Floating cosmic particles in event cards */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-starlight/30 rounded-full animate-cosmic-twinkle"></div>
                    <div className="absolute bottom-4 left-4 w-1 h-1 bg-comet-cyan/50 rounded-full animate-stellar-drift"></div>
                    <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-plasma-purple/40 rounded-full animate-cosmic-pulse"></div>
                  </div>
                  
                  {/* Event Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cosmic-glass text-comet-cyan border border-comet-cyan/30 animate-glow">
                        {event.category_name || 'Umum'}
                      </span>
                      <span className="text-sm text-moon-silver animate-fade-in-up">{formatDate(event.event_date)}</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-starlight mb-2 group-hover:text-comet-cyan transition-colors">{event.title}</h3>
                    <p className="text-moon-silver text-sm mb-4 line-clamp-2">{event.short_description || event.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-moon-silver group-hover:text-comet-cyan transition-colors">
                        <svg className="w-4 h-4 mr-2 animate-cosmic-twinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(event.event_time)}
                      </div>
                      <div className="flex items-center text-sm text-moon-silver group-hover:text-aurora-green transition-colors">
                        <svg className="w-4 h-4 mr-2 animate-stellar-drift" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location || 'Lokasi TBA'}
                      </div>
                      <div className="flex items-center text-sm text-moon-silver group-hover:text-nebula-pink transition-colors">
                        <svg className="w-4 h-4 mr-2 animate-scale-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {event.approved_registrations || event.current_participants || 0}/{event.max_participants || '∞'} peserta
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-cosmic animate-gradient-shift bg-[length:200%_200%]">
                        {formatPrice(event.price, event.is_free)}
                      </span>
                      <button className="bg-gradient-to-r from-comet-cyan to-plasma-purple hover:from-comet-cyan/80 hover:to-plasma-purple/80 text-starlight font-medium py-2 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-comet-cyan/30 animate-glow">
                        <span className="flex items-center gap-2">
                          Daftar Sekarang
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
