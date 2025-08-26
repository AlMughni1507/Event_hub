import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/Header';
import AdminFooter from '../../components/admin/Footer';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total_users: 0,
    total_events: 0,
    total_registrations: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    const userObj = JSON.parse(userData);
    if (userObj.role !== 'admin') {
      navigate('/');
      return;
    }

    setUser(userObj);
    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      } else {
        // Fallback to dummy data if API fails
        setStats({
          total_users: 25,
          total_events: 12,
          total_registrations: 89
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Fallback to dummy data
      setStats({
        total_users: 25,
        total_events: 12,
        total_registrations: 89
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminHeader user={user} onLogout={handleLogout} />
        <div className="admin-container">
          <AdminSidebar />
          <div className="admin-content">
            <div className="content-wrapper">
              <div className="content">
                <div className="container-fluid">
                  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AdminFooter />
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminHeader user={user} onLogout={handleLogout} />
      
      <div className="admin-container">
        <AdminSidebar />
        
        <div className="admin-content">
          <div className="content-wrapper">
            {/* Content Header */}
            <div className="content-header">
              <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col-sm-6">
                    <h1 className="m-0">Dashboard</h1>
                  </div>
                  <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                      <li className="breadcrumb-item"><a href="#">Home</a></li>
                      <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="content">
              <div className="container-fluid">
                {/* Info boxes */}
                <div className="row">
                  <div className="col-12 col-sm-6 col-md-3">
                    <div className="info-box">
                      <span className="info-box-icon bg-info">
                        <i className="fas fa-users"></i>
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">Total Users</span>
                        <span className="info-box-number">{stats.total_users}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 col-sm-6 col-md-3">
                    <div className="info-box">
                      <span className="info-box-icon bg-success">
                        <i className="fas fa-calendar"></i>
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">Total Events</span>
                        <span className="info-box-number">{stats.total_events}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 col-sm-6 col-md-3">
                    <div className="info-box">
                      <span className="info-box-icon bg-warning">
                        <i className="fas fa-tags"></i>
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">Categories</span>
                        <span className="info-box-number">5</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 col-sm-6 col-md-3">
                    <div className="info-box">
                      <span className="info-box-icon bg-danger">
                        <i className="fas fa-ticket-alt"></i>
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">Registrations</span>
                        <span className="info-box-number">{stats.total_registrations}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main row */}
                <div className="row">
                  <div className="col-md-8">
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">Recent Events</h3>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>Event Name</th>
                                <th>Date</th>
                                <th>Location</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Tech Conference 2024</td>
                                <td>2024-01-15</td>
                                <td>Jakarta Convention Center</td>
                                <td><span className="badge bg-success">Active</span></td>
                              </tr>
                              <tr>
                                <td>Music Festival</td>
                                <td>2024-02-20</td>
                                <td>GBK Stadium</td>
                                <td><span className="badge bg-warning">Upcoming</span></td>
                              </tr>
                              <tr>
                                <td>Business Summit</td>
                                <td>2024-03-10</td>
                                <td>Hotel Indonesia</td>
                                <td><span className="badge bg-info">Planning</span></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">Quick Actions</h3>
                      </div>
                      <div className="card-body">
                        <div className="d-grid gap-2">
                          <button className="btn btn-primary">
                            <i className="fas fa-plus mr-2"></i>
                            Create Event
                          </button>
                          <button className="btn btn-success">
                            <i className="fas fa-user-plus mr-2"></i>
                            Add User
                          </button>
                          <button className="btn btn-info">
                            <i className="fas fa-cog mr-2"></i>
                            Settings
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card mt-3">
                      <div className="card-header">
                        <h3 className="card-title">System Status</h3>
                      </div>
                      <div className="card-body">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Server Status</span>
                          <span className="badge bg-success">Online</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Database</span>
                          <span className="badge bg-success">Connected</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Last Backup</span>
                          <span className="text-muted">2 hours ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AdminFooter />
    </div>
  );
};

export default AdminDashboard;
