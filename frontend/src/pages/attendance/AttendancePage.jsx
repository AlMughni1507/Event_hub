import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Footer from '../../components/Footer';

const AttendancePage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerifyToken = async (e) => {
    e.preventDefault();
    
    if (!token || token.length !== 10) {
      setMessage('Token harus 10 digit');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await api.post('/attendance/verify', {
        token: token,
        event_id: eventId
      });

      if (response.success) {
        setVerificationResult(response.data);
        setMessage('Token valid! Silakan submit daftar hadir.');
      } else {
        setMessage(response.message || 'Token tidak valid');
      }
    } catch (error) {
      console.error('Verify token error:', error);
      setMessage(error.message || 'Gagal memverifikasi token');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAttendance = async () => {
    if (!verificationResult) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await api.post('/attendance/submit', {
        token: token,
        event_id: eventId
      });

      if (response.success) {
        setMessage('✅ Daftar hadir berhasil! Sertifikat Anda sedang diproses dan akan tersedia di halaman My Certificates.');
        setToken('');
        setVerificationResult(null);
        
        // Redirect to certificates page after 3 seconds
        setTimeout(() => {
          navigate('/my-certificates');
        }, 3000);
      } else {
        setMessage(response.message || 'Gagal submit daftar hadir');
      }
    } catch (error) {
      console.error('Submit attendance error:', error);
      setMessage(error.message || 'Gagal submit daftar hadir');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">Daftar Hadir Event</h1>
            <p className="text-blue-100 text-center">Masukkan token 10 digit untuk verifikasi kehadiran</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {message && (
              <div className={`p-4 rounded-lg mb-6 ${
                message.includes('berhasil') || message.includes('valid')
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            {!verificationResult ? (
              /* Token Input Form */
              <form onSubmit={handleVerifyToken} className="space-y-6">
                <div>
                  <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                    Token Daftar Hadir (10 digit)
                  </label>
                  <input
                    id="token"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1234567890"
                    maxLength="10"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Token dikirim ke email Anda saat mendaftar event
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || token.length !== 10}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Memverifikasi...' : 'Verifikasi Token'}
                </button>
              </form>
            ) : (
              /* Verification Result */
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">Token Valid!</h3>
                      <p className="text-green-600">Data peserta terverifikasi</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nama:</span>
                      <span className="font-medium">{verificationResult.user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{verificationResult.user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Event:</span>
                      <span className="font-medium">{verificationResult.event.title}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">📋 Informasi Penting:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Pastikan Anda benar-benar hadir di event</li>
                    <li>• Token hanya bisa digunakan sekali</li>
                    <li>• Sertifikat akan tersedia setelah submit</li>
                  </ul>
                </div>

                <button
                  onClick={handleSubmitAttendance}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Mengirim...' : 'Submit Daftar Hadir'}
                </button>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <button
                  onClick={() => navigate('/events')}
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  ← Kembali ke Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AttendancePage;


