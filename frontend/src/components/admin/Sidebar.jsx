import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <Link to="/admin/dashboard" className="brand-link">
        <i className="fas fa-calendar-alt brand-image img-circle elevation-3" style={{ opacity: 0.8 }}></i>
        <span className="brand-text font-weight-light">Event Admin</span>
      </Link>

      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
            <li className="nav-item">
              <Link to="/admin/dashboard" className="nav-link active">
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>Dashboard</p>
              </Link>
            </li>
            
            <li className="nav-header">MANAGEMENT</li>
            
            <li className="nav-item">
              <Link to="/admin/users" className="nav-link">
                <i className="nav-icon fas fa-users"></i>
                <p>Users</p>
              </Link>
            </li>
            
            <li className="nav-item">
              <Link to="/admin/events" className="nav-link">
                <i className="nav-icon fas fa-calendar"></i>
                <p>Events</p>
              </Link>
            </li>
            
            <li className="nav-item">
              <Link to="/admin/categories" className="nav-link">
                <i className="nav-icon fas fa-tags"></i>
                <p>Categories</p>
              </Link>
            </li>
            
            <li className="nav-item">
              <Link to="/admin/registrations" className="nav-link">
                <i className="nav-icon fas fa-ticket-alt"></i>
                <p>Registrations</p>
              </Link>
            </li>
            
            <li className="nav-header">REPORTS</li>
            
            <li className="nav-item">
              <Link to="/admin/reports" className="nav-link">
                <i className="nav-icon fas fa-chart-bar"></i>
                <p>Analytics</p>
              </Link>
            </li>
            
            <li className="nav-item">
              <Link to="/admin/settings" className="nav-link">
                <i className="nav-icon fas fa-cog"></i>
                <p>Settings</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
