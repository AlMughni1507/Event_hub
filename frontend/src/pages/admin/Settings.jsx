import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/Header';
import AdminSidebar from '../../components/admin/Sidebar';
import AdminFooter from '../../components/admin/Footer';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Event Management System',
    siteDescription: 'Platform manajemen event terbaik',
    contactEmail: 'admin@eventmanagement.com',
    contactPhone: '+62 812-3456-7890',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    timezone: 'Asia/Jakarta',
    currency: 'IDR',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24',
    maxFileSize: 5,
    allowedFileTypes: 'jpg,jpeg,png,pdf',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'noreply@eventmanagement.com',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerification: true
  });

  const [profile, setProfile] = useState({
    fullName: 'Admin User',
    email: 'abdul.mughni845@gmail.com',
    phone: '+62 812-3456-7890',
    avatar: null
  });

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
    fetchProfile();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSettingsSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/events';
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="admin-layout">
      <AdminHeader user={{ full_name: profile.fullName }} onLogout={handleLogout} />
      
      <div className="admin-container">
        <AdminSidebar />
        
        <div className="admin-content">
          <div className="content-wrapper">
            <div className="content-header">
              <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col-sm-6">
                    <h1 className="m-0">Settings</h1>
                  </div>
                  <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                      <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
                      <li className="breadcrumb-item active">Settings</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="content">
              <div className="container-fluid">
                {/* Message Alert */}
                {message.text && (
                  <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible`}>
                    <button type="button" className="close" onClick={() => setMessage({ type: '', text: '' })}>
                      <span>&times;</span>
                    </button>
                    {message.text}
                  </div>
                )}

                <div className="row">
                  <div className="col-md-3">
                    {/* Settings Navigation */}
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">Settings Menu</h3>
                      </div>
                      <div className="card-body p-0">
                        <ul className="nav nav-pills flex-column">
                          <li className="nav-item">
                            <a 
                              className={`nav-link ${activeTab === 'general' ? 'active' : ''}`}
                              href="#"
                              onClick={(e) => { e.preventDefault(); setActiveTab('general'); }}
                            >
                              <i className="fas fa-cog mr-2"></i> General Settings
                            </a>
                          </li>
                          <li className="nav-item">
                            <a 
                              className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                              href="#"
                              onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }}
                            >
                              <i className="fas fa-user mr-2"></i> Profile Settings
                            </a>
                          </li>
                          <li className="nav-item">
                            <a 
                              className={`nav-link ${activeTab === 'email' ? 'active' : ''}`}
                              href="#"
                              onClick={(e) => { e.preventDefault(); setActiveTab('email'); }}
                            >
                              <i className="fas fa-envelope mr-2"></i> Email Settings
                            </a>
                          </li>
                          <li className="nav-item">
                            <a 
                              className={`nav-link ${activeTab === 'system' ? 'active' : ''}`}
                              href="#"
                              onClick={(e) => { e.preventDefault(); setActiveTab('system'); }}
                            >
                              <i className="fas fa-server mr-2"></i> System Settings
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-9">
                    {/* General Settings */}
                    {activeTab === 'general' && (
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">General Settings</h3>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Site Name</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={settings.siteName}
                                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Site Description</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={settings.siteDescription}
                                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Contact Email</label>
                                <input
                                  type="email"
                                  className="form-control"
                                  value={settings.contactEmail}
                                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Contact Phone</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={settings.contactPhone}
                                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="form-group">
                            <label>Address</label>
                            <textarea
                              className="form-control"
                              rows="3"
                              value={settings.address}
                              onChange={(e) => handleInputChange('address', e.target.value)}
                            ></textarea>
                          </div>

                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>Timezone</label>
                                <select
                                  className="form-control"
                                  value={settings.timezone}
                                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                                >
                                  <option value="Asia/Jakarta">Asia/Jakarta</option>
                                  <option value="Asia/Singapore">Asia/Singapore</option>
                                  <option value="UTC">UTC</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>Currency</label>
                                <select
                                  className="form-control"
                                  value={settings.currency}
                                  onChange={(e) => handleInputChange('currency', e.target.value)}
                                >
                                  <option value="IDR">IDR (Indonesian Rupiah)</option>
                                  <option value="USD">USD (US Dollar)</option>
                                  <option value="SGD">SGD (Singapore Dollar)</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>Date Format</label>
                                <select
                                  className="form-control"
                                  value={settings.dateFormat}
                                  onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                                >
                                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSettingsSave}
                            disabled={loading}
                          >
                            {loading ? 'Saving...' : 'Save General Settings'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Profile Settings */}
                    {activeTab === 'profile' && (
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">Profile Settings</h3>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Full Name</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={profile.fullName}
                                  onChange={(e) => handleProfileChange('fullName', e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Email</label>
                                <input
                                  type="email"
                                  className="form-control"
                                  value={profile.email}
                                  onChange={(e) => handleProfileChange('email', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="form-group">
                            <label>Phone Number</label>
                            <input
                              type="text"
                              className="form-control"
                              value={profile.phone}
                              onChange={(e) => handleProfileChange('phone', e.target.value)}
                            />
                          </div>

                          <div className="form-group">
                            <label>Profile Picture</label>
                            <input
                              type="file"
                              className="form-control-file"
                              accept="image/*"
                              onChange={(e) => handleProfileChange('avatar', e.target.files[0])}
                            />
                            <small className="form-text text-muted">
                              Recommended size: 200x200 pixels. Max file size: 2MB.
                            </small>
                          </div>

                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleProfileSave}
                            disabled={loading}
                          >
                            {loading ? 'Saving...' : 'Save Profile'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Email Settings */}
                    {activeTab === 'email' && (
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">Email Settings</h3>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>SMTP Host</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={settings.smtpHost}
                                  onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>SMTP Port</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={settings.smtpPort}
                                  onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>SMTP Username</label>
                                <input
                                  type="email"
                                  className="form-control"
                                  value={settings.smtpUser}
                                  onChange={(e) => handleInputChange('smtpUser', e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>SMTP Password</label>
                                <input
                                  type="password"
                                  className="form-control"
                                  placeholder="Enter SMTP password"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="custom-control custom-switch">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="emailVerification"
                                checked={settings.emailVerification}
                                onChange={(e) => handleInputChange('emailVerification', e.target.checked)}
                              />
                              <label className="custom-control-label" htmlFor="emailVerification">
                                Enable Email Verification for New Users
                              </label>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSettingsSave}
                            disabled={loading}
                          >
                            {loading ? 'Saving...' : 'Save Email Settings'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* System Settings */}
                    {activeTab === 'system' && (
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">System Settings</h3>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Max File Size (MB)</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={settings.maxFileSize}
                                  onChange={(e) => handleInputChange('maxFileSize', e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Allowed File Types</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={settings.allowedFileTypes}
                                  onChange={(e) => handleInputChange('allowedFileTypes', e.target.value)}
                                  placeholder="jpg,jpeg,png,pdf"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="custom-control custom-switch">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="maintenanceMode"
                                checked={settings.maintenanceMode}
                                onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                              />
                              <label className="custom-control-label" htmlFor="maintenanceMode">
                                Maintenance Mode
                              </label>
                            </div>
                            <small className="form-text text-muted">
                              When enabled, only administrators can access the system.
                            </small>
                          </div>

                          <div className="form-group">
                            <div className="custom-control custom-switch">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="registrationEnabled"
                                checked={settings.registrationEnabled}
                                onChange={(e) => handleInputChange('registrationEnabled', e.target.checked)}
                              />
                              <label className="custom-control-label" htmlFor="registrationEnabled">
                                Enable User Registration
                              </label>
                            </div>
                            <small className="form-text text-muted">
                              Allow new users to register on the platform.
                            </small>
                          </div>

                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSettingsSave}
                            disabled={loading}
                          >
                            {loading ? 'Saving...' : 'Save System Settings'}
                          </button>
                        </div>
                      </div>
                    )}
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

export default Settings;
