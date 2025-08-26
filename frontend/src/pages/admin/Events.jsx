import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/Header';
import AdminFooter from '../../components/admin/Footer';

const Events = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
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
    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/admin/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data.data.events || []);
      } else {
        // Fallback to dummy data
        setEvents([
          {
            id: 1,
            title: 'Tech Conference 2024',
            description: 'Annual technology conference',
            date: '2024-03-15',
            time: '09:00:00',
            location: 'Jakarta Convention Center',
            capacity: 500,
            price: 150000,
            category_id: 1,
            organizer_id: 1,
            status: 'published',
            created_at: '2024-01-15'
          },
          {
            id: 2,
            title: 'Music Festival',
            description: 'Summer music festival',
            date: '2024-04-20',
            time: '18:00:00',
            location: 'Central Park Jakarta',
            capacity: 1000,
            price: 200000,
            category_id: 2,
            organizer_id: 1,
            status: 'published',
            created_at: '2024-01-16'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      // Fallback to dummy data
      setEvents([
        {
          id: 1,
          title: 'Tech Conference 2024',
          description: 'Annual technology conference',
          date: '2024-03-15',
          time: '09:00:00',
          location: 'Jakarta Convention Center',
          capacity: 500,
          price: 150000,
          category_id: 1,
          organizer_id: 1,
          status: 'published',
          created_at: '2024-01-15'
        },
        {
          id: 2,
          title: 'Music Festival',
          description: 'Summer music festival',
          date: '2024-04-20',
          time: '18:00:00',
          location: 'Central Park Jakarta',
          capacity: 1000,
          price: 200000,
          category_id: 2,
          organizer_id: 1,
          status: 'published',
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
    window.location.href = '/events';
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setModalType('view');
    setShowModal(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setModalType('edit');
    setShowModal(true);
  };

  const handleDeleteEvent = (event) => {
    setSelectedEvent(event);
    setModalType('delete');
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/admin/events/${selectedEvent.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Remove event from list
        setEvents(events.filter(e => e.id !== selectedEvent.id));
        setShowModal(false);
        alert('Event deleted successfully!');
      } else {
        alert('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
    }
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/admin/events/${selectedEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(selectedEvent)
      });

      if (response.ok) {
        // Update event in list
        setEvents(events.map(e => e.id === selectedEvent.id ? selectedEvent : e));
        setShowModal(false);
        alert('Event updated successfully!');
      } else {
        alert('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const formatDateTime = (date, time) => {
    const dateTime = new Date(`${date}T${time}`);
    return dateTime.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                    <h1 className="m-0">Events Management</h1>
                  </div>
                  <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                      <li className="breadcrumb-item"><a href="#">Home</a></li>
                      <li className="breadcrumb-item active">Events</li>
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
                    <h3 className="card-title">All Events</h3>
                    <div className="card-tools">
                      <button className="btn btn-primary btn-sm">
                        <i className="fas fa-plus mr-1"></i>
                        Create Event
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Date & Time</th>
                            <th>Location</th>
                            <th>Capacity</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {events.map((event) => (
                            <tr key={event.id}>
                              <td>{event.id}</td>
                              <td>
                                <strong>{event.title}</strong>
                                <br />
                                <small className="text-muted">{event.description}</small>
                              </td>
                              <td>{formatDateTime(event.date, event.time)}</td>
                              <td>{event.location}</td>
                              <td>{event.capacity}</td>
                              <td>{formatPrice(event.price)}</td>
                              <td>
                                <span className={`badge ${event.status === 'published' ? 'bg-success' : 'bg-warning'}`}>
                                  {event.status}
                                </span>
                              </td>
                              <td>{new Date(event.created_at).toLocaleDateString()}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-info mr-1" 
                                  onClick={() => handleViewEvent(event)}
                                  title="View Event"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-warning mr-1" 
                                  onClick={() => handleEditEvent(event)}
                                  title="Edit Event"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-danger" 
                                  onClick={() => handleDeleteEvent(event)}
                                  title="Delete Event"
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
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === 'view' && 'View Event'}
                  {modalType === 'edit' && 'Edit Event'}
                  {modalType === 'delete' && 'Delete Event'}
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
                {modalType === 'view' && selectedEvent && (
                  <div>
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>ID:</strong> {selectedEvent.id}</p>
                        <p><strong>Title:</strong> {selectedEvent.title}</p>
                        <p><strong>Description:</strong> {selectedEvent.description}</p>
                        <p><strong>Date:</strong> {selectedEvent.date}</p>
                        <p><strong>Time:</strong> {selectedEvent.time}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Location:</strong> {selectedEvent.location}</p>
                        <p><strong>Capacity:</strong> {selectedEvent.capacity}</p>
                        <p><strong>Price:</strong> {formatPrice(selectedEvent.price)}</p>
                        <p><strong>Status:</strong> {selectedEvent.status}</p>
                        <p><strong>Created:</strong> {new Date(selectedEvent.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {modalType === 'edit' && selectedEvent && (
                  <div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Title</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={selectedEvent.title}
                            onChange={(e) => setSelectedEvent({...selectedEvent, title: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label>Description</label>
                          <textarea 
                            className="form-control" 
                            rows="3"
                            value={selectedEvent.description}
                            onChange={(e) => setSelectedEvent({...selectedEvent, description: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label>Date</label>
                          <input 
                            type="date" 
                            className="form-control" 
                            value={selectedEvent.date}
                            onChange={(e) => setSelectedEvent({...selectedEvent, date: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label>Time</label>
                          <input 
                            type="time" 
                            className="form-control" 
                            value={selectedEvent.time}
                            onChange={(e) => setSelectedEvent({...selectedEvent, time: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Location</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={selectedEvent.location}
                            onChange={(e) => setSelectedEvent({...selectedEvent, location: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label>Capacity</label>
                          <input 
                            type="number" 
                            className="form-control" 
                            value={selectedEvent.capacity}
                            onChange={(e) => setSelectedEvent({...selectedEvent, capacity: parseInt(e.target.value)})}
                          />
                        </div>
                        <div className="form-group">
                          <label>Price</label>
                          <input 
                            type="number" 
                            className="form-control" 
                            value={selectedEvent.price}
                            onChange={(e) => setSelectedEvent({...selectedEvent, price: parseInt(e.target.value)})}
                          />
                        </div>
                        <div className="form-group">
                          <label>Status</label>
                          <select 
                            className="form-control" 
                            value={selectedEvent.status}
                            onChange={(e) => setSelectedEvent({...selectedEvent, status: e.target.value})}
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {modalType === 'delete' && selectedEvent && (
                  <div>
                    <p>Are you sure you want to delete this event?</p>
                    <p><strong>Title:</strong> {selectedEvent.title}</p>
                    <p><strong>Date:</strong> {selectedEvent.date}</p>
                    <p><strong>Location:</strong> {selectedEvent.location}</p>
                    <p><strong>Price:</strong> {formatPrice(selectedEvent.price)}</p>
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

export default Events;
