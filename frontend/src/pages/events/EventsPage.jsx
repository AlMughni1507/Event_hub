import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EventsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'Semua Kategori', icon: '🎪' },
    { id: 'olahraga', name: 'Olahraga', icon: '🏃‍♂️' },
    { id: 'seminar', name: 'Seminar', icon: '🎓' },
    { id: 'pertunjukan', name: 'Pertunjukan', icon: '🎭' },
    { id: 'pameran', name: 'Pameran', icon: '🎪' }
  ];

  const events = [
    {
      id: 1,
      title: "Marathon Jakarta 2024",
      category: "olahraga",
      date: "15 Desember 2024",
      time: "06:00 WIB",
      location: "Jakarta",
      price: "Rp 150.000",
      image: "🏃‍♂️",
      description: "Marathon tahunan Jakarta dengan rute yang menakjubkan melintasi landmark kota.",
      organizer: "Jakarta Marathon Committee",
      participants: 250,
      maxParticipants: 1000,
      status: "active"
    },
    {
      id: 2,
      title: "Tech Conference 2024",
      category: "seminar",
      date: "20 Desember 2024",
      time: "09:00 WIB",
      location: "Jakarta Convention Center",
      price: "Rp 500.000",
      image: "🎓",
      description: "Konferensi teknologi terbesar di Indonesia dengan pembicara internasional.",
      organizer: "Tech Indonesia",
      participants: 180,
      maxParticipants: 500,
      status: "active"
    },
    {
      id: 3,
      title: "Music Festival Jakarta",
      category: "pertunjukan",
      date: "25 Desember 2024",
      time: "18:00 WIB",
      location: "GBK",
      price: "Rp 300.000",
      image: "🎭",
      description: "Festival musik dengan lineup artis lokal dan internasional terbaik.",
      organizer: "Music Festival Indonesia",
      participants: 500,
      maxParticipants: 2000,
      status: "active"
    },
    {
      id: 4,
      title: "Expo Kreatif Indonesia",
      category: "pameran",
      date: "30 Desember 2024",
      time: "10:00 WIB",
      location: "ICE BSD",
      price: "Rp 100.000",
      image: "🎪",
      description: "Pameran kreatif terbesar yang menampilkan karya seni dan inovasi.",
      organizer: "Creative Indonesia",
      participants: 120,
      maxParticipants: 800,
      status: "active"
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={handleBackToHome}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke Beranda
              </button>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section className="pt-20 pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Event Terbaru
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Temukan event menarik yang sesuai dengan minat Anda
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari event..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada event ditemukan</h3>
              <p className="text-gray-600">Coba ubah filter atau kata kunci pencarian Anda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Event Image */}
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <div className="text-6xl">{event.image}</div>
                  </div>
                  
                  {/* Event Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {categories.find(cat => cat.id === event.category)?.name}
                      </span>
                      <span className="text-sm text-gray-500">{event.date}</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {event.participants}/{event.maxParticipants} peserta
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">{event.price}</span>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                        Daftar Sekarang
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
