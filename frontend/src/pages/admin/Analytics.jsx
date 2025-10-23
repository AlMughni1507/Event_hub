import React, { useState, useEffect } from 'react';
import { eventsAPI, usersAPI, registrationsAPI, categoriesAPI } from '../../services/api';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalRegistrations: 0,
    totalCategories: 0,
    eventsByCategory: [],
    registrationsByMonth: [],
    topEvents: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      const [eventsRes, usersRes, registrationsRes, categoriesRes] = await Promise.all([
        eventsAPI.getAll(),
        usersAPI.getAll(),
        registrationsAPI.getAll(),
        categoriesAPI.getAll()
      ]);

      const events = eventsRes.data.events || [];
      const users = usersRes.data.users || [];
      const registrations = registrationsRes.data.registrations || [];
      const categories = categoriesRes.data.categories || [];

      // Calculate analytics
      const eventsByCategory = categories.map(category => ({
        name: category.name,
        count: events.filter(event => event.category_id === category.id).length,
        color: category.color || '#007bff'
      }));

      const topEvents = events
        .map(event => ({
          ...event,
          registrationCount: registrations.filter(reg => reg.event_id === event.id).length
        }))
        .sort((a, b) => b.registrationCount - a.registrationCount)
        .slice(0, 5);

      setAnalytics({
        totalEvents: events.length,
        totalUsers: users.length,
        totalRegistrations: registrations.length,
        totalCategories: categories.length,
        eventsByCategory,
        topEvents,
        recentActivity: registrations.slice(0, 10)
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, change }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${color.replace('text-', 'text-').replace('-400', '-600')}`}>{value}</p>
          {change && (
            <p className="text-green-600 text-sm mt-1">
              ↗️ +{change}% this month
            </p>
          )}
        </div>
        <div className="text-4xl">
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black text-xl">Analyzing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">📈 Analytics & Reports</h1>
          <p className="text-gray-600">Insights into your event data</p>
        </div>
        <div className="mt-4 md:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-black focus:border-black transition-colors"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Events"
          value={analytics.totalEvents}
          icon="🎪"
          color="text-blue-400"
          change={12}
        />
        <StatCard
          title="Active Users"
          value={analytics.totalUsers}
          icon="👥"
          color="text-green-400"
          change={8}
        />
        <StatCard
          title="Registrations"
          value={analytics.totalRegistrations}
          icon="📝"
          color="text-purple-400"
          change={25}
        />
        <StatCard
          title="Categories"
          value={analytics.totalCategories}
          icon="📂"
          color="text-pink-400"
          change={5}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events by Category */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-black mb-6">🎯 Events by Category</h3>
          <div className="space-y-4">
            {analytics.eventsByCategory.map((category, index) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-black font-medium">{category.name}</span>
                  <span className="text-gray-600">{category.count} events</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${analytics.totalEvents > 0 ? (category.count / analytics.totalEvents) * 100 : 0}%`,
                      backgroundColor: category.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Events */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-black mb-6">🏆 Top Events</h3>
          <div className="space-y-4">
            {analytics.topEvents.map((event, index) => (
              <div key={event.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-black font-medium">{event.title}</h4>
                  <p className="text-gray-600 text-sm">{event.registrationCount} registrations</p>
                </div>
                <div className="text-green-600 font-bold">
                  {event.registrationCount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-black mb-6">⚡ Recent Activity</h3>
        <div className="space-y-4">
          {analytics.recentActivity.map((activity, index) => (
            <div key={activity.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                📝
              </div>
              <div className="flex-1">
                <p className="text-black">
                  <span className="font-medium">{activity.user_name || activity.full_name}</span> registered for{' '}
                  <span className="font-medium text-blue-600">{activity.event_title}</span>
                </p>
                <p className="text-gray-600 text-sm">
                  {new Date(activity.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                activity.status === 'approved' ? 'bg-green-100 text-green-700' :
                activity.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {activity.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-3">📊</div>
            <h3 className="text-lg font-bold text-black">Conversion Rate</h3>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {analytics.totalEvents > 0 ? Math.round((analytics.totalRegistrations / analytics.totalEvents) * 100) / 100 : 0}%
          </div>
          <p className="text-gray-600 text-sm">Average registrations per event</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-3">🎯</div>
            <h3 className="text-lg font-bold text-black">Engagement</h3>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {analytics.totalUsers > 0 ? Math.round((analytics.totalRegistrations / analytics.totalUsers) * 100) / 100 : 0}
          </div>
          <p className="text-gray-600 text-sm">Registrations per user</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-3">🚀</div>
            <h3 className="text-lg font-bold text-black">Growth</h3>
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">+24%</div>
          <p className="text-gray-600 text-sm">Month over month growth</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
