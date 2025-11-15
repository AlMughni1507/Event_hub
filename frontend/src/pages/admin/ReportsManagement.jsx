import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Users, TrendingUp, BarChart3, PieChart, Filter, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const ReportsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [events, setEvents] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchEvents();
    // Don't auto-fetch report on mount, wait for user to click Generate
    // fetchReportData();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/admin/events');
      if (response.data.success) {
        setEvents(response.data.data.events || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching report data...');
      const params = {
        start_date: dateRange.start_date,
        end_date: dateRange.end_date
      };
      
      if (selectedEvent !== 'all') {
        params.event_id = selectedEvent;
      }

      console.log('📦 Request params:', params);
      const response = await api.get('/admin/reports/summary', { params });
      console.log('✅ Response:', response.data);
      
      if (response.data.success) {
        setReportData(response.data.data);
        toast.success('Data laporan berhasil dimuat');
      } else {
        toast.error('Format response tidak sesuai');
      }
    } catch (error) {
      console.error('❌ Error fetching report data:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      const errorMsg = error.response?.data?.message || 
                       error.response?.statusText || 
                       'Gagal memuat data laporan. Pastikan server sudah direstart.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    fetchReportData();
    toast.success('Laporan berhasil diperbarui');
  };

  const handleExportPDF = async () => {
    try {
      toast.info('Mengunduh laporan PDF...');
      const params = {
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        event_id: selectedEvent !== 'all' ? selectedEvent : undefined,
        format: 'pdf'
      };

      const response = await api.get('/admin/reports/export', { 
        params,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `laporan-event-${dateRange.start_date}-${dateRange.end_date}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Laporan PDF berhasil diunduh');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Gagal mengunduh laporan PDF');
    }
  };

  const handleExportExcel = async () => {
    try {
      toast.info('Mengunduh laporan Excel...');
      const params = {
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        event_id: selectedEvent !== 'all' ? selectedEvent : undefined,
        format: 'excel'
      };

      const response = await api.get('/admin/reports/export', { 
        params,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `laporan-event-${dateRange.start_date}-${dateRange.end_date}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Laporan Excel berhasil diunduh');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Gagal mengunduh laporan Excel');
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-500', '-100')}`}>
          <Icon className={`w-8 h-8 ${color.replace('border-', 'text-')}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-purple-600" />
            Laporan & Rekap Otomatis
          </h1>
          <p className="text-gray-600 mt-2">
            Sistem rekap data peserta dan statistik kegiatan secara otomatis
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-gray-900">Filter Laporan</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={dateRange.start_date}
              onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Akhir
            </label>
            <input
              type="date"
              value={dateRange.end_date}
              onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event
            </label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Semua Event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Memuat...' : 'Generate Laporan'}
            </button>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            <Download className="w-5 h-5" />
            Export PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {reportData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Event"
              value={reportData.total_events || 0}
              icon={Calendar}
              color="border-blue-500"
              subtitle={`${reportData.active_events || 0} event aktif`}
            />
            <StatCard
              title="Total Peserta"
              value={reportData.total_participants || 0}
              icon={Users}
              color="border-green-500"
              subtitle={`${reportData.approved_participants || 0} terdaftar`}
            />
            <StatCard
              title="Tingkat Kehadiran"
              value={`${reportData.attendance_rate || 0}%`}
              icon={TrendingUp}
              color="border-purple-500"
              subtitle={`${reportData.total_attended || 0} hadir`}
            />
            <StatCard
              title="Total Pendapatan"
              value={`Rp ${(reportData.total_revenue || 0).toLocaleString('id-ID')}`}
              icon={BarChart3}
              color="border-yellow-500"
              subtitle="Dari event berbayar"
            />
          </div>

          {/* Detailed Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Performance */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900">Performa Event</h2>
              </div>
              
              {reportData.event_performance && reportData.event_performance.length > 0 ? (
                <div className="space-y-3">
                  {reportData.event_performance.map((event, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'completed' ? 'bg-green-100 text-green-800' :
                          event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600">Peserta</p>
                          <p className="font-semibold">{event.participants || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Hadir</p>
                          <p className="font-semibold">{event.attended || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tingkat</p>
                          <p className="font-semibold">{event.attendance_rate || 0}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Tidak ada data performa event</p>
              )}
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900">Distribusi Kategori</h2>
              </div>
              
              {reportData.category_distribution && reportData.category_distribution.length > 0 ? (
                <div className="space-y-3">
                  {reportData.category_distribution.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{category.name}</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {category.count} event ({category.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Tidak ada data distribusi kategori</p>
              )}
            </div>
          </div>

          {/* Participant Details Table */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">Detail Peserta</h2>
            </div>
            
            {reportData.participant_details && reportData.participant_details.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kontak
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal Daftar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.participant_details.map((participant, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {participant.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {participant.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {participant.phone || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {participant.event_title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            participant.status === 'approved' ? 'bg-green-100 text-green-800' :
                            participant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {participant.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(participant.registration_date).toLocaleDateString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Tidak ada data peserta</p>
            )}
          </div>
        </>
      )}

      {/* Loading State */}
      {loading && !reportData && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data laporan...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !reportData && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Laporan</h3>
          <p className="text-gray-600 mb-6">
            Pilih rentang tanggal dan klik "Generate Laporan" untuk melihat data
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportsManagement;
