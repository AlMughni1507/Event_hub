import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../../services/api';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#007bff',
    is_active: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Use simplified categories from database
      const simplifiedCategories = [
        { 
          id: 71, 
          name: 'Technology', 
          description: 'Tech events, programming, IT conferences',
          icon: 'fas fa-laptop-code', 
          color: '#007bff',
          is_active: true,
          created_at: new Date().toISOString()
        },
        { 
          id: 72, 
          name: 'Business', 
          description: 'Business conferences, networking, entrepreneurship',
          icon: 'fas fa-briefcase', 
          color: '#28a745',
          is_active: true,
          created_at: new Date().toISOString()
        },
        { 
          id: 73, 
          name: 'Education', 
          description: 'Workshops, seminars, training, learning events',
          icon: 'fas fa-graduation-cap', 
          color: '#ffc107',
          is_active: true,
          created_at: new Date().toISOString()
        },
        { 
          id: 74, 
          name: 'Entertainment', 
          description: 'Music, concerts, festivals, entertainment',
          icon: 'fas fa-music', 
          color: '#dc3545',
          is_active: true,
          created_at: new Date().toISOString()
        },
        { 
          id: 75, 
          name: 'Sports', 
          description: 'Sports events, competitions, fitness activities',
          icon: 'fas fa-running', 
          color: '#fd7e14',
          is_active: true,
          created_at: new Date().toISOString()
        },
        { 
          id: 76, 
          name: 'Community', 
          description: 'Community events, charity, social gatherings',
          icon: 'fas fa-users', 
          color: '#6f42c1',
          is_active: true,
          created_at: new Date().toISOString()
        }
      ];
      setCategories(simplifiedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Categories are now fixed - show message that editing is disabled
    alert('Categories are now fixed to 6 main types: Technology, Business, Education, Entertainment, Sports, Community. Editing is disabled.');
    setShowModal(false);
    setEditingCategory(null);
    resetForm();
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || '#007bff',
      is_active: category.is_active !== undefined ? category.is_active : true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoriesAPI.delete(id);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '',
      color: '#007bff',
      is_active: true
    });
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const iconOptions = [
    { value: 'fas fa-laptop-code', label: '💻 Technology' },
    { value: 'fas fa-briefcase', label: '💼 Business' },
    { value: 'fas fa-graduation-cap', label: '🎓 Education' },
    { value: 'fas fa-music', label: '🎵 Entertainment' },
    { value: 'fas fa-running', label: '🏃 Sports' },
    { value: 'fas fa-heartbeat', label: '❤️ Health' },
    { value: 'fas fa-users', label: '👥 Community' },
    { value: 'fas fa-utensils', label: '🍽️ Food' },
    { value: 'fas fa-paint-brush', label: '🎨 Art' },
    { value: 'fas fa-camera', label: '📸 Photography' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">📂 Categories Management</h1>
          <p className="text-gray-600">Organize events into categories</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            resetForm();
            setShowModal(true);
          }}
          className="mt-4 md:mt-0 bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-colors"
        >
          ✨ Create New Category
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="max-w-md">
          <label className="block text-black text-sm font-medium mb-2">🔍 Search Categories</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or description..."
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-black placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black transition-colors"
          />
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-black text-xl">Loading categories...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category, index) => (
            <div key={category.id} className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-gray-400 transition-colors shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${category.color}20`, border: `2px solid ${category.color}30` }}
                  >
                    {category.icon ? (
                      <i className={category.icon} style={{ color: category.color }}></i>
                    ) : (
                      <span style={{ color: category.color }}>📂</span>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-black font-bold text-lg">{category.name}</h3>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        category.is_active 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {category.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors"
                    title="Edit Category"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-red-100 transition-colors"
                    title="Delete Category"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                {category.description || 'No description available'}
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Events: {category.event_count || 0}</span>
                <span className="text-gray-600">Created: {new Date(category.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredCategories.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📂</div>
          <h3 className="text-xl font-semibold text-black mb-2">No categories found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first category to get started'}
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-2xl">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-2xl font-bold text-white">
                {editingCategory ? '✏️ Edit Category' : '✨ Create New Category'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Describe this category"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select Icon</option>
                    {iconOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Color</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-full h-12 bg-slate-700 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="is_active" className="ml-2 text-white text-sm font-medium">
                  Active category
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCategory(null);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-slate-700 border border-slate-600 text-white rounded-xl hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;
