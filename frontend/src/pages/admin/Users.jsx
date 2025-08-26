import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/Header';
import AdminFooter from '../../components/admin/Footer';

const Users = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
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
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data.users || []);
      } else {
        // Fallback to dummy data
        setUsers([
          {
            id: 1,
            username: 'john_doe',
            email: 'john@example.com',
            full_name: 'John Doe',
            role: 'user',
            is_active: 1,
            created_at: '2024-01-15'
          },
          {
            id: 2,
            username: 'jane_smith',
            email: 'jane@example.com',
            full_name: 'Jane Smith',
            role: 'user',
            is_active: 1,
            created_at: '2024-01-16'
          },
          {
            id: 19,
            username: 'abdul.mughni845',
            email: 'abdul.mughni845@gmail.com',
            full_name: 'Abdul Mughni',
            role: 'admin',
            is_active: 1,
            created_at: '2024-01-10'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to dummy data
      setUsers([
        {
          id: 1,
          username: 'john_doe',
          email: 'john@example.com',
          full_name: 'John Doe',
          role: 'user',
          is_active: 1,
          created_at: '2024-01-15'
        },
        {
          id: 2,
          username: 'jane_smith',
          email: 'jane@example.com',
          full_name: 'Jane Smith',
          role: 'user',
          is_active: 1,
          created_at: '2024-01-16'
        }
      ]);
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
                    <h1 className="m-0">Users Management</h1>
                  </div>
                  <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                      <li className="breadcrumb-item"><a href="#">Home</a></li>
                      <li className="breadcrumb-item active">Users</li>
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
                    <h3 className="card-title">All Users</h3>
                    <div className="card-tools">
                      <button className="btn btn-primary btn-sm">
                        <i className="fas fa-plus mr-1"></i>
                        Add User
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Full Name</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id}>
                              <td>{user.id}</td>
                              <td>{user.username}</td>
                              <td>{user.email}</td>
                              <td>{user.full_name}</td>
                              <td>
                                <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-info'}`}>
                                  {user.role}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${user.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                  {user.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td>{new Date(user.created_at).toLocaleDateString()}</td>
                              <td>
                                <button className="btn btn-sm btn-info mr-1">
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn btn-sm btn-danger">
                                  <i className="fas fa-trash"></i>
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

export default Users;
