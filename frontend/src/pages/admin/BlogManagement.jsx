import React, { useState, useEffect } from 'react';
import { blogsAPI } from '../../services/api';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    status: 'draft',
    tags: ''
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogsAPI.getAll();
      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        await blogsAPI.update(editingBlog.id, formData);
        alert('Blog updated successfully!');
      } else {
        await blogsAPI.create(formData);
        alert('Blog created successfully!');
      }
      setShowForm(false);
      setEditingBlog(null);
      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog. Please try again.');
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      featured_image: blog.featured_image || '',
      status: blog.status,
      tags: blog.tags || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogsAPI.delete(id);
        alert('Blog deleted successfully!');
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Failed to delete blog. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      featured_image: '',
      status: 'draft',
      tags: ''
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBlog(null);
    resetForm();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'draft':
        return 'bg-orange-100 text-orange-700 border border-orange-200';
      case 'archived':
        return 'bg-gray-100 text-gray-700 border border-gray-200';
      default:
        return 'bg-blue-100 text-blue-700 border border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">📝 Blog Management</h1>
          <p className="text-gray-600">Create and manage blog posts</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>➕</span>
            <span>New Blog Post</span>
          </button>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-blue-600 text-sm">Total Posts</div>
            <div className="text-black font-bold text-xl">{blogs.length}</div>
          </div>
        </div>
      </div>

      {/* Blog Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">
                {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-black text-sm font-medium mb-2">📝 Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter blog title..."
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-black placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black transition-colors"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-black text-sm font-medium mb-2">📄 Excerpt</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    placeholder="Brief description of the blog post..."
                    rows="3"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-black placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black transition-colors resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-black text-sm font-medium mb-2">📝 Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Write your blog content here..."
                    rows="12"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-black placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black transition-colors resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-black text-sm font-medium mb-2">🖼️ Featured Image URL</label>
                  <input
                    type="url"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-black placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-black text-sm font-medium mb-2">📊 Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-black text-sm font-medium mb-2">🏷️ Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="technology, tutorial, tips (comma separated)"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-black placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  {editingBlog ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog Posts Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blog Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        {blog.featured_image && (
                          <img
                            src={blog.featured_image}
                            alt={blog.title}
                            className="w-16 h-16 object-cover rounded-lg mr-4"
                          />
                        )}
                        <div>
                          <div className="text-black font-semibold text-lg mb-1">
                            {blog.title}
                          </div>
                          {blog.excerpt && (
                            <div className="text-gray-600 text-sm line-clamp-2">
                              {blog.excerpt}
                            </div>
                          )}
                          {blog.tags && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {blog.tags.split(',').map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                >
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(blog.status)}`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-black text-sm">
                        {formatDate(blog.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Edit Blog"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-red-100 transition-colors"
                          title="Delete Blog"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {blogs.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-black mb-2">No blog posts found</h3>
          <p className="text-gray-600 mb-4">
            Start creating engaging content for your audience
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Create Your First Post
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="text-2xl mr-3">📝</div>
            <div>
              <div className="text-blue-600 text-sm font-medium">Published</div>
              <div className="text-black font-bold">
                {blogs.filter(b => b.status === 'published').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="text-2xl mr-3">📄</div>
            <div>
              <div className="text-orange-600 text-sm font-medium">Drafts</div>
              <div className="text-black font-bold">
                {blogs.filter(b => b.status === 'draft').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="text-2xl mr-3">📦</div>
            <div>
              <div className="text-gray-600 text-sm font-medium">Archived</div>
              <div className="text-black font-bold">
                {blogs.filter(b => b.status === 'archived').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="text-2xl mr-3">📊</div>
            <div>
              <div className="text-purple-600 text-sm font-medium">Total</div>
              <div className="text-black font-bold">
                {blogs.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;
