import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    event_date: '',
    end_date: '',
    location: '',
    is_online: false,
    address: '',
    city: '',
    province: '',
    category_id: '',
    max_participants: '50',
    registration_fee: '0',
    registration_deadline: '',
    status: 'published',
    tags: '',
    is_free: false,
    unlimited_participants: false,
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      setEvents(response.data.events || response.data.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories || response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar! Maksimal 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar!');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Basic validations
      const newErrors = {};
      if (!formData.title || formData.title.trim().length < 5) newErrors.title = 'Judul minimal 5 karakter';
      if (!formData.description || formData.description.trim().length < 20) newErrors.description = 'Deskripsi minimal 20 karakter';
      if (!formData.event_date) newErrors.event_date = 'Tanggal & waktu mulai wajib diisi';
      if (!formData.category_id) newErrors.category_id = 'Kategori wajib dipilih';
      if (!formData.is_online && !formData.location) newErrors.location = 'Lokasi wajib diisi untuk event offline';
      if (Object.keys(newErrors).length) {
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      // Split datetime-local into date and time
      const startDateTime = new Date(formData.event_date);
      const eventDate = startDateTime.toISOString().split('T')[0]; // YYYY-MM-DD
      const eventTime = startDateTime.toTimeString().split(' ')[0].substring(0, 5); // HH:MM (without seconds)

      const endDate = formData.end_date ? new Date(formData.end_date).toISOString().split('T')[0] : eventDate;
      const endTime = formData.end_date ? new Date(formData.end_date).toTimeString().split(' ')[0] : eventTime;

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('short_description', (formData.short_description || formData.description).substring(0, 200));
      submitData.append('event_date', eventDate);
      submitData.append('event_time', eventTime);
      submitData.append('end_date', endDate);
      submitData.append('end_time', endTime);
      submitData.append('location', formData.location);
      submitData.append('address', formData.address || formData.location);
      submitData.append('city', formData.city || 'Jakarta');
      submitData.append('province', formData.province || 'DKI Jakarta');
      submitData.append('category_id', parseInt(formData.category_id));
      submitData.append('max_participants', formData.unlimited_participants ? 0 : parseInt(formData.max_participants));
      submitData.append('price', parseFloat(formData.registration_fee));
      submitData.append('is_free', formData.is_free || parseFloat(formData.registration_fee) === 0);
      // Derived tiers
      const priceNumber = parseFloat(formData.registration_fee) || 0;
      const premiumPrice = Math.round(priceNumber * 1.15);
      submitData.append('price_regular', priceNumber);
      submitData.append('price_premium', premiumPrice);
      submitData.append('status', formData.status || 'published');
      if (formData.registration_deadline) submitData.append('registration_deadline', formData.registration_deadline);
      if (formData.tags) submitData.append('tags', formData.tags);
      submitData.append('is_online', formData.is_online);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      console.log('Creating event with image...');
      await api.post('/events', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert('Event berhasil dibuat!');
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        short_description: '',
        event_date: '',
        end_date: '',
        location: '',
        is_online: false,
        address: '',
        city: '',
        province: '',
        category_id: '',
        max_participants: '50',
        registration_fee: '0',
        registration_deadline: '',
        status: 'published',
        tags: '',
        is_free: false,
        unlimited_participants: false,
        image: null
      });
      setImagePreview(null);
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      alert(error?.message || 'Gagal membuat event. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Yakin ingin menghapus event ini?')) {
      try {
        await api.delete(`/events/${id}`);
        alert('Event berhasil dihapus!');
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Gagal hapus event.');
      }
    }
  };

  const handleToggleHighlight = async (eventId, currentHighlightStatus) => {
    try {
      const newStatus = !currentHighlightStatus;
      await api.put(`/events/${eventId}/highlight`, {
        is_highlighted: newStatus
      });
      
      alert(newStatus ? 
        '✨ Event berhasil di-set sebagai Highlight Event! Event ini akan muncul di Hero Section homepage.' : 
        'Event highlight berhasil dihapus.'
      );
      fetchEvents();
    } catch (error) {
      console.error('Error toggling highlight:', error);
      alert('Gagal mengubah status highlight event.');
    }
  };

  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Belum diatur';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Event Management
              </h1>
              <p className="text-gray-600">Kelola dan pantau semua event Anda dalam satu tempat</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Buat Event Baru
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{events.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900">{events.filter(e => new Date(e.event_date) > new Date()).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Past Events</p>
                <p className="text-3xl font-bold text-gray-900">{events.filter(e => new Date(e.event_date) <= new Date()).length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Categories</p>
                <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari event berdasarkan judul..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data event...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredEvents.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Event</h3>
                <p className="text-gray-600 mb-6">Mulai buat event pertama Anda dan jangkau lebih banyak peserta</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Buat Event Sekarang
                </button>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200 group">
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                          <p className="text-gray-600 line-clamp-2 leading-relaxed">{event.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          new Date(event.event_date) > new Date()
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {new Date(event.event_date) > new Date() ? 'Upcoming' : 'Past'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Tanggal</p>
                            <p className="text-sm font-semibold text-gray-900">{formatDate(event.event_date)}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Lokasi</p>
                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{event.location || 'TBA'}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Kapasitas</p>
                            <p className="text-sm font-semibold text-gray-900">{event.max_participants || '∞'} orang</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Harga</p>
                            <p className="text-sm font-semibold text-gray-900">{formatPrice(event.price || event.registration_fee)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {/* Edit Event Button */}
                      <Link
                        to={`/admin/events/edit/${event.id}`}
                        className="group/btn flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>

                      {/* Highlight Event Button */}
                      <button
                        onClick={() => handleToggleHighlight(event.id, event.is_highlighted)}
                        className={`group/btn flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                          event.is_highlighted
                            ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700 hover:text-yellow-800 border-2 border-yellow-400'
                            : 'bg-purple-50 hover:bg-purple-100 text-purple-600 hover:text-purple-700'
                        }`}
                        title={event.is_highlighted ? 'Event ini sedang di-highlight di homepage' : 'Set sebagai highlight event'}
                      >
                        <svg className="w-4 h-4" fill={event.is_highlighted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        {event.is_highlighted ? '★ Highlighted' : 'Set Highlight'}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="group/btn flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">Buat Event Baru</h2>
                <p className="text-gray-600">Isi detail event yang akan Anda buat</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-8">
              {/* Grid layout: Form left, Live preview right */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Judul Event *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Masukkan judul event yang menarik"
                />
                {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi Event *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Deskripsikan event Anda secara detail..."
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
              </div>

              {/* Short description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Singkat</label>
                <input
                  type="text"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ringkasan 1-2 kalimat untuk kartu event"
                />
                <p className="text-xs text-gray-500 mt-1">Otomatis dipotong hingga 200 karakter saat disimpan</p>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Foto Event
                </label>
                <div className="mt-1">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Klik untuk upload</span> atau drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Upload foto untuk menarik lebih banyak peserta</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date & Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tanggal & Waktu *
                  </label>
                  <input
                    type="datetime-local"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  {errors.event_date && <p className="text-sm text-red-600 mt-1">{errors.event_date}</p>}
                </div>

                {/* End Date & Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Selesai (opsional)</label>
                  <input
                    type="datetime-local"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategori *
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Pilih kategori</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && <p className="text-sm text-red-600 mt-1">{errors.category_id}</p>}
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Event Online?</label>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" name="is_online" checked={formData.is_online} onChange={handleInputChange} className="w-5 h-5" />
                    <span className="text-gray-600 text-sm">Centang jika event dilaksanakan online</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                    <option value="archived">archived</option>
                  </select>
                </div>
              </div>

              {!formData.is_online && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Lokasi/Venue *</label>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" placeholder="Nama venue atau link meeting" />
                    {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" placeholder="Alamat lengkap" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kota</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Provinsi</label>
                    <input type="text" name="province" value={formData.province} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Max Participants */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Maksimal Peserta *
                  </label>
                  <input
                    type="number"
                    name="max_participants"
                    value={formData.max_participants}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Contoh: 100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Masukkan jumlah maksimal peserta</p>
                  <div className="mt-3 flex items-center gap-2">
                    <input type="checkbox" name="unlimited_participants" checked={formData.unlimited_participants} onChange={handleInputChange} className="w-5 h-5" />
                    <span className="text-sm text-gray-700">Peserta tak terbatas</span>
                  </div>
                </div>

                {/* Registration Fee */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Harga Tiket (Rp) *
                  </label>
                  <input
                    type="number"
                    name="registration_fee"
                    value={formData.registration_fee}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Contoh: 50000 atau 0 untuk gratis"
                  />
                  <p className="text-xs text-gray-500 mt-1">Masukkan 0 atau centang gratis untuk event gratis</p>
                  <div className="mt-3 flex items-center gap-2">
                    <input type="checkbox" name="is_free" checked={formData.is_free} onChange={handleInputChange} className="w-5 h-5" />
                    <span className="text-sm text-gray-700">Event gratis</span>
                  </div>
                  {/* Tiered price preview */}
                  <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Tingkat Harga</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>Reguler</span>
                      <span className="font-semibold">{(Number(formData.registration_fee) || 0).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span>Premium (+15%)</span>
                      <span className="font-semibold">{Math.round((Number(formData.registration_fee) || 0) * 1.15).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Batas Pendaftaran (opsional)</label>
                  <input type="date" name="registration_deadline" value={formData.registration_deadline} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tag (pisahkan dengan koma)</label>
                  <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" placeholder="tech, workshop, seminar" />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Membuat Event...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Buat Event
                    </span>
                  )}
                </button>
              </div>
                </div>

                {/* Live Preview */}
                <div className="hidden lg:block">
                  <div className="sticky top-4">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-6 shadow-xl">
                      <h3 className="text-xl font-semibold mb-4">Preview Kartu Event</h3>
                      <div className="bg-white rounded-xl p-5 text-gray-900">
                        <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                          {imagePreview ? (
                            <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">Tidak ada gambar</div>
                          )}
                        </div>
                        <h4 className="text-lg font-bold mb-1 line-clamp-2">{formData.title || 'Judul Event'}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{formData.short_description || formData.description || 'Deskripsi singkat event...'}</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                            <span>{formData.event_date ? new Date(formData.event_date).toLocaleString('id-ID') : '-'}</span>
                          </div>
                          <div className="text-right font-semibold">{parseFloat(formData.registration_fee || 0) === 0 ? 'Gratis' : `Rp ${Number(formData.registration_fee).toLocaleString('id-ID')}`}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManagement;
