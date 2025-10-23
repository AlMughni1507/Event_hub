import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { certificatesAPI, registrationsAPI } from '../../services/api';
import ResponsiveNavbar from '../../components/ResponsiveNavbar';

const SettingsPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loadingCertificates, setLoadingCertificates] = useState(false);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertificatePreview, setShowCertificatePreview] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // profile, certificates, events

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  // Fetch user certificates
  const fetchCertificates = async () => {
    try {
      setLoadingCertificates(true);
      const response = await certificatesAPI.getMyCertificates();
      setCertificates(response.data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setCertificates([]);
    } finally {
      setLoadingCertificates(false);
    }
  };

  // Fetch user registrations
  const fetchRegistrations = async () => {
    try {
      setLoadingRegistrations(true);
      const response = await registrationsAPI.getMyRegistrations();
      setRegistrations(response.data || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setRegistrations([]);
    } finally {
      setLoadingRegistrations(false);
    }
  };


  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setShowCertificatePreview(true);
  };

  const handleDownloadCertificate = (certificate) => {
    // Mock download functionality
    console.log('Downloading certificate:', certificate.certificateId);
    // In real implementation, this would trigger a download
  };

  // Load data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCertificates();
      fetchRegistrations();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Modern Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100">
          {/* Background elements */}
          <div className="absolute top-20 left-20 w-80 h-80 bg-gray-100 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-gray-200 rounded-full opacity-30 animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gray-150 rounded-full opacity-15 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Navigation Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </button>
            </div>
          </div>
        </div>

        {/* Login Required Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <div className="max-w-md w-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 text-center shadow-xl">
              {/* User Icon */}
              <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">Account Settings</h1>
              <p className="text-gray-600 mb-8">
                Please login to access your account settings and manage your profile.
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleLogin}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Login to Your Account
                </button>
                
                <button
                  onClick={handleRegister}
                  className="w-full bg-transparent hover:bg-gray-100 text-gray-900 font-bold py-3 px-6 rounded-xl transition-all duration-300 border-2 border-gray-300 hover:border-gray-400"
                >
                  Create New Account
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-500 text-sm">
                  New to EventHub? Register as a visitor to discover and join amazing events!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Responsive Navbar */}
      <ResponsiveNavbar />

      {/* Settings Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 mb-8 shadow-xl">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user?.full_name || user?.username}!</h2>
              <p className="text-gray-600">Visitor Account</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 mb-8 shadow-lg">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'certificates'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              My Certificates ({certificates.length})
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'events'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Event History ({registrations.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-gray-500 text-sm">Full Name</label>
                <p className="text-gray-900">{user?.full_name || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-gray-500 text-sm">Username</label>
                <p className="text-gray-900">{user?.username}</p>
              </div>
              <div>
                <label className="text-gray-500 text-sm">Email</label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="text-gray-500 text-sm">Phone</label>
                <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Account Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Account Type</span>
                <span className="text-green-600 font-semibold">Visitor</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Email Verified</span>
                <span className="text-green-600 font-semibold">✓ Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Member Since</span>
                <span className="text-gray-900">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}</span>
              </div>
            </div>
          </div>

          {/* My Certificates */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              My Certificates
            </h3>
            
            {loadingCertificates ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : certificates.length > 0 ? (
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <div className="text-gray-900 font-semibold text-sm mb-2">Certificate Summary</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total Certificates:</span>
                      <span className="ml-2 font-semibold text-gray-900">{certificates.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Events Completed:</span>
                      <span className="ml-2 font-semibold text-green-600">{certificates.length}</span>
                    </div>
                  </div>
                </div>
                
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="bg-gray-50 p-3 rounded-lg border hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-gray-900 font-semibold text-sm">{cert.eventTitle}</div>
                          <div className="text-gray-500 text-xs">
                            {new Date(cert.eventDate).toLocaleDateString()} • {cert.certificateId}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewCertificate(cert)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDownloadCertificate(cert)}
                            className="text-green-600 hover:text-green-800 text-xs font-medium"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-sm">No certificates yet</p>
                <p className="text-gray-400 text-xs">Complete events to earn certificates</p>
              </div>
            )}
          </div>

          {/* My Events */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              My Events
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/events')}
                className="w-full text-left bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition-all border border-gray-300 hover:border-gray-400"
              >
                <div className="text-gray-900 font-semibold">Browse Events</div>
                <div className="text-gray-600 text-sm">Discover new events to join</div>
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Account Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-semibold py-3 px-4 rounded-lg transition-all border border-red-200 hover:border-red-300"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </div>
              </button>
            </div>
          </div>
        </div>
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              My Certificates
            </h3>
            
            {loadingCertificates ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : certificates.length > 0 ? (
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="bg-gray-50 p-4 rounded-lg border hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-gray-900 font-semibold">{cert.event_title}</div>
                        <div className="text-gray-500 text-sm">
                          {new Date(cert.event_date).toLocaleDateString()} • {cert.certificate_number}
                        </div>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                          cert.status === 'generated' ? 'bg-green-100 text-green-800' :
                          cert.status === 'issued' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {cert.status}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewCertificate(cert)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </button>
                        {cert.status === 'generated' && (
                          <button
                            onClick={() => handleDownloadCertificate(cert)}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">No certificates yet</p>
                <p className="text-gray-400 text-sm">Complete events to earn certificates</p>
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Event History
            </h3>
            
            {loadingRegistrations ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : registrations.length > 0 ? (
              <div className="space-y-4">
                {registrations.map((reg) => (
                  <div key={reg.id} className="bg-gray-50 p-4 rounded-lg border hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-gray-900 font-semibold">{reg.event_title}</div>
                        <div className="text-gray-500 text-sm">
                          {new Date(reg.event_date).toLocaleDateString()} • {reg.location}
                        </div>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                          reg.status === 'attended' ? 'bg-green-100 text-green-800' :
                          reg.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                          reg.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reg.status}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Registered</div>
                        <div className="text-sm text-gray-900">
                          {new Date(reg.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500">No events registered yet</p>
                <p className="text-gray-400 text-sm">Join events to see your history here</p>
                <button
                  onClick={() => navigate('/events')}
                  className="mt-4 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Browse Events
                </button>
              </div>
            )}
          </div>
        )}


        {/* Certificate Preview Modal */}
        {showCertificatePreview && selectedCertificate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Certificate Preview</h3>
                  <button
                    onClick={() => setShowCertificatePreview(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Certificate Design */}
                <div className="bg-gradient-to-br from-gray-50 to-white border-4 border-gray-800 rounded-lg p-12 text-center shadow-2xl">
                  <div className="border-2 border-gray-300 rounded-lg p-8">
                    {/* Header */}
                    <div className="mb-8">
                      <h1 className="text-4xl font-bold text-gray-900 mb-2">CERTIFICATE OF COMPLETION</h1>
                      <div className="w-32 h-1 bg-gray-800 mx-auto"></div>
                    </div>

                    {/* Content */}
                    <div className="mb-8">
                      <p className="text-lg text-gray-700 mb-6">This is to certify that</p>
                      <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-300 pb-2 inline-block">
                        {user?.full_name || user?.username}
                      </h2>
                      <p className="text-lg text-gray-700 mb-4">has successfully completed the</p>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                        {selectedCertificate.eventTitle}
                      </h3>
                      <p className="text-gray-600">
                        held on {new Date(selectedCertificate.eventDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-end mt-12">
                      <div className="text-left">
                        <div className="w-32 h-0.5 bg-gray-800 mb-2"></div>
                        <p className="text-sm text-gray-600">Event Organizer</p>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-2">Certificate ID</div>
                        <div className="font-mono text-sm text-gray-800">{selectedCertificate.certificateId}</div>
                      </div>
                      <div className="text-right">
                        <div className="w-32 h-0.5 bg-gray-800 mb-2"></div>
                        <p className="text-sm text-gray-600">EventHub</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mt-6">
                  <button
                    onClick={() => handleDownloadCertificate(selectedCertificate)}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Certificate
                  </button>
                  <button
                    onClick={() => setShowCertificatePreview(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;

