import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
  const [currentImage, setCurrentImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEvent();
    fetchCategories();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${id}`);
      console.log('Event response:', response.data);
      
      // Handle different response structures
      const event = response.data.event || response.data.data || response.data;
      
      if (!event || !event.id) {
        throw new Error('Event not found');
      }
      
      // Format dates for input fields
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
      };

      setFormData({
        title: event.title || '',
        description: event.description || '',
        short_description: event.short_description || '',
        event_date: formatDateForInput(event.event_date),
        end_date: formatDateForInput(event.end_date),
        location: event.location || '',
        is_online: event.is_online || false,
        address: event.address || '',
        city: event.city || '',
        province: event.province || '',
        category_id: event.category_id || '',
        max_participants: event.max_participants || '50',
        registration_fee: event.registration_fee || '0',
        registration_deadline: formatDateForInput(event.registration_deadline),
        status: event.status || 'published',
        tags: event.tags || '',
        is_free: event.is_free || false,
        unlimited_participants: event.unlimited_participants || false,
        image: null
      });

      if (event.image_url) {
        setCurrentImage(`http://localhost:3000${event.image_url}`);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      console.error('Error details:', error.response?.data);
      alert(`Gagal memuat data event: ${error.response?.data?.message || error.message}`);
      navigate('/admin/events');
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

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      const submitData = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          submitData.append('image', formData[key]);
        } else if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      await api.put(`/events/${id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('✅ Event berhasil diupdate!');
      navigate('/admin/events');
    } catch (error) {
      console.error('Error updating event:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      alert('❌ Gagal update event: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/events')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Events
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
          <p className="text-gray-600 mt-2">Update informasi event</p>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdateEvent} className="bg-white rounded-xl shadow-lg p-8">
          {/* Judul Event */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Judul Event <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Masukkan judul event yang menarik"
              required
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Deskripsi Singkat */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deskripsi Singkat
            </label>
            <input
              type="text"
              name="short_description"
              value={formData.short_description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ringkasan 1-2 kalimat untuk kartu event"
              maxLength="200"
            />
            <p className="text-xs text-gray-500 mt-1">Maksimal 200 karakter</p>
          </div>

          {/* Deskripsi Event */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deskripsi Event <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Deskripsikan event Anda secara detail..."
              required
            ></textarea>
          </div>

          {/* Foto Event */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Foto Event
            </label>
            
            {/* Current Image */}
            {currentImage && !imagePreview && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Foto saat ini:</p>
                <img 
                  src={currentImage} 
                  alt="Current event" 
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* New Image Preview */}
            {imagePreview && (
              <div className="mb-4 relative">
                <p className="text-sm text-gray-600 mb-2">Foto baru:</p>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-8 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {imagePreview ? 'Foto baru akan mengganti foto lama' : 'Upload foto baru jika ingin mengubah (Maksimal 5MB)'}
            </p>
          </div>

          {/* Tanggal & Waktu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal & Waktu Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="event_date"
                value={formData.event_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal & Waktu Selesai
              </label>
              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Lokasi */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lokasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Contoh: Gedung Serbaguna, Jakarta"
              required
            />
          </div>

          {/* Online Event */}
          <div className="mb-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_online"
                checked={formData.is_online}
                onChange={handleInputChange}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">Event Online</span>
            </label>
          </div>

          {/* Kategori */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Kapasitas */}
          <div className="mb-6">
            <label className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                name="unlimited_participants"
                checked={formData.unlimited_participants}
                onChange={handleInputChange}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">Kapasitas Tidak Terbatas</span>
            </label>
            {!formData.unlimited_participants && (
              <input
                type="number"
                name="max_participants"
                value={formData.max_participants}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Maksimal peserta"
                min="1"
              />
            )}
          </div>

          {/* Biaya */}
          <div className="mb-6">
            <label className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                name="is_free"
                checked={formData.is_free}
                onChange={handleInputChange}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">Event Gratis</span>
            </label>
            {!formData.is_free && (
              <input
                type="number"
                name="registration_fee"
                value={formData.registration_fee}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Biaya pendaftaran (Rp)"
                min="0"
              />
            )}
          </div>

          {/* Deadline Pendaftaran */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deadline Pendaftaran
            </label>
            <input
              type="datetime-local"
              name="registration_deadline"
              value={formData.registration_deadline}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Status */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status Event
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/admin/events')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
