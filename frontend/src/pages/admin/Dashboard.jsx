import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Ticket, BarChart3, Plus, FolderPlus, FileText } from 'lucide-react';
import { adminAPI, categoriesAPI } from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
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
      
      // Fetch data with high limit to get accurate total counts from pagination
      const [eventsRes, usersRes, registrationsRes, categoriesRes] = await Promise.all([
        adminAPI.getAllEvents({ limit: 1000 }),
        adminAPI.getAllUsers({ limit: 10000 }),
        adminAPI.getAllRegistrations({ limit: 10000 }),
        categoriesAPI.getAll()
      ]);

      // Extract data with proper null checks
      // API response structure: { success, message, data: { events: [], pagination: { total: ... } } }
      const eventsData = eventsRes.data || eventsRes;
      const usersData = usersRes.data || usersRes;
      const registrationsData = registrationsRes.data || registrationsRes;
      const categoriesData = categoriesRes.data || categoriesRes;
      
      const allEvents = eventsData.events || [];
      const allUsers = usersData.users || [];
      const allRegistrations = registrationsData.registrations || [];
      const allCategories = categoriesData.categories || [];
      
      // Use pagination totals for accurate counts (fallback to array length)
      const totalEvents = eventsData.pagination?.total || allEvents.length;
      const totalUsers = usersData.pagination?.total || allUsers.length;
      const totalRegistrations = registrationsData.pagination?.total || allRegistrations.length;
      const totalCategories = allCategories.length;
      
      console.log('🔍 Raw API Responses:', {
        eventsRes,
        usersRes,
        registrationsRes,
        categoriesRes
      });
      
      // Calculate active events (published and upcoming)
      const activeEvents = allEvents.filter(e => 
        e.status === 'published' && 
        e.status !== 'archived' &&
        new Date(e.event_date) >= new Date()
      );

      // Sort events by date (most recent first) and take top 5 for display
      const sortedEvents = [...allEvents].sort((a, b) => 
        new Date(b.created_at || b.event_date) - new Date(a.created_at || a.event_date)
      );

      console.log('📊 Dashboard Stats:', {
        totalEvents,
        activeEvents: activeEvents.length,
        totalUsers,
        totalRegistrations,
        totalCategories
      });

      setStats({
        totalEvents,
        activeEvents: activeEvents.length,
        totalUsers,
        totalRegistrations,
        totalCategories,
        recentEvents: sortedEvents.slice(0, 5),
        recentRegistrations: allRegistrations.slice(0, 5)
      });
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-black">{value}</p>
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
          <p className="text-black text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-4xl font-bold text-black mb-4">
            Welcome to Mission Control
          </h1>
          <p className="text-gray-600 text-lg">
            Your dashboard for managing the EventHub platform. All systems operational.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon={<Calendar className="w-8 h-8 text-blue-600" />}
          trend={12}
        />
        <StatCard
          title="Active Events"
          value={stats.activeEvents}
          icon={<Calendar className="w-8 h-8 text-green-600" />}
          trend={8}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="w-8 h-8 text-purple-600" />}
          trend={15}
        />
        <StatCard
          title="Registrations"
          value={stats.totalRegistrations}
          icon={<Ticket className="w-8 h-8 text-orange-600" />}
          trend={10}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Categories"
          value={stats.totalCategories}
          icon={<FolderPlus className="w-8 h-8 text-pink-600" />}
          trend={5}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-black">Recent Events</h3>
            <button 
              onClick={() => navigate('/admin/events')}
              className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {stats.recentEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-black font-medium">{event.title}</h4>
                  <p className="text-gray-600 text-sm">{new Date(event.event_date).toLocaleDateString()}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  event.status === 'published' ? 'bg-green-100 text-green-700' :
                  event.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {event.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-black mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/admin/events')}
              className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all border border-gray-200 group"
            >
              <div className="flex justify-center mb-2">
                <Calendar className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-black font-medium group-hover:text-blue-600 transition-colors">Create Event</div>
            </button>
            <button 
              onClick={() => navigate('/admin/users')}
              className="p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all border border-gray-200 group"
            >
              <div className="flex justify-center mb-2">
                <Users className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-black font-medium group-hover:text-green-600 transition-colors">Add User</div>
            </button>
            <button 
              onClick={() => navigate('/admin/categories')}
              className="p-4 bg-gray-50 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all border border-gray-200 group"
            >
              <div className="flex justify-center mb-2">
                <FolderPlus className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-black font-medium group-hover:text-purple-600 transition-colors">New Category</div>
            </button>
            <button 
              onClick={() => navigate('/admin/statistics')}
              className="p-4 bg-gray-50 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all border border-gray-200 group"
            >
              <div className="flex justify-center mb-2">
                <BarChart3 className="w-8 h-8 text-orange-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-black font-medium group-hover:text-orange-600 transition-colors">View Reports</div>
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-black mb-6">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <div>
              <div className="text-black font-medium">Database</div>
              <div className="text-green-600 text-sm">Operational</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <div>
              <div className="text-black font-medium">API Services</div>
              <div className="text-green-600 text-sm">All Systems Go</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <div>
              <div className="text-black font-medium">Email Service</div>
              <div className="text-green-600 text-sm">Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
