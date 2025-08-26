import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/Header';
import AdminSidebar from '../../components/admin/Sidebar';
import AdminFooter from '../../components/admin/Footer';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    monthlyStats: [],
    categoryStats: [],
    userStats: [],
    eventStats: [],
    revenueStats: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/analytics?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data.data);
      } else {
        // Fallback to dummy data
        setAnalyticsData({
          monthlyStats: [
            { month: 'Jan 2024', registrations: 45, revenue: 500000, events: 8 },
            { month: 'Feb 2024', registrations: 67, revenue: 750000, events: 12 },
            { month: 'Mar 2024', registrations: 89, revenue: 1200000, events: 15 },
            { month: 'Apr 2024', registrations: 76, revenue: 950000, events: 10 },
            { month: 'May 2024', registrations: 94, revenue: 1400000, events: 18 },
            { month: 'Jun 2024', registrations: 112, revenue: 1800000, events: 22 }
          ],
          categoryStats: [
            { category: 'Technology', events: 15, registrations: 234, revenue: 3500000 },
            { category: 'Music', events: 8, registrations: 456, revenue: 2800000 },
            { category: 'Business', events: 12, registrations: 189, revenue: 4200000 },
            { category: 'Education', events: 6, registrations: 123, revenue: 1800000 },
            { category: 'Sports', events: 4, registrations: 89, revenue: 1200000 }
          ],
          userStats: [
            { month: 'Jan', newUsers: 25, activeUsers: 180 },
            { month: 'Feb', newUsers: 32, activeUsers: 210 },
            { month: 'Mar', newUsers: 28, activeUsers: 195 },
            { month: 'Apr', newUsers: 45, activeUsers: 240 },
            { month: 'May', newUsers: 38, activeUsers: 225 },
            { month: 'Jun', newUsers: 52, activeUsers: 280 }
          ],
          eventStats: [
            { status: 'Published', count: 45, percentage: 75 },
            { status: 'Draft', count: 8, percentage: 13 },
            { status: 'Cancelled', count: 4, percentage: 7 },
            { status: 'Completed', count: 3, percentage: 5 }
          ],
          revenueStats: [
            { month: 'Jan', revenue: 500000, target: 600000 },
            { month: 'Feb', revenue: 750000, target: 700000 },
            { month: 'Mar', revenue: 1200000, target: 800000 },
            { month: 'Apr', revenue: 950000, target: 900000 },
            { month: 'May', revenue: 1400000, target: 1000000 },
            { month: 'Jun', revenue: 1800000, target: 1200000 }
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/events';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="content-wrapper">
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1 className="m-0">Analytics</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="container-fluid">
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminHeader user={{ full_name: 'Admin' }} onLogout={handleLogout} />
      
      <div className="admin-container">
        <AdminSidebar />
        
        <div className="admin-content">
          <div className="content-wrapper">
            <div className="content-header">
              <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col-sm-6">
                    <h1 className="m-0">Analytics Dashboard</h1>
                  </div>
                  <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                      <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
                      <li className="breadcrumb-item active">Analytics</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="content">
              <div className="container-fluid">
                {/* Period Selector */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Select Period:</label>
                      <select 
                        className="form-control" 
                        value={selectedPeriod} 
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                      >
                        <option value="3months">Last 3 Months</option>
                        <option value="6months">Last 6 Months</option>
                        <option value="12months">Last 12 Months</option>
                        <option value="year">This Year</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Revenue Overview */}
                <div className="row">
                  <div className="col-lg-8">
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">Revenue Trend</h3>
                      </div>
                      <div className="card-body">
                        <div className="chart">
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th>Month</th>
                                  <th>Revenue</th>
                                  <th>Target</th>
                                  <th>Achievement</th>
                                </tr>
                              </thead>
                              <tbody>
                                {analyticsData.revenueStats?.map((stat, index) => (
                                  <tr key={index}>
                                    <td>{stat.month}</td>
                                    <td>{formatCurrency(stat.revenue)}</td>
                                    <td>{formatCurrency(stat.target)}</td>
                                    <td>
                                      <div className="progress">
                                        <div 
                                          className="progress-bar bg-success" 
                                          style={{ width: `${Math.min((stat.revenue / stat.target) * 100, 100)}%` }}
                                        >
                                          {Math.round((stat.revenue / stat.target) * 100)}%
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">Event Status Distribution</h3>
                      </div>
                      <div className="card-body">
                        {analyticsData.eventStats?.map((stat, index) => (
                          <div key={index} className="mb-3">
                            <div className="d-flex justify-content-between">
                              <span>{stat.status}</span>
                              <span>{stat.count} ({stat.percentage}%)</span>
                            </div>
                            <div className="progress">
                              <div 
                                className="progress-bar" 
                                style={{ width: `${stat.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Performance */}
                <div className="row">
                  <div className="col-lg-6">
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">Category Performance</h3>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>Category</th>
                                <th>Events</th>
                                <th>Registrations</th>
                                <th>Revenue</th>
                              </tr>
                            </thead>
                            <tbody>
                              {analyticsData.categoryStats?.map((stat, index) => (
                                <tr key={index}>
                                  <td>{stat.category}</td>
                                  <td>{stat.events}</td>
                                  <td>{stat.registrations}</td>
                                  <td>{formatCurrency(stat.revenue)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">User Growth</h3>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>Month</th>
                                <th>New Users</th>
                                <th>Active Users</th>
                                <th>Growth</th>
                              </tr>
                            </thead>
                            <tbody>
                              {analyticsData.userStats?.map((stat, index) => (
                                <tr key={index}>
                                  <td>{stat.month}</td>
                                  <td>{stat.newUsers}</td>
                                  <td>{stat.activeUsers}</td>
                                  <td>
                                    <span className="badge bg-success">
                                      +{Math.round((stat.newUsers / stat.activeUsers) * 100)}%
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Statistics */}
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">Monthly Overview</h3>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>Month</th>
                                <th>Registrations</th>
                                <th>Revenue</th>
                                <th>Events</th>
                                <th>Avg. Revenue/Event</th>
                              </tr>
                            </thead>
                            <tbody>
                              {analyticsData.monthlyStats?.map((stat, index) => (
                                <tr key={index}>
                                  <td>{stat.month}</td>
                                  <td>{stat.registrations}</td>
                                  <td>{formatCurrency(stat.revenue)}</td>
                                  <td>{stat.events}</td>
                                  <td>{formatCurrency(stat.events > 0 ? stat.revenue / stat.events : 0)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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

export default Analytics;
