import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FallingStars from '../../components/FallingStars';

const BlogPage = () => {
  const [articles, setArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const categories = [
    { value: 'all', label: 'Semua Artikel', icon: '📚' },
    { value: 'tips', label: 'Tips & Trik', icon: '💡' },
    { value: 'news', label: 'Berita', icon: '📰' },
    { value: 'event-update', label: 'Update Event', icon: '🎪' },
    { value: 'general', label: 'Umum', icon: '📝' }
  ];

  useEffect(() => {
    fetchArticles();
    fetchFeaturedArticles();
  }, [selectedCategory, searchQuery, currentPage]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 9
      });
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`http://localhost:3000/api/articles?${params}`);
      const data = await response.json();

      if (data.success) {
        setArticles(data.data.articles);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedArticles = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/articles/featured');
      const data = await response.json();

      if (data.success) {
        setFeaturedArticles(data.data);
      }
    } catch (error) {
      console.error('Error fetching featured articles:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchArticles();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData ? categoryData.icon : '📝';
  };

  const getCategoryLabel = (category) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData ? categoryData.label : 'Umum';
  };

  return (
    <div className="min-h-screen bg-deep-space relative overflow-hidden">
      {/* Falling Stars Background */}
      <FallingStars density="light" />
      {/* Cosmic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-comet-cyan/10 rounded-full blur-3xl animate-cosmic-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-plasma-purple/10 rounded-full blur-2xl animate-stellar-drift"></div>
        <div className="absolute top-1/2 left-3/4 w-32 h-32 bg-aurora-green/10 rounded-full blur-xl animate-nebula-swirl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-nebula-pink/8 rounded-full blur-2xl animate-space-float"></div>
      </div>
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-comet-cyan via-plasma-purple to-aurora-green">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-star-white/80 hover:text-starlight transition-colors group mb-8 animate-fade-in-up"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Beranda
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-starlight mb-6 animate-fade-in-up">
              Blog & Berita
            </h1>
            <p className="text-xl text-star-white/90 max-w-3xl mx-auto animate-slide-in-left">
              Tips, trik, dan update terbaru seputar dunia event dan pengembangan karir
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-cosmic mb-8 animate-fade-in-up">Artikel Unggulan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.slice(0, 3).map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  className="group cosmic-glass rounded-2xl overflow-hidden hover:border-comet-cyan/50 transition-all duration-300 hover:scale-105 animate-fade-in-up"
                >
                  <div className="aspect-video bg-gradient-to-r from-comet-cyan to-plasma-purple relative overflow-hidden">
                    {article.featured_image ? (
                      <img 
                        src={article.featured_image} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">{getCategoryIcon(article.category)}</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                        {getCategoryLabel(article.category)}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-cosmic-gold/20 backdrop-blur-sm text-cosmic-gold text-xs px-2 py-1 rounded-full animate-cosmic-twinkle">
                        ⭐ Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{article.author_name}</span>
                      <span>{formatDate(article.published_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari artikel..."
                  className="w-full px-4 py-3 pl-12 cosmic-glass border border-starlight/20 rounded-xl text-star-white placeholder-moon-silver focus:outline-none focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all animate-glow"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-moon-silver animate-cosmic-twinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => {
                    setSelectedCategory(category.value);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 animate-glow ${
                    selectedCategory === category.value
                      ? 'bg-gradient-to-r from-comet-cyan to-plasma-purple text-star-white'
                      : 'cosmic-glass text-moon-silver hover:bg-cosmic-navy/50'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="cosmic-glass rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-cosmic-navy/50 animate-cosmic-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-cosmic-navy/50 rounded mb-3 animate-stellar-drift"></div>
                  <div className="h-4 bg-cosmic-navy/50 rounded mb-2 animate-nebula-swirl"></div>
                  <div className="h-4 bg-cosmic-navy/50 rounded mb-4 w-3/4 animate-space-float"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-cosmic-navy/50 rounded w-20 animate-cosmic-pulse"></div>
                    <div className="h-4 bg-cosmic-navy/50 rounded w-24 animate-stellar-drift"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  className="group cosmic-glass rounded-2xl overflow-hidden hover:border-comet-cyan/50 transition-all duration-300 hover:scale-105 animate-fade-in-up"
                >
                  <div className="aspect-video bg-gradient-to-r from-cosmic-navy to-stellar-blue relative overflow-hidden">
                    {article.featured_image ? (
                      <img 
                        src={article.featured_image} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">{getCategoryIcon(article.category)}</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                        {getCategoryLabel(article.category)}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="cosmic-glass text-star-white text-xs px-2 py-1 rounded-full animate-cosmic-twinkle">
                        👁️ {article.views}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{article.author_name}</span>
                      <span>{formatDate(article.published_at)}</span>
                    </div>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="text-xs cosmic-glass text-comet-cyan px-2 py-1 rounded-full animate-glow">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-700/50 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600/50 transition-colors"
                >
                  ← Sebelumnya
                </button>
                
                <div className="flex space-x-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-xl transition-all animate-glow ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-comet-cyan to-plasma-purple text-star-white'
                            : 'cosmic-glass text-moon-silver hover:bg-cosmic-navy/50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 cosmic-glass text-star-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cosmic-navy/50 transition-all animate-glow"
                >
                  Selanjutnya →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-starlight mb-2 animate-cosmic-twinkle">Tidak Ada Artikel</h3>
            <p className="text-moon-silver animate-fade-in-up">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Tidak ditemukan artikel yang sesuai dengan pencarian atau filter Anda.'
                : 'Belum ada artikel yang dipublikasikan.'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setCurrentPage(1);
                }}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-comet-cyan to-plasma-purple text-star-white rounded-xl hover:from-comet-cyan/80 hover:to-plasma-purple/80 transition-all transform hover:scale-105 animate-glow"
              >
                Reset Filter
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
