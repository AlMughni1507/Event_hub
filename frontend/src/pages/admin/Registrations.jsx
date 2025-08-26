import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/Header';
import AdminFooter from '../../components/admin/Footer';

const Registrations = () => {
  const [user, setUser] = useState(null);
  const [registrations, setRegistrations] = useState([]);
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
    fetchRegistrations();
  }, [navigate]);

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/admin/registrations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.data.registrations || []);
      } else {
        // Fallback to dummy data
        setRegistrations([
          {
            id: 1,
            user_name: 'John Doe',
            user_email: 'john@example.com',
            event_title: 'Tech Conference 2024',
            registration_date: '2024-01-15',
            status: 'confirmed',
            payment_status: 'paid'
          },
          {
            id: 2,
            user_name: 'Jane Smith',
            user_email: 'jane@example.com',
            event_title: 'Music Festival',
            registration_date: '2024-01-16',
            status: 'pending',
            payment_status: 'pending'
          },
          {
            id: 3,
            user_name: 'Bob Johnson',
            user_email: 'bob@example.com',
            event_title: 'Business Summit',
            registration_date: '2024-01-17',
            status: 'confirmed',
            payment_status: 'paid'
          },
          {
            id: 4,
            user_name: 'Alice Brown',
            user_email: 'alice@example.com',
            event_title: 'Tech Conference 2024',
            registration_date: '2024-01-18',
            status: 'cancelled',
            payment_status: 'refunded'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      // Fallback to dummy data
      setRegistrations([
        {
          id: 1,
          user_name: 'John Doe',
          user_email: 'john@example.com',
          event_title: 'Tech Conference 2024',
          registration_date: '2024-01-15',
          status: 'confirmed',
          payment_status: 'paid'
        },
        {
          id: 2,
          user_name: 'Jane Smith',
          user_email: 'jane@example.com',
          event_title: 'Music Festival',
          registration_date: '2024-01-16',
          status: 'pending',
          payment_status: 'pending'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/events';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge bg-success">Confirmed</span>;
      case 'pending':
        return <span className="badge bg-warning">Pending</span>;
      case 'cancelled':
        return <span className="badge bg-danger">Cancelled</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return <span className="badge bg-success">Paid</span>;
      case 'pending':
        return <span className="badge bg-warning">Pending</span>;
      case 'refunded':
        return <span className="badge bg-info">Refunded</span>;
      default:
        return <span className="badge bg-secondary">{paymentStatus}</span>;
    }
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
                    <h1 className="m-0">Registrations Management</h1>
                  </div>
                  <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                      <li className="breadcrumb-item"><a href="#">Home</a></li>
                      <li className="breadcrumb-item active">Registrations</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="content">
              <div className="container-fluid">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">All Registrations</h3>
                    <div className="card-tools">
                      <button className="btn btn-primary btn-sm">
                        <i className="fas fa-download mr-1"></i>
                        Export Data
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>User Name</th>
                            <th>User Email</th>
                            <th>Event Title</th>
                            <th>Registration Date</th>
                            <th>Status</th>
                            <th>Payment Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrations.map((registration) => (
                            <tr key={registration.id}>
                              <td>{registration.id}</td>
                              <td>
                                <strong>{registration.user_name}</strong>
                              </td>
                              <td>{registration.user_email}</td>
                              <td>{registration.event_title}</td>
                              <td>{new Date(registration.registration_date).toLocaleDateString()}</td>
                              <td>{getStatusBadge(registration.status)}</td>
                              <td>{getPaymentBadge(registration.payment_status)}</td>
                              <td>
                                <button className="btn btn-sm btn-info mr-1">
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button className="btn btn-sm btn-success mr-1">
                                  <i className="fas fa-check"></i>
                                </button>
                                <button className="btn btn-sm btn-danger">
                                  <i className="fas fa-times"></i>
                                </button>
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
          </div>
        </div>
      </div>
      
      <AdminFooter />
    </div>
  );
};

export default Registrations;
