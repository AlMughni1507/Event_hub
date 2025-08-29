import React, { useState, useEffect } from 'react';
import { registrationsAPI, eventsAPI } from '../../services/api';

const RegistrationsManagement = () => {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    event_id: '',
    status: ''
  });

  useEffect(() => {
    fetchRegistrations();
    fetchEvents();
  }, [filters]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.event_id) params.event_id = filters.event_id;
      if (filters.status) params.status = filters.status;
      
      const response = await registrationsAPI.getAll(params);
      setRegistrations(response.data.registrations || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleStatusUpdate = async (registrationId, newStatus) => {
    try {
      await registrationsAPI.update(registrationId, { status: newStatus });
      fetchRegistrations();
    } catch (error) {
      console.error('Error updating registration status:', error);
      alert('Error updating registration status. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        await registrationsAPI.delete(id);
        fetchRegistrations();
      } catch (error) {
        console.error('Error deleting registration:', error);
        alert('Error deleting registration. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-600/20 text-green-400 border border-green-600/30';
      case 'pending':
        return 'bg-orange-600/20 text-orange-400 border border-orange-600/30';
      case 'rejected':
        return 'bg-red-600/20 text-red-400 border border-red-600/30';
      case 'cancelled':
        return 'bg-purple-600/20 text-purple-400 border border-purple-600/30';
      default:
        return 'bg-blue-600/20 text-blue-400 border border-blue-600/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">📝 Registrations Management</h1>
          <p className="text-slate-400">Monitor and manage event registrations</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
            <div className="text-blue-400 text-sm">Total Registrations</div>
            <div className="text-white font-bold text-xl">{registrations.length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">🔍 Search Registrations</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              placeholder="Search by user name or email..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">🎪 Event</label>
            <select
              value={filters.event_id}
              onChange={(e) => setFilters({...filters, event_id: e.target.value})}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Events</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">📊 Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-xl">Loading registrations...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700 border-b border-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-medium">Participant</th>
                  <th className="px-6 py-4 text-left text-white font-medium">Event</th>
                  <th className="px-6 py-4 text-left text-white font-medium">Registration Date</th>
                  <th className="px-6 py-4 text-left text-white font-medium">Status</th>
                  <th className="px-6 py-4 text-left text-white font-medium">Payment</th>
                  <th className="px-6 py-4 text-left text-white font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((registration, index) => (
                  <tr key={registration.id} className="border-b border-slate-700 hover:bg-blue-600/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold">
                            {registration.user_name?.charAt(0) || registration.full_name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium">{registration.user_name || registration.full_name}</div>
                          <div className="text-slate-400 text-sm">{registration.email}</div>
                          <div className="text-slate-400 text-sm">{registration.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">{registration.event_title}</div>
                        <div className="text-slate-400 text-sm">{new Date(registration.event_date).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {formatDate(registration.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                        {registration.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white text-sm">
                          {registration.registration_fee === 0 ? 'Free' : 
                           new Intl.NumberFormat('id-ID', {
                             style: 'currency',
                             currency: 'IDR',
                             minimumFractionDigits: 0
                           }).format(registration.registration_fee)}
                        </div>
                        <div className={`text-xs ${
                          registration.payment_status === 'paid' ? 'text-green-400' :
                          registration.payment_status === 'pending' ? 'text-orange-400' :
                          'text-red-400'
                        }`}>
                          {registration.payment_status || 'unpaid'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {registration.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(registration.id, 'approved')}
                              className="p-2 bg-slate-700 rounded-lg hover:bg-green-600/20 transition-colors"
                              title="Approve Registration"
                            >
                              ✅
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(registration.id, 'rejected')}
                              className="p-2 bg-slate-700 rounded-lg hover:bg-red-600/20 transition-colors"
                              title="Reject Registration"
                            >
                              ❌
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(registration.id)}
                          className="p-2 bg-slate-700 rounded-lg hover:bg-red-600/20 transition-colors"
                          title="Delete Registration"
                        >
                          🗑️
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

      {registrations.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-white mb-2">No registrations found</h3>
          <p className="text-slate-400">
            {filters.search || filters.event_id || filters.status ? 
             'Try adjusting your search filters' : 
             'No event registrations yet'}
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center">
            <div className="text-2xl mr-3">⏳</div>
            <div>
              <div className="text-orange-400 text-sm font-medium">Pending</div>
              <div className="text-white font-bold">
                {registrations.filter(r => r.status === 'pending').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center">
            <div className="text-2xl mr-3">✅</div>
            <div>
              <div className="text-green-400 text-sm font-medium">Approved</div>
              <div className="text-white font-bold">
                {registrations.filter(r => r.status === 'approved').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center">
            <div className="text-2xl mr-3">❌</div>
            <div>
              <div className="text-red-400 text-sm font-medium">Rejected</div>
              <div className="text-white font-bold">
                {registrations.filter(r => r.status === 'rejected').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🚫</div>
            <div>
              <div className="text-purple-400 text-sm font-medium">Cancelled</div>
              <div className="text-white font-bold">
                {registrations.filter(r => r.status === 'cancelled').length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationsManagement;
