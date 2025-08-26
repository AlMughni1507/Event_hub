import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/Header';
import AdminFooter from '../../components/admin/Footer';

const Categories = () => {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'view', 'edit', 'delete'
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
    fetchCategories();
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/admin/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data.categories || []);
      } else {
        // Fallback to dummy data
        setCategories([
          {
            id: 1,
            name: 'Technology',
            description: 'Technology and IT related events',
            event_count: 5,
            is_active: 1,
            created_at: '2024-01-15'
          },
          {
            id: 2,
            name: 'Entertainment',
            description: 'Music, movies, and entertainment events',
            event_count: 3,
            is_active: 1,
            created_at: '2024-01-16'
          },
          {
            id: 3,
            name: 'Business',
            description: 'Business and networking events',
            event_count: 2,
            is_active: 1,
            created_at: '2024-01-17'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to dummy data
      setCategories([
        {
          id: 1,
          name: 'Technology',
          description: 'Technology and IT related events',
          event_count: 5,
          is_active: 1,
          created_at: '2024-01-15'
        },
        {
          id: 2,
          name: 'Entertainment',
          description: 'Music, movies, and entertainment events',
          event_count: 3,
          is_active: 1,
          created_at: '2024-01-16'
        },
        {
          id: 3,
          name: 'Business',
          description: 'Business and networking events',
          event_count: 2,
          is_active: 1,
          created_at: '2024-01-17'
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

  const handleViewCategory = (category) => {
    setSelectedCategory(category);
    setModalType('view');
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setModalType('edit');
    setShowModal(true);
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setModalType('delete');
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/admin/categories/${selectedCategory.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Remove category from list
        setCategories(categories.filter(c => c.id !== selectedCategory.id));
        setShowModal(false);
        alert('Category deleted successfully!');
      } else {
        alert('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category');
    }
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/admin/categories/${selectedCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(selectedCategory)
      });

      if (response.ok) {
        // Update category in list
        setCategories(categories.map(c => c.id === selectedCategory.id ? selectedCategory : c));
        setShowModal(false);
        alert('Category updated successfully!');
      } else {
        alert('Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category');
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
                    <h1 className="m-0">Categories Management</h1>
                  </div>
                  <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                      <li className="breadcrumb-item"><a href="#">Home</a></li>
                      <li className="breadcrumb-item active">Categories</li>
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
                    <h3 className="card-title">All Categories</h3>
                    <div className="card-tools">
                      <button className="btn btn-primary btn-sm">
                        <i className="fas fa-plus mr-1"></i>
                        Add Category
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Event Count</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map((category) => (
                            <tr key={category.id}>
                              <td>{category.id}</td>
                              <td>
                                <strong>{category.name}</strong>
                              </td>
                              <td>{category.description}</td>
                              <td>
                                <span className="badge bg-info">
                                  {category.event_count} events
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${category.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                  {category.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td>{new Date(category.created_at).toLocaleDateString()}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-info mr-1" 
                                  onClick={() => handleViewCategory(category)}
                                  title="View Category"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-warning mr-1" 
                                  onClick={() => handleEditCategory(category)}
                                  title="Edit Category"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-danger" 
                                  onClick={() => handleDeleteCategory(category)}
                                  title="Delete Category"
                                >
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
      
      {/* Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === 'view' && 'View Category'}
                  {modalType === 'edit' && 'Edit Category'}
                  {modalType === 'delete' && 'Delete Category'}
                </h5>
                <button 
                  type="button" 
                  className="close" 
                  onClick={() => setShowModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {modalType === 'view' && selectedCategory && (
                  <div>
                    <p><strong>ID:</strong> {selectedCategory.id}</p>
                    <p><strong>Name:</strong> {selectedCategory.name}</p>
                    <p><strong>Description:</strong> {selectedCategory.description}</p>
                    <p><strong>Event Count:</strong> {selectedCategory.event_count}</p>
                    <p><strong>Status:</strong> {selectedCategory.is_active ? 'Active' : 'Inactive'}</p>
                    <p><strong>Created:</strong> {new Date(selectedCategory.created_at).toLocaleDateString()}</p>
                  </div>
                )}
                
                {modalType === 'edit' && selectedCategory && (
                  <div>
                    <div className="form-group">
                      <label>Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={selectedCategory.name}
                        onChange={(e) => setSelectedCategory({...selectedCategory, name: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea 
                        className="form-control" 
                        rows="3"
                        value={selectedCategory.description}
                        onChange={(e) => setSelectedCategory({...selectedCategory, description: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select 
                        className="form-control" 
                        value={selectedCategory.is_active}
                        onChange={(e) => setSelectedCategory({...selectedCategory, is_active: parseInt(e.target.value)})}
                      >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>
                  </div>
                )}
                
                {modalType === 'delete' && selectedCategory && (
                  <div>
                    <p>Are you sure you want to delete this category?</p>
                    <p><strong>Name:</strong> {selectedCategory.name}</p>
                    <p><strong>Description:</strong> {selectedCategory.description}</p>
                    <p><strong>Event Count:</strong> {selectedCategory.event_count}</p>
                    {selectedCategory.event_count > 0 && (
                      <div className="alert alert-warning">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        Warning: This category has {selectedCategory.event_count} events. Deleting it may affect those events.
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                {modalType === 'edit' && (
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={saveEdit}
                  >
                    Save Changes
                  </button>
                )}
                {modalType === 'delete' && (
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={confirmDelete}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Backdrop */}
      {showModal && <div className="modal-backdrop fade show"></div>}
      
      <AdminFooter />
    </div>
  );
};

export default Categories;
