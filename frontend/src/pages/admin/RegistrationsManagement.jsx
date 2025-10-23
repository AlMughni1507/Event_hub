import React, { useState, useEffect } from 'react';
import { registrationsAPI, eventsAPI, certificatesAPI } from '../../services/api';

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

  const handleExportParticipants = async (eventId, format = 'xlsx') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/export/participants/${eventId}?format=${format}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `peserta_event_${eventId}_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting participants:', error);
      alert('Gagal mengekspor data peserta');
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

  const handleGenerateCertificate = async (registration) => {
    try {
      await certificatesAPI.generate(registration.event_id, registration.id);
      alert(`Certificate generated for ${registration.full_name || registration.user_name}`);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to generate certificate. Please try again.');
    }
  };

  const handleBulkGenerateCertificates = async () => {
    const approvedRegistrations = registrations.filter(r => r.status === 'approved');
    if (approvedRegistrations.length === 0) {
      alert('No approved registrations found to generate certificates.');
      return;
    }

    if (window.confirm(`Generate certificates for ${approvedRegistrations.length} approved participants?`)) {
      try {
        // Group by event_id for bulk generation
        const eventGroups = approvedRegistrations.reduce((groups, reg) => {
          if (!groups[reg.event_id]) groups[reg.event_id] = [];
          groups[reg.event_id].push(reg);
          return groups;
        }, {});

        for (const eventId of Object.keys(eventGroups)) {
          await certificatesAPI.generateBulk(eventId);
        }
        
        alert(`Successfully generated certificates for ${approvedRegistrations.length} participants!`);
      } catch (error) {
        console.error('Error generating bulk certificates:', error);
        alert('Failed to generate certificates. Please try again.');
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
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-700 border border-orange-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border border-red-200';
      case 'cancelled':
        return 'bg-purple-100 text-purple-700 border border-purple-200';
      default:
        return 'bg-blue-100 text-blue-700 border border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">📝 Registrations Management</h1>
          <p className="text-gray-600">Monitor and manage event registrations</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <button
            onClick={handleBulkGenerateCertificates}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>🏆</span>
            <span>Generate All Certificates</span>
          </button>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-blue-600 text-sm">Total Registrations</div>
            <div className="text-black font-bold text-xl">{registrations.length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-black text-sm font-medium mb-2">🔍 Search Registrations</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              placeholder="Search by user name or email..."
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-black placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black transition-colors"
            />
          </div>
          <div>
            <label className="block text-black text-sm font-medium mb-2">🎪 Event</label>
            <select
              value={filters.event_id}
              onChange={(e) => setFilters({...filters, event_id: e.target.value})}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-black focus:border-black transition-colors"
            >
              <option value="">All Events</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-black text-sm font-medium mb-2">📊 Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-black focus:border-black transition-colors"
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

      {/* Export Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Export Data</h3>
            <p className="text-gray-600 text-sm">Export data peserta berdasarkan event yang dipilih</p>
          </div>
          <div className="flex gap-2">
            <select
              value={filters.event_id}
              onChange={(e) => setFilters({...filters, event_id: e.target.value})}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Pilih Event</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
            {filters.event_id && (
              <>
                <button
                  onClick={() => handleExportParticipants(filters.event_id, 'xlsx')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  📊 Excel
                </button>
                <button
                  onClick={() => handleExportParticipants(filters.event_id, 'csv')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  📋 CSV
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-black text-xl">Loading registrations...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-black font-medium">Participant</th>
                  <th className="px-6 py-4 text-left text-black font-medium">Event</th>
                  <th className="px-6 py-4 text-left text-black font-medium">Registration Date</th>
                  <th className="px-6 py-4 text-left text-black font-medium">Status</th>
                  <th className="px-6 py-4 text-left text-black font-medium">Payment</th>
                  <th className="px-6 py-4 text-left text-black font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((registration, index) => (
                  <tr key={registration.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold">
                            {registration.user_name?.charAt(0) || registration.full_name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="text-black font-medium">{registration.user_name || registration.full_name}</div>
                          <div className="text-gray-600 text-sm">{registration.email}</div>
                          <div className="text-gray-600 text-sm">{registration.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-black font-medium">{registration.event_title}</div>
                        <div className="text-gray-600 text-sm">{new Date(registration.event_date).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(registration.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                        {registration.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-black text-sm">
                          {registration.registration_fee === 0 ? 'Free' : 
                           new Intl.NumberFormat('id-ID', {
                             style: 'currency',
                             currency: 'IDR',
                             minimumFractionDigits: 0
                           }).format(registration.registration_fee)}
                        </div>
                        <div className={`text-xs ${
                          registration.payment_status === 'paid' ? 'text-green-600' :
                          registration.payment_status === 'pending' ? 'text-orange-600' :
                          'text-red-600'
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
                              className="p-2 bg-gray-100 rounded-lg hover:bg-green-100 transition-colors"
                              title="Approve Registration"
                            >
                              ✅
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(registration.id, 'rejected')}
                              className="p-2 bg-gray-100 rounded-lg hover:bg-red-100 transition-colors"
                              title="Reject Registration"
                            >
                              ❌
                            </button>
                          </>
                        )}
                        {registration.status === 'approved' && (
                          <button
                            onClick={() => handleGenerateCertificate(registration)}
                            className="p-2 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Generate Certificate"
                          >
                            🏆
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(registration.id)}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-red-100 transition-colors"
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
          <h3 className="text-xl font-semibold text-black mb-2">No registrations found</h3>
          <p className="text-gray-600">
            {filters.search || filters.event_id || filters.status ? 
             'Try adjusting your search filters' : 
             'No event registrations yet'}
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="text-2xl mr-3">⏳</div>
            <div>
              <div className="text-orange-600 text-sm font-medium">Pending</div>
              <div className="text-black font-bold">
                {registrations.filter(r => r.status === 'pending').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="text-2xl mr-3">✅</div>
            <div>
              <div className="text-green-600 text-sm font-medium">Approved</div>
              <div className="text-black font-bold">
                {registrations.filter(r => r.status === 'approved').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="text-2xl mr-3">❌</div>
            <div>
              <div className="text-red-600 text-sm font-medium">Rejected</div>
              <div className="text-black font-bold">
                {registrations.filter(r => r.status === 'rejected').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🚫</div>
            <div>
              <div className="text-purple-600 text-sm font-medium">Cancelled</div>
              <div className="text-black font-bold">
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
