import React, { useState, useEffect } from 'react';
import { eventsAPI, categoriesAPI } from '../../services/api';

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: ''
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    category_id: '',
    event_date: '',
    event_time: '',
    end_date: '',
    end_time: '',
    location: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    max_participants: '',
    price: '',
    is_free: false,
    is_featured: false,
    is_active: true,
    status: 'draft',
    registration_deadline: ''
  });

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category_id = filters.category;
      if (filters.status) params.status = filters.status;
      
      const response = await eventsAPI.getAll(params);
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        ...formData,
        organizer_id: 1, // Default admin organizer
        price: formData.is_free ? 0 : parseFloat(formData.price) || 0,
        max_participants: parseInt(formData.max_participants) || null
      };

      if (editingEvent) {
        await eventsAPI.update(editingEvent.id, eventData);
      } else {
        await eventsAPI.create(eventData);
      }
      
      setShowModal(false);
      setEditingEvent(null);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Please try again.');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      short_description: event.short_description || '',
      category_id: event.category_id || '',
      event_date: event.event_date || '',
      event_time: event.event_time || '',
      end_date: event.end_date || '',
      end_time: event.end_time || '',
      location: event.location || '',
      address: event.address || '',
      city: event.city || '',
      province: event.province || '',
      postal_code: event.postal_code || '',
      max_participants: event.max_participants || '',
      price: event.price || '',
      is_free: event.is_free || false,
      is_featured: event.is_featured || false,
      is_active: event.is_active !== undefined ? event.is_active : true,
      status: event.status || 'draft',
      registration_deadline: event.registration_deadline || ''
    });
    setShowModal(true);
  };

  const [deletingId, setDeletingId] = useState(null);
  const [quickActions, setQuickActions] = useState({
    selectedEvents: [],
    showBulkActions: false
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        setDeletingId(id);
        await eventsAPI.delete(id);
        // Add a small delay to show the animation
        setTimeout(() => {
          fetchEvents();
          setDeletingId(null);
        }, 300);
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event. Please try again.');
        setDeletingId(null);
      }
    }
  };

  const handleSelectEvent = (eventId) => {
    setQuickActions(prev => ({
      ...prev,
      selectedEvents: prev.selectedEvents.includes(eventId)
        ? prev.selectedEvents.filter(id => id !== eventId)
        : [...prev.selectedEvents, eventId],
      showBulkActions: true
    }));
  };

  const handleSelectAll = () => {
    const allEventIds = events.map(event => event.id);
    setQuickActions(prev => ({
      ...prev,
      selectedEvents: prev.selectedEvents.length === events.length ? [] : allEventIds,
      showBulkActions: prev.selectedEvents.length !== events.length
    }));
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${quickActions.selectedEvents.length} events?`)) {
      try {
        await Promise.all(quickActions.selectedEvents.map(id => eventsAPI.delete(id)));
        setQuickActions({ selectedEvents: [], showBulkActions: false });
        fetchEvents();
      } catch (error) {
        console.error('Error deleting events:', error);
        alert('Error deleting events. Please try again.');
      }
    }
  };

  const handleBulkStatusChange = async (status) => {
    try {
      await Promise.all(quickActions.selectedEvents.map(id => 
        eventsAPI.update(id, { status })
      ));
      setQuickActions({ selectedEvents: [], showBulkActions: false });
      fetchEvents();
    } catch (error) {
      console.error('Error updating events:', error);
      alert('Error updating events. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      short_description: '',
      category_id: '',
      event_date: '',
      event_time: '',
      end_date: '',
      end_time: '',
      location: '',
      address: '',
      city: '',
      province: '',
      postal_code: '',
      max_participants: '',
      price: '',
      is_free: false,
      is_featured: false,
      is_active: true,
      status: 'draft',
      registration_deadline: ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const formatPrice = (price, isFree) => {
    if (isFree || price === 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Events Management</h1>
          <p className="text-slate-400">Manage all events in your platform</p>
        </div>
        <div className="flex items-center space-x-4">
          {quickActions.showBulkActions && quickActions.selectedEvents.length > 0 && (
            <div className="flex items-center space-x-2 bg-slate-700 px-4 py-2 rounded-lg">
              <span className="text-white text-sm">{quickActions.selectedEvents.length} selected</span>
              <button
                onClick={() => handleBulkStatusChange('published')}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Publish
              </button>
              <button
                onClick={() => handleBulkStatusChange('draft')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Draft
              </button>
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          )}
          <button
            onClick={() => {
              setEditingEvent(null);
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Create New Event
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Search Events</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              placeholder="Search by title or location..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading events...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700 border-b border-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-medium">
                    <input
                      type="checkbox"
                      checked={quickActions.selectedEvents.length === events.length && events.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-500 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-white font-medium">Event</th>
                  <th className="px-6 py-4 text-left text-white font-medium">Category</th>
                  <th className="px-6 py-4 text-left text-white font-medium">Date</th>
                  <th className="px-6 py-4 text-left text-white font-medium">Location</th>
                  <th className="px-6 py-4 text-left text-white font-medium">Price</th>
                  <th className="px-6 py-4 text-left text-white font-medium">Status</th>
                  <th className="px-6 py-4 text-left text-white font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr 
                    key={event.id} 
                    className={`border-b border-slate-700 hover:bg-slate-700 transition-all duration-300 ${
                      deletingId === event.id ? 'opacity-50 scale-95 bg-red-900/20' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={quickActions.selectedEvents.includes(event.id)}
                        onChange={() => handleSelectEvent(event.id)}
                        className="rounded border-slate-500 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">{event.title}</div>
                        <div className="text-slate-400 text-sm">{event.short_description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-400 border border-blue-600/30">
                        {event.category_name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {formatDate(event.event_date)}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {event.location}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {formatPrice(event.price, event.is_free)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === 'published' ? 'bg-green-600/20 text-green-400 border border-green-600/30' :
                        event.status === 'draft' ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30' :
                        event.status === 'cancelled' ? 'bg-red-600/20 text-red-400 border border-red-600/30' :
                        'bg-purple-600/20 text-purple-400 border border-purple-600/30'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                          title="Edit Event"
                          disabled={deletingId === event.id}
                        >
                          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 bg-slate-700 rounded-lg hover:bg-red-600 transition-colors"
                          title="Delete Event"
                          disabled={deletingId === event.id}
                        >
                          {deletingId === event.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                          ) : (
                            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-void-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="cosmic-glass rounded-2xl border border-starlight/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-zoom-in">
            <div className="p-6 border-b border-starlight/10">
              <h3 className="text-2xl font-bold text-starlight animate-cosmic-twinkle">
                {editingEvent ? '✏️ Edit Event' : '✨ Create New Event'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-starlight text-sm font-medium mb-2">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight placeholder-moon-silver focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all"
                    placeholder="Enter event title"
                  />
                </div>
                
                <div>
                  <label className="block text-starlight text-sm font-medium mb-2">Category *</label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    className="w-full px-4 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-starlight text-sm font-medium mb-2">Short Description</label>
                <input
                  type="text"
                  value={formData.short_description}
                  onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                  className="w-full px-4 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight placeholder-moon-silver focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all"
                  placeholder="Brief description for event cards"
                />
              </div>

              <div>
                <label className="block text-starlight text-sm font-medium mb-2">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight placeholder-moon-silver focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all"
                  placeholder="Detailed event description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-starlight text-sm font-medium mb-2">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.event_date}
                    onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                    className="w-full px-4 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-starlight text-sm font-medium mb-2">Event Time *</label>
                  <input
                    type="time"
                    required
                    value={formData.event_time}
                    onChange={(e) => setFormData({...formData, event_time: e.target.value})}
                    className="w-full px-4 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-starlight text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    className="w-full px-4 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-starlight text-sm font-medium mb-2">End Time</label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                    className="w-full px-4 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-starlight text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight placeholder-moon-silver focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all"
                    placeholder="Event venue"
                  />
                </div>
                
                <div>
                  <label className="block text-starlight text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight placeholder-moon-silver focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all"
                    placeholder="City"
                  />
                </div>
              </div>

              <div>
                <label className="block text-starlight text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight placeholder-moon-silver focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all"
                  placeholder="Full address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-starlight text-sm font-medium mb-2">Max Participants</label>
                  <input
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => setFormData({...formData, max_participants: e.target.value})}
                    className="w-full px-4 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight placeholder-moon-silver focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all"
                    placeholder="0 for unlimited"
                  />
                </div>
                
                <div>
                  <label className="block text-starlight text-sm font-medium mb-2">Price (IDR)</label>
                  <input
                    type="number"
                    disabled={formData.is_free}
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight placeholder-moon-silver focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all disabled:opacity-50"
                    placeholder="0 for free"
                  />
                </div>
                
                <div>
                  <label className="block text-starlight text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 cosmic-glass border border-starlight/20 rounded-xl text-starlight focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_free"
                  checked={formData.is_free}
                  onChange={(e) => setFormData({...formData, is_free: e.target.checked, price: e.target.checked ? '0' : formData.price})}
                  className="w-4 h-4 text-comet-cyan bg-cosmic-glass border-starlight/20 rounded focus:ring-comet-cyan focus:ring-2"
                />
                <label htmlFor="is_free" className="ml-2 text-starlight text-sm font-medium">
                  This is a free event
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-starlight/10">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingEvent(null);
                    resetForm();
                  }}
                  className="px-6 py-3 cosmic-glass border border-starlight/20 text-starlight rounded-xl hover:bg-cosmic-navy/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-comet-cyan to-plasma-purple hover:from-comet-cyan/80 hover:to-plasma-purple/80 text-starlight font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-comet-cyan/30 animate-glow"
                >
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManagement;
