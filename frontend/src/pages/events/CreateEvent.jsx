import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    category_id: '',
    max_participants: '50',
    registration_fee: '0'
  });

  console.log('CreateEvent component loaded');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Split datetime-local into date and time
      const dateTime = new Date(formData.event_date);
      const eventDate = dateTime.toISOString().split('T')[0]; // YYYY-MM-DD
      const eventTime = dateTime.toTimeString().split(' ')[0]; // HH:MM:SS

      const eventData = {
        title: formData.title,
        description: formData.description,
        short_description: formData.description.substring(0, 200), // Use first 200 chars
        event_date: eventDate,
        event_time: eventTime,
        end_date: eventDate, // Same day for now
        end_time: eventTime, // Same time for now
        location: formData.location,
        address: formData.location, // Use location as address
        city: 'Jakarta', // Default city
        province: 'DKI Jakarta', // Default province
        category_id: parseInt(formData.category_id),
        max_participants: parseInt(formData.max_participants),
        price: parseFloat(formData.registration_fee),
        is_free: parseFloat(formData.registration_fee) === 0,
        image_url: null,
        banner: null,
        status: 'published'
      };

      console.log('Sending event data:', eventData);
      await api.post('/events', eventData);
      
      alert('Event berhasil dibuat!');
      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
      const errorMsg = error?.message || 'Failed to create event. Please try again.';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Remove admin check - allow all users to create events
  // if (!user || user.role !== 'admin') {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
  //       <div className="text-white text-center">
  //         <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
  //         <p>You need admin privileges to create events.</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent mb-4">
            🎪 Create New Event
          </h1>
          <p className="text-xl text-gray-300">
            Design an amazing experience for your audience
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  🎯 Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  📂 Category
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id} className="text-gray-800">
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                📝 Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm resize-none"
                placeholder="Describe your event in detail..."
              />
            </div>

            {/* Date and Location */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  📅 Event Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  📍 Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                  placeholder="Event venue or online link"
                />
              </div>
            </div>

            {/* Simple Options */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  👥 Max Participants
                </label>
                <select
                  name="max_participants"
                  value={formData.max_participants}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                >
                  <option value="25" className="text-gray-800">25 orang</option>
                  <option value="50" className="text-gray-800">50 orang</option>
                  <option value="100" className="text-gray-800">100 orang</option>
                  <option value="200" className="text-gray-800">200 orang</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  💰 Harga Tiket
                </label>
                <select
                  name="registration_fee"
                  value={formData.registration_fee}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                >
                  <option value="0" className="text-gray-800">Gratis</option>
                  <option value="50000" className="text-gray-800">Rp 50.000</option>
                  <option value="100000" className="text-gray-800">Rp 100.000</option>
                  <option value="150000" className="text-gray-800">Rp 150.000</option>
                  <option value="250000" className="text-gray-800">Rp 250.000</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-12 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Creating Event...
                  </div>
                ) : (
                  <>
                    🚀 Create Event
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
