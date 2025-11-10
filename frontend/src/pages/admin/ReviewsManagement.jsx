import React, { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { Star, CheckCircle, XCircle, Trash2, MessageSquare, User, Calendar, Filter } from 'lucide-react';
import api from '../../services/api';
import ConfirmModal from '../../components/ConfirmModal';

const ReviewsManagement = () => {
  const toast = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const [statusConfirm, setStatusConfirm] = useState({ show: false, review: null, action: null });

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reviews/admin/all', {
        params: { status: filter, limit: 100 }
      });
      setReviews(response.data?.reviews || response.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Gagal memuat ulasan');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reviewId, isApproved) => {
    try {
      await api.put(`/reviews/admin/${reviewId}/status`, {
        is_approved: isApproved
      });
      toast.success(isApproved ? 'Ulasan disetujui!' : 'Ulasan ditolak!');
      fetchReviews();
    } catch (error) {
      toast.error('Gagal mengupdate status ulasan');
      console.error('Error updating review status:', error);
    } finally {
      setStatusConfirm({ show: false, review: null, action: null });
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/reviews/admin/${deleteConfirm.id}`);
      toast.success('Ulasan berhasil dihapus');
      fetchReviews();
    } catch (error) {
      toast.error('Gagal menghapus ulasan');
      console.error('Error deleting review:', error);
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (isApproved) => {
    if (isApproved) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3" />
          Disetujui
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
        <MessageSquare className="w-3 h-3" />
        Menunggu Review
        </span>
    );
  };

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => !r.is_approved).length,
    approved: reviews.filter(r => r.is_approved).length,
    avgRating: reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-purple-600" />
              Manajemen Ulasan
            </h1>
            <p className="text-gray-600 mt-1">Kelola ulasan platform dari pengguna</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Total Ulasan</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <MessageSquare className="w-12 h-12 text-purple-200 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium mb-1">Menunggu Review</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
              <Filter className="w-12 h-12 text-yellow-200 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Disetujui</p>
                <p className="text-3xl font-bold">{stats.approved}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-200 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium mb-1">Rating Rata-rata</p>
                <p className="text-3xl font-bold">{stats.avgRating} ⭐</p>
              </div>
              <Star className="w-12 h-12 text-pink-200 opacity-80" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200 w-fit">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              filter === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Semua ({stats.total})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              filter === 'pending'
                ? 'bg-yellow-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Menunggu ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              filter === 'approved'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Disetujui ({stats.approved})
          </button>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-200">
          <MessageSquare className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Ulasan</h3>
          <p className="text-gray-600">
            {filter === 'pending' && 'Tidak ada ulasan yang menunggu review'}
            {filter === 'approved' && 'Belum ada ulasan yang disetujui'}
            {filter === 'all' && 'Belum ada ulasan dari pengguna'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={`https://i.pravatar.cc/150?u=${review.user_id}`}
                    alt={review.full_name}
                    className="w-16 h-16 rounded-full border-2 border-purple-200"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{review.full_name}</h3>
                      {getStatusBadge(review.is_approved)}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {review.username || review.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(review.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="mt-2">{renderStars(review.rating)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-gray-800 italic leading-relaxed">"{review.comment}"</p>
              </div>

              {review.admin_notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Admin Notes:</strong> {review.admin_notes}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2">
                {!review.is_approved && (
                  <button
                    onClick={() => setStatusConfirm({ show: true, review, action: 'approve' })}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Setujui
                  </button>
                )}
                {review.is_approved && (
                  <button
                    onClick={() => setStatusConfirm({ show: true, review, action: 'reject' })}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md"
                  >
                    <XCircle className="w-4 h-4" />
                    Tolak
                  </button>
                )}
                <button
                  onClick={() => setDeleteConfirm({ show: true, id: review.id })}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, id: null })}
        onConfirm={handleDelete}
        title="Hapus Ulasan"
        message="Apakah Anda yakin ingin menghapus ulasan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        confirmColor="red"
      />

      {/* Status Confirmation Modal */}
      <ConfirmModal
        isOpen={statusConfirm.show}
        onClose={() => setStatusConfirm({ show: false, review: null, action: null })}
        onConfirm={() => handleStatusUpdate(statusConfirm.review?.id, statusConfirm.action === 'approve')}
        title={statusConfirm.action === 'approve' ? 'Setujui Ulasan' : 'Tolak Ulasan'}
        message={
          statusConfirm.action === 'approve'
            ? 'Ulasan ini akan ditampilkan di halaman utama dan dapat dilihat oleh semua pengguna.'
            : 'Ulasan ini tidak akan ditampilkan di halaman utama.'
        }
        confirmText={statusConfirm.action === 'approve' ? 'Setujui' : 'Tolak'}
        confirmColor={statusConfirm.action === 'approve' ? 'green' : 'yellow'}
      />
    </div>
  );
};

export default ReviewsManagement;
