import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, ClipboardList, FolderKanban, Activity, Calendar, Target, Rocket, BarChart3, Zap, Trophy } from 'lucide-react';
import { adminAPI, categoriesAPI, analyticsAPI } from '../../services/api';

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
      
      // Use adminAPI for consistent data with Dashboard
      const [eventsRes, usersRes, registrationsRes, categoriesRes, topEventsRes] = await Promise.all([
        adminAPI.getAllEvents({ limit: 1000 }),
        adminAPI.getAllUsers({ limit: 10000 }),
        adminAPI.getAllRegistrations({ limit: 10000 }),
        categoriesAPI.getAll(),
        analyticsAPI.getTopEvents()
      ]);

      const eventsData = eventsRes?.data || eventsRes || {};
      const usersData = usersRes?.data || usersRes || {};
      const registrationsData = registrationsRes?.data || registrationsRes || {};
      const categoriesData = categoriesRes?.data || categoriesRes || {};
      const topEventsData = topEventsRes?.data || topEventsRes || {};

      const events = eventsData.events || [];
      const users = usersData.users || [];
      const registrations = registrationsData.registrations || [];
      const categories = categoriesData.categories || [];
      const topEvents = topEventsData.topEvents || [];

      // Calculate analytics
      const eventsByCategory = categories.map(category => ({
        name: category.name,
        count: events.filter(event => event.category_id === category.id).length,
        color: category.color || '#007bff'
      }));

      // Use topEvents from API, or calculate from registrations if not available
      const topEventsList = topEvents.length > 0 
        ? topEvents.slice(0, 5).map(event => ({
            ...event,
            registrationCount: event.participant_count || 0
          }))
        : events
            .map(event => ({
              ...event,
              registrationCount: registrations.filter(reg => reg.event_id === event.id).length
            }))
            .sort((a, b) => b.registrationCount - a.registrationCount)
            .slice(0, 5);

      // Use pagination totals for accurate counts
      const totalEvents = eventsData.pagination?.total || events.length;
      const totalUsers = usersData.pagination?.total || users.length;
      const totalRegistrations = registrationsData.pagination?.total || registrations.length;

      setAnalytics({
        totalEvents,
        totalUsers,
        totalRegistrations,
        totalCategories: categories.length,
        eventsByCategory,
        topEvents: topEventsList,
        recentActivity: registrations.slice(0, 10)
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, change }) => (
    <div className="bg-white p-5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {change && (
            <p className="text-green-600 text-xs mt-1.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{change}% this month
            </p>
          )}
        </div>
        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
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
          <h1 className="text-3xl font-bold text-black mb-2 flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            Analytics & Reports
          </h1>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Events"
          value={analytics.totalEvents}
          icon={<Calendar className="w-6 h-6 text-blue-600" />}
          color="text-blue-600"
          change={12}
        />
        <StatCard
          title="Active Users"
          value={analytics.totalUsers}
          icon={<Users className="w-6 h-6 text-green-600" />}
          color="text-green-600"
          change={8}
        />
        <StatCard
          title="Registrations"
          value={analytics.totalRegistrations}
          icon={<ClipboardList className="w-6 h-6 text-purple-600" />}
          color="text-purple-600"
          change={25}
        />
        <StatCard
          title="Categories"
          value={analytics.totalCategories}
          icon={<FolderKanban className="w-6 h-6 text-pink-600" />}
          color="text-pink-600"
          change={5}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Events by Category */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-black mb-5 flex items-center gap-2">
            <Target className="w-5 h-5 text-pink-600" />
            Events by Category
          </h3>
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
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-black mb-5 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            Top Events
          </h3>
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
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-black mb-5 flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-600" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          {analytics.recentActivity.map((activity, index) => (
            <div key={activity.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-black">
                  <span className="font-medium">{activity.full_name || activity.user_name || 'User'}</span> registered for{' '}
                  <span className="font-medium text-blue-600">{activity.event_title || 'Event'}</span>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-base font-bold text-black">Conversion Rate</h3>
          </div>
          <div className="text-2xl font-bold text-green-600 mb-1">
            {analytics.totalEvents > 0 ? Math.round((analytics.totalRegistrations / analytics.totalEvents) * 100) / 100 : 0}%
          </div>
          <p className="text-gray-600 text-xs">Average registrations per event</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-base font-bold text-black">Engagement</h3>
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {analytics.totalUsers > 0 ? Math.round((analytics.totalRegistrations / analytics.totalUsers) * 100) / 100 : 0}
          </div>
          <p className="text-gray-600 text-xs">Registrations per user</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-base font-bold text-black">Growth</h3>
          </div>
          <div className="text-2xl font-bold text-purple-600 mb-1">+24%</div>
          <p className="text-gray-600 text-xs">Month over month growth</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
