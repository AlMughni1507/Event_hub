import React, { useState, useEffect } from 'react';
import { eventsAPI, usersAPI, registrationsAPI, categoriesAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalRegistrations: 0,
    totalCategories: 0,
    recentEvents: [],
    recentRegistrations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [eventsRes, usersRes, registrationsRes, categoriesRes] = await Promise.all([
        eventsAPI.getAll({ limit: 5 }),
        usersAPI.getAll({ limit: 5 }),
        registrationsAPI.getAll({ limit: 5 }),
        categoriesAPI.getAll()
      ]);

      setStats({
        totalEvents: eventsRes.data.total || eventsRes.data.events?.length || 0,
        totalUsers: usersRes.data.total || usersRes.data.users?.length || 0,
        totalRegistrations: registrationsRes.data.total || registrationsRes.data.registrations?.length || 0,
        totalCategories: categoriesRes.data.categories?.length || 0,
        recentEvents: eventsRes.data.events || [],
        recentRegistrations: registrationsRes.data.registrations || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <p className="text-green-400 text-sm mt-1">
              ↗️ +{trend}% from last month
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Mission Control
          </h1>
          <p className="text-slate-400 text-lg">
            Your dashboard for managing the EventHub platform. All systems operational.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon="🎪"
          trend={12}
        />
        <StatCard
          title="Active Users"
          value={stats.totalUsers}
          icon="👥"
          trend={8}
        />
        <StatCard
          title="Registrations"
          value={stats.totalRegistrations}
          icon="📝"
          trend={15}
        />
        <StatCard
          title="Categories"
          value={stats.totalCategories}
          icon="📂"
          trend={5}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Recent Events</h3>
            <button className="text-blue-400 hover:text-blue-300 transition-colors">
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {stats.recentEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center mr-4">
                  🎪
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{event.title}</h4>
                  <p className="text-slate-400 text-sm">{new Date(event.event_date).toLocaleDateString()}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  event.status === 'published' ? 'bg-green-600/20 text-green-400' :
                  event.status === 'draft' ? 'bg-yellow-600/20 text-yellow-400' :
                  'bg-red-600/20 text-red-400'
                }`}>
                  {event.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors border border-slate-600">
              <div className="text-3xl mb-2">🎪</div>
              <div className="text-white font-medium">Create Event</div>
            </button>
            <button className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors border border-slate-600">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-white font-medium">Add User</div>
            </button>
            <button className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors border border-slate-600">
              <div className="text-3xl mb-2">📂</div>
              <div className="text-white font-medium">New Category</div>
            </button>
            <button className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors border border-slate-600">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-white font-medium">View Reports</div>
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-6">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <div>
              <div className="text-white font-medium">Database</div>
              <div className="text-green-400 text-sm">Operational</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <div>
              <div className="text-white font-medium">API Services</div>
              <div className="text-green-400 text-sm">All Systems Go</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <div>
              <div className="text-white font-medium">Email Service</div>
              <div className="text-green-400 text-sm">Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
