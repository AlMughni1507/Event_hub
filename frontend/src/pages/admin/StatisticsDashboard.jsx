import React, { useState, useEffect } from 'react';
import { Calendar, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { analyticsAPI } from '../../services/api';
import BarChart from '../../components/charts/BarChart';

const StatisticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [statistics, setStatistics] = useState({
    monthlyEvents: [],
    monthlyParticipants: [],
    topEvents: []
  });

  useEffect(() => {
    fetchStatistics();
  }, [selectedYear]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      const [monthlyEventsRes, monthlyParticipantsRes, topEventsRes] = await Promise.all([
        analyticsAPI.getMonthlyEvents({ year: selectedYear }),
        analyticsAPI.getMonthlyParticipants({ year: selectedYear }),
        analyticsAPI.getTopEvents()
      ]);

      setStatistics({
        monthlyEvents: monthlyEventsRes.data.monthlyEvents || [],
        monthlyParticipants: monthlyParticipantsRes.data.monthlyParticipants || [],
        topEvents: topEventsRes.data.topEvents || []
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const monthlyEventsData = statistics.monthlyEvents.map(item => ({
    label: item.month_name.substring(0, 3), // Short month names
    value: item.total_events
  }));

  const monthlyParticipantsData = statistics.monthlyParticipants.map(item => ({
    label: item.month_name.substring(0, 3),
    value: item.total_participants
  }));

  const topEventsData = statistics.topEvents.map(item => ({
    label: item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title,
    value: item.participant_count,
    fullTitle: item.title,
    category: item.category_name,
    date: new Date(item.event_date).toLocaleDateString('id-ID')
  }));

  // Calculate summary statistics
  const totalEvents = statistics.monthlyEvents.reduce((sum, item) => sum + item.total_events, 0);
  const totalParticipants = statistics.monthlyParticipants.reduce((sum, item) => sum + item.total_participants, 0);
  const avgParticipantsPerEvent = totalEvents > 0 ? Math.round(totalParticipants / totalEvents) : 0;

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${color.replace('text-', 'text-').replace('-400', '-600')}`}>{value}</p>
          {subtitle && (
            <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
          )}
        </div>
        <div className="text-4xl opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black text-xl">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">📊 Statistics Dashboard</h1>
          <p className="text-gray-600">Comprehensive event and participant analytics</p>
        </div>
        <div className="mt-4 md:mt-0">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-black focus:border-black transition-colors"
          >
            {[2024, 2023, 2022, 2021, 2020].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title={`Total Events ${selectedYear}`}
          value={totalEvents}
          icon="🎪"
          color="text-blue-400"
          subtitle="Published events"
        />
        <StatCard
          title={`Total Participants ${selectedYear}`}
          value={totalParticipants}
          icon={<Users className="w-8 h-8 text-green-400" />}
          color="text-green-400"
          subtitle="Attended events"
        />
        <StatCard
          title="Average Participants"
          value={avgParticipantsPerEvent}
          icon="📈"
          color="text-purple-400"
          subtitle="Per event"
        />
      </div>

      {/* Monthly Events Chart */}
      <BarChart
        data={monthlyEventsData}
        title={`Monthly Events Distribution (${selectedYear})`}
        xAxisLabel="Months"
        yAxisLabel="Number of Events"
        color="#06b6d4"
        height={350}
      />

      {/* Monthly Participants Chart */}
      <BarChart
        data={monthlyParticipantsData}
        title={`Monthly Participants (${selectedYear})`}
        xAxisLabel="Months"
        yAxisLabel="Number of Participants"
        color="#10b981"
        height={350}
      />

      {/* Top 10 Events Chart */}
      <BarChart
        data={topEventsData}
        title="Top 10 Events by Participant Count"
        xAxisLabel="Events"
        yAxisLabel="Number of Participants"
        color="#8b5cf6"
        height={400}
      />

      {/* Top Events Details Table */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-black mb-6 flex items-center">
          🏆 Top Events Details
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-medium">Rank</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">Event Title</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">Category</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">Participants</th>
              </tr>
            </thead>
            <tbody>
              {topEventsData.map((event, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-black font-medium">{event.fullTitle}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {event.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{event.date}</td>
                  <td className="py-3 px-4">
                    <span className="text-green-600 font-bold text-lg">{event.value}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-black mb-4 flex items-center">
            💡 Key Insights
          </h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
              <span className="text-gray-700">
                Peak month: {monthlyEventsData.reduce((max, item) => item.value > max.value ? item : max, {value: 0, label: 'None'}).label}
              </span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
              <span className="text-gray-700">
                Most attended: {topEventsData[0]?.fullTitle || 'No events'}
              </span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
              <span className="text-gray-700">
                Average attendance rate: {avgParticipantsPerEvent} participants/event
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-black mb-4 flex items-center">
            📈 Performance Metrics
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Event Success Rate</span>
                <span className="text-green-600 font-bold">
                  {totalEvents > 0 ? Math.round((statistics.topEvents.filter(e => e.participant_count > 0).length / Math.min(totalEvents, 10)) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all duration-500"
                  style={{ width: `${totalEvents > 0 ? Math.round((statistics.topEvents.filter(e => e.participant_count > 0).length / Math.min(totalEvents, 10)) * 100) : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Participation Growth</span>
                <span className="text-blue-600 font-bold">+15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full w-3/4 transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;
