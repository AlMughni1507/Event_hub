import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { eventsAPI, categoriesAPI } from '../../services/api';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Refs for scroll animations
  const featuresRef = useRef(null);
  const categoriesRef = useRef(null);
  const eventsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsResponse, categoriesResponse] = await Promise.all([
          eventsAPI.getUpcoming({ limit: 6 }),
          categoriesAPI.getAll({ limit: 6 })
        ]);
        setUpcomingEvents(eventsResponse || []);
        setCategories(categoriesResponse || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Scroll animation observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          
          // Animate child elements with stagger effect
          const children = entry.target.querySelectorAll('.animate-on-scroll');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, index * 150);
          });
        }
      });
    }, observerOptions);

    // Set initial state and observe sections
    const sections = [featuresRef.current, categoriesRef.current, eventsRef.current, ctaRef.current];
    sections.forEach(section => {
      if (section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        // Set initial state for child elements
        const children = section.querySelectorAll('.animate-on-scroll');
        children.forEach(child => {
          child.style.opacity = '0';
          child.style.transform = 'translateY(30px)';
          child.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/events?category=${categoryId}`);
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const EventSkeleton = () => (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden animate-pulse border border-white/20">
      <div className="h-48 bg-white/20"></div>
      <div className="p-4">
        <div className="h-4 bg-white/20 rounded mb-2"></div>
        <div className="h-3 bg-white/20 rounded w-2/3 mb-2"></div>
        <div className="h-3 bg-white/20 rounded w-1/2"></div>
      </div>
    </div>
  );

  const CategorySkeleton = () => (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 animate-pulse">
      <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-3"></div>
      <div className="h-4 bg-white/20 rounded mb-2"></div>
      <div className="h-3 bg-white/20 rounded w-2/3 mx-auto"></div>
    </div>
  );

  const eventCategories = [
    {
      title: "Olahraga",
      image: "🏃‍♂️",
      icon: "🏆",
      description: "Marathon, lomba lari, dan event olahraga lainnya"
    },
    {
      title: "Seminar / Konferensi",
      image: "🎓",
      icon: "📊",
      description: "Seminar, workshop, dan konferensi bisnis"
    },
    {
      title: "Pertunjukan",
      image: "🎭",
      icon: "🎤",
      description: "Konser, teater, dan pertunjukan seni"
    },
    {
      title: "Pameran / Eksibisi",
      image: "🎪",
      icon: "🏕️",
      description: "Pameran, expo, dan event pameran"
    }
  ];

  const features = [
    {
      title: "Kirim Informasi via Email",
      icon: "✓",
      description: "Mempermudah Organizer mengirimkan informasi event secara cepat dan massal kepada Peserta disertai analytics."
    },
    {
      title: "Fleksibel Form Registrasi",
      icon: "<>",
      description: "Mendukung berbagai jenis isian formulir online yang dapat diubahsuai, dari yang sederhana hingga kompleks."
    },
    {
      title: "Kanal Pembayaran",
      icon: "💳",
      description: "Menyediakan berbagai metode pembayaran untuk kemudahan peserta sehingga meningkatkan engagement."
    }
  ];

  const handleStartNow = () => {
    navigate('/events');
  };

  return (
    <div className="min-h-screen bg-gradient-space relative overflow-hidden">
      {/* Navigation */}
      <nav className="bg-deep-space/30 backdrop-blur-md border-b border-cyan-400/20 sticky top-0 z-50 relative overflow-hidden">
        {/* Enhanced Space Background Elements for Navigation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-20 w-32 h-32 bg-accent-cyan/8 rounded-full blur-2xl animate-nebula-drift"></div>
          <div className="absolute top-0 right-20 w-24 h-24 bg-accent-violet/8 rounded-full blur-xl animate-gentle-pulse"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-accent-teal/8 rounded-full blur-lg animate-galaxy-rotate"></div>
          
          {/* Twinkling stars in navigation */}
          <div className="absolute top-4 left-1/4 w-1 h-1 bg-white/60 rounded-full animate-cosmic-twinkle" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-6 right-1/3 w-1.5 h-1.5 bg-accent-cyan/70 rounded-full animate-cosmic-twinkle" style={{animationDelay: '1.2s'}}></div>
          <div className="absolute top-2 left-2/3 w-1 h-1 bg-accent-violet/60 rounded-full animate-cosmic-twinkle" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-3 left-1/5 w-0.5 h-0.5 bg-accent-teal/80 rounded-full animate-cosmic-twinkle" style={{animationDelay: '0.8s'}}></div>
          <div className="absolute top-7 right-1/5 w-0.5 h-0.5 bg-white/70 rounded-full animate-cosmic-twinkle" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2 group">
                  <div className="w-8 h-8 bg-gradient-nebula rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 animate-gentle-pulse">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">EventHub</h1>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-white hover:text-cyan-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-cyan-500/10">
                Home
              </a>
              <Link to="/events" className="text-gray-300 hover:text-cyan-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-cyan-500/10">
                Events
              </Link>
              <Link to="/blog" className="text-gray-300 hover:text-cyan-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-cyan-500/10">
                Blog
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-cyan-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-cyan-500/10">
                Contact
              </Link>
              <Link to="/settings" className="text-gray-300 hover:text-cyan-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-cyan-500/10 flex items-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="bg-white/10 hover:bg-cyan-500/20 text-white px-4 py-2 rounded-lg text-sm font-medium border border-cyan-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-nebula text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
              >
                Register
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/30 backdrop-blur-md border-t border-white/10">
              <a href="#home" className="text-white hover:text-indigo-300 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Home
              </a>
              <a href="#events" className="text-gray-300 hover:text-indigo-300 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Events
              </a>
              <a href="#categories" className="text-gray-300 hover:text-indigo-300 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Categories
              </a>
              <a href="#features" className="text-gray-300 hover:text-indigo-300 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Features
              </a>
              <button
                onClick={() => navigate('/settings')}
                className="text-gray-300 hover:text-indigo-300 block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Settings
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full text-left bg-white/10 hover:bg-white/20 text-white block px-3 py-2 rounded-md text-base font-medium border border-white/20 transition-all"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="w-full text-left bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white block px-3 py-2 rounded-md text-base font-medium transition-all"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Enhanced Space Background */}
        <div className="absolute inset-0 bg-gradient-space">
          {/* Large cosmic nebulae */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-accent-cyan/12 rounded-full blur-3xl animate-nebula-drift"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent-violet/12 rounded-full blur-3xl animate-gentle-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-teal/8 rounded-full blur-3xl animate-galaxy-rotate"></div>
          <div className="absolute top-10 right-10 w-48 h-48 bg-accent-purple/8 rounded-full blur-2xl animate-slow-drift"></div>
          <div className="absolute bottom-10 left-10 w-56 h-56 bg-accent-pink/10 rounded-full blur-3xl animate-nebula-drift" style={{animationDelay: '5s'}}></div>
          
          {/* Medium cosmic elements */}
          <div className="absolute top-1/3 left-10 w-32 h-32 bg-accent-cyan/10 rounded-full blur-xl animate-galaxy-rotate" style={{animationDelay: '0.8s'}}></div>
          <div className="absolute bottom-1/3 right-10 w-28 h-28 bg-accent-violet/10 rounded-full blur-xl animate-gentle-pulse" style={{animationDelay: '1.3s'}}></div>
          <div className="absolute top-2/3 left-1/4 w-24 h-24 bg-accent-teal/10 rounded-full blur-lg animate-nebula-drift" style={{animationDelay: '2.1s'}}></div>
          
          {/* Shooting stars */}
          <div className="absolute top-10 left-0 w-2 h-2 bg-white rounded-full animate-shooting-star" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-1/4 left-0 w-1.5 h-1.5 bg-accent-cyan rounded-full animate-shooting-star" style={{animationDelay: '3s'}}></div>
          <div className="absolute top-1/2 left-0 w-1 h-1 bg-accent-violet rounded-full animate-shooting-star" style={{animationDelay: '6s'}}></div>
          
          {/* Comet trails */}
          <div className="absolute top-20 right-0 w-3 h-3 bg-accent-cyan/80 rounded-full animate-comet-trail" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-60 right-0 w-2 h-2 bg-accent-violet/70 rounded-full animate-comet-trail" style={{animationDelay: '5s'}}></div>
          
          {/* Twinkling starfield */}
          <div className="absolute top-20 left-1/3 w-1 h-1 bg-white/80 rounded-full animate-cosmic-twinkle" style={{animationDelay: '0.2s'}}></div>
          <div className="absolute top-40 right-1/4 w-1 h-1 bg-accent-cyan/90 rounded-full animate-cosmic-twinkle" style={{animationDelay: '1.4s'}}></div>
          <div className="absolute bottom-32 left-1/5 w-1 h-1 bg-accent-violet/80 rounded-full animate-cosmic-twinkle" style={{animationDelay: '2.3s'}}></div>
          <div className="absolute bottom-16 right-1/5 w-1 h-1 bg-accent-teal/85 rounded-full animate-cosmic-twinkle" style={{animationDelay: '0.9s'}}></div>
          <div className="absolute top-60 left-2/3 w-1 h-1 bg-accent-pink/75 rounded-full animate-cosmic-twinkle" style={{animationDelay: '1.7s'}}></div>
          <div className="absolute top-80 right-2/3 w-0.5 h-0.5 bg-white/70 rounded-full animate-cosmic-twinkle" style={{animationDelay: '2.5s'}}></div>
          <div className="absolute bottom-60 left-3/4 w-0.5 h-0.5 bg-accent-cyan/70 rounded-full animate-cosmic-twinkle" style={{animationDelay: '3.2s'}}></div>
          <div className="absolute top-32 right-3/4 w-0.5 h-0.5 bg-accent-violet/65 rounded-full animate-cosmic-twinkle" style={{animationDelay: '1.8s'}}></div>
          <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-white/60 rounded-full animate-cosmic-twinkle" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-accent-cyan/60 rounded-full animate-cosmic-twinkle" style={{animationDelay: '1.2s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-0.5 h-0.5 bg-accent-violet/70 rounded-full animate-cosmic-twinkle" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-accent-teal/55 rounded-full animate-cosmic-twinkle" style={{animationDelay: '1.8s'}}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            {/* Main Headline - Eventify Style */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight animate-fade-in-up">
              Let's Create Your
              <span className="block text-gradient-aurora bg-[length:300%_300%] animate-cosmic-pulse">
                Super Events
              </span>
            </h1>
            <span className="block text-2xl md:text-3xl lg:text-4xl mt-4 text-cyan-200 font-normal">
                Exhibition • Festival • Summit • Conference • Workshop • Seminar
              </span>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-slate-200 max-w-4xl mx-auto leading-relaxed mb-8">
              <span className="font-semibold text-white">EventHub</span> hadir sebagai platform event terbaik di Indonesia. 
              Temukan dan ikuti berbagai event menarik mulai dari conference, workshop, seminar, 
              hingga festival dengan mudah dan terpercaya.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12 text-center">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/20 hover:border-cyan-400/60 transition-all group">
                <div className="text-3xl font-bold text-white mb-2 group-hover:scale-105 transition-transform">1000+</div>
                <div className="text-cyan-200">Events Available</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-violet-400/20 hover:border-violet-400/60 transition-all group">
                <div className="text-3xl font-bold text-white mb-2 group-hover:scale-105 transition-transform">50K+</div>
                <div className="text-violet-200">Happy Participants</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-teal-400/20 hover:border-teal-400/60 transition-all group">
                <div className="text-3xl font-bold text-white mb-2 group-hover:scale-105 transition-transform">500+</div>
                <div className="text-teal-200">Trusted Organizers</div>
              </div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={() => navigate('/events')}
              className="group bg-gradient-nebula text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/40 border-2 border-transparent hover:border-cyan-400/30"
            >
              <span className="flex items-center gap-2">
                🎪 Explore Events
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
            
            <button
              onClick={() => navigate('/register')}
              className="group bg-transparent hover:bg-cyan-500/10 text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 border-2 border-cyan-400/40 hover:border-cyan-400/80 backdrop-blur-sm"
            >
              <span className="flex items-center gap-2">
                🚀 Get Started
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-green-500/5 rounded-full blur-2xl animate-bounce-slow"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need to create, manage, and attend amazing events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Event Management */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-indigo-400/50 transition-all duration-300 group hover:transform hover:scale-105 animate-on-scroll">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform animate-wiggle">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">Event Management</h3>
              <p className="text-slate-300">Create and manage events with ease. Set dates, locations, pricing, and track attendees.</p>
            </div>

            {/* Registration System */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-blue-400/50 transition-all duration-300 group hover:transform hover:scale-105 animate-on-scroll">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform animate-bounce-slow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">Easy Registration</h3>
              <p className="text-slate-300">Simple registration process with email verification and secure payment integration.</p>
            </div>

            {/* Analytics */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-emerald-400/50 transition-all duration-300 group hover:transform hover:scale-105 animate-on-scroll">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform animate-float">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">Analytics & Reports</h3>
              <p className="text-slate-300">Track event performance, attendee engagement, and generate detailed reports.</p>
            </div>

            {/* Mobile App */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-pink-400/50 transition-all duration-300 group hover:transform hover:scale-105 animate-on-scroll">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform animate-scale-pulse">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors">Mobile Friendly</h3>
              <p className="text-slate-300">Access events on the go with our responsive design and mobile-optimized experience.</p>
            </div>

            {/* Smart Notifications */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300 group hover:transform hover:scale-105 animate-on-scroll">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform animate-wiggle">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h1a3 3 0 003-3V8a3 3 0 013-3h1m-4 8a3 3 0 01-3-3V8a3 3 0 013-3h4a3 3 0 013 3v5a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors">Smart Notifications</h3>
              <p className="text-slate-300">Automated email reminders and real-time notifications for important updates.</p>
            </div>

            {/* Payment Integration */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-400/50 transition-all duration-300 group hover:transform hover:scale-105 animate-on-scroll">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">Secure Payments</h3>
              <p className="text-slate-300">Multiple payment methods with secure processing and automatic invoicing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio/Showcase Section - Eventify Style */}
      <section ref={categoriesRef} id="categories" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Event Portfolio
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto mb-8">
              Elevate Your Events, Transform Your Experiences. Dari konsep hingga pelaksanaan, 
              EventHub berkomitmen untuk mengelola setiap detail acara Anda dengan sempurna.
            </p>
            
            {/* Service Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-gradient-to-br from-indigo-600/15 to-cyan-600/15 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-indigo-400/50 transition-all group animate-fade-in-up">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform animate-wiggle">🏢</div>
                <h3 className="text-lg font-bold text-white mb-2">Corporate</h3>
                <p className="text-slate-300 text-sm">Gathering • Meeting • Conference</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600/15 to-emerald-600/15 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-400/50 transition-all group animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform animate-bounce-slow">🎪</div>
                <h3 className="text-lg font-bold text-white mb-2">Exhibition</h3>
                <p className="text-slate-300 text-sm">Expo • Trade Show • Festival</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-600/15 to-teal-600/15 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-green-400/50 transition-all group animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform animate-float">🎓</div>
                <h3 className="text-lg font-bold text-white mb-2">Education</h3>
                <p className="text-slate-300 text-sm">Seminar • Workshop • Training</p>
              </div>
              
              <div className="bg-gradient-to-br from-pink-600/15 to-orange-600/15 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-pink-400/50 transition-all group animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform animate-scale-pulse">🎉</div>
                <h3 className="text-lg font-bold text-white mb-2">Entertainment</h3>
                <p className="text-slate-300 text-sm">Concert • Gala • Celebration</p>
              </div>
            </div>
          </div>

          {/* Main Event Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <CategorySkeleton key={index} />
              ))
            ) : (
              <>
                <div 
                  onClick={() => handleCategoryClick('conference')}
                  className="group bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-indigo-400/50 transition-all cursor-pointer hover:bg-white/10 animate-zoom-in animate-glow"
                >
                  <div className="relative overflow-hidden rounded-2xl mb-6">
                    <div className="h-48 bg-gradient-to-br from-indigo-600 to-blue-600 relative">
                      <img 
                        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop&crop=center" 
                        alt="Conference & Summit" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-indigo-600/60 group-hover:bg-indigo-600/40 transition-all"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl group-hover:scale-110 transition-transform animate-wiggle">🎤</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">Conference & Summit</h3>
                  <p className="text-slate-300 mb-4">Professional conferences, business summits, dan keynote sessions dengan speaker terkemuka</p>
                  <div className="flex items-center text-indigo-400 font-semibold">
                    <span>Explore Events</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                <div 
                  onClick={() => handleCategoryClick('workshop')}
                  className="group bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-emerald-400/50 transition-all cursor-pointer hover:bg-white/10 animate-zoom-in animate-glow" style={{animationDelay: '0.2s'}}
                >
                  <div className="relative overflow-hidden rounded-2xl mb-6">
                    <div className="h-48 bg-gradient-to-br from-emerald-600 to-teal-600 relative">
                      <img 
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop&crop=center" 
                        alt="Workshop & Training" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-emerald-600/60 group-hover:bg-emerald-600/40 transition-all"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl group-hover:scale-110 transition-transform animate-float">🛠️</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">Workshop & Training</h3>
                  <p className="text-slate-300 mb-4">Hands-on workshops, skill development training, dan sesi pembelajaran interaktif</p>
                  <div className="flex items-center text-emerald-400 font-semibold">
                    <span>Explore Events</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform animate-wiggle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                <div 
                  onClick={() => handleCategoryClick('exhibition')}
                  className="group bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-pink-400/50 transition-all cursor-pointer hover:bg-white/10 animate-zoom-in animate-glow" style={{animationDelay: '0.4s'}}
                >
                  <div className="relative overflow-hidden rounded-2xl mb-6">
                    <div className="h-48 bg-gradient-to-br from-pink-600 to-rose-600 relative">
                      <img 
                        src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&h=200&fit=crop&crop=center" 
                        alt="Exhibition & Expo" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-pink-600/60 group-hover:bg-pink-600/40 transition-all"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl group-hover:scale-110 transition-transform animate-scale-pulse">🏛️</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors">Exhibition & Expo</h3>
                  <p className="text-slate-300 mb-4">Trade shows, product exhibitions, dan pameran industri dengan vendor terpercaya</p>
                  <div className="flex items-center text-pink-400 font-semibold">
                    <span>Explore Events</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                <div 
                  onClick={() => handleCategoryClick('education')}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all cursor-pointer group"
                >
                  <div className="relative h-32 bg-gradient-to-br from-blue-600 to-indigo-600">
                    <img 
                      src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&h=128&fit=crop&crop=center" 
                      alt="Education" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-600/60 group-hover:bg-blue-600/40 transition-all"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl group-hover:scale-110 transition-transform">🎓</div>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-white mb-2">Education</h3>
                    <p className="text-purple-200 text-sm">Workshops, courses, and learning events</p>
                  </div>
                </div>

                <div 
                  onClick={() => handleCategoryClick('food')}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all cursor-pointer group"
                >
                  <div className="relative h-32 bg-gradient-to-br from-orange-600 to-red-600">
                    <img 
                      src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=128&fit=crop&crop=center" 
                      alt="Food & Drink" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-orange-600/60 group-hover:bg-orange-600/40 transition-all"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl group-hover:scale-110 transition-transform">🍽️</div>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-white mb-2">Food & Drink</h3>
                    <p className="text-purple-200 text-sm">Culinary events and food festivals</p>
                  </div>
                </div>

                <div 
                  onClick={() => handleCategoryClick('art')}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all cursor-pointer group"
                >
                  <div className="relative h-32 bg-gradient-to-br from-purple-600 to-pink-600">
                    <img 
                      src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=128&fit=crop&crop=center" 
                      alt="Arts & Culture" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-purple-600/60 group-hover:bg-purple-600/40 transition-all"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl group-hover:scale-110 transition-transform">🎨</div>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-white mb-2">Arts & Culture</h3>
                    <p className="text-purple-200 text-sm">Exhibitions, galleries, and cultural events</p>
                  </div>
                </div>

                <div 
                  onClick={() => handleCategoryClick('health')}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all cursor-pointer group"
                >
                  <div className="relative h-32 bg-gradient-to-br from-green-600 to-teal-600">
                    <img 
                      src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=128&fit=crop&crop=center" 
                      alt="Health & Wellness" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-green-600/60 group-hover:bg-green-600/40 transition-all"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl group-hover:scale-110 transition-transform">🏥</div>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-white mb-2">Health & Wellness</h3>
                    <p className="text-purple-200 text-sm">Health seminars and wellness workshops</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section ref={eventsRef} id="events" className="py-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-scale-pulse"></div>
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-cyan-500/5 rounded-full blur-2xl animate-float"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-slide-in-left">
              Upcoming Events
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto animate-slide-in-right">
              Don't miss out on these amazing upcoming events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <EventSkeleton key={index} />
              ))
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => (
                <div key={event.id} className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-400/50 transition-all group cursor-pointer animate-zoom-in animate-glow" style={{animationDelay: `${index * 0.2}s`}}>
                  <div className="h-48 bg-gradient-to-br from-indigo-600/30 to-cyan-600/30 flex items-center justify-center relative overflow-hidden">
                    <div className="text-6xl group-hover:scale-110 transition-transform animate-wiggle">🎪</div>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all"></div>
                    {/* Floating particles in event cards */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full animate-bounce-slow"></div>
                    <div className="absolute bottom-4 left-4 w-1 h-1 bg-cyan-400/50 rounded-full animate-float"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-slate-300 mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center text-sm text-slate-400 mb-2 group-hover:text-indigo-300 transition-colors">
                      <svg className="w-4 h-4 mr-2 animate-wiggle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(event.event_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-slate-400 group-hover:text-cyan-300 transition-colors">
                      <svg className="w-4 h-4 mr-2 animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 animate-fade-in-up">
                <div className="text-6xl mb-4 animate-bounce-slow">📅</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Events Yet</h3>
                <p className="text-slate-300">Check back soon for upcoming events!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section - Space Theme */}
      <section ref={ctaRef} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-space"></div>
        
        {/* Enhanced Space Background Elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-accent-cyan/8 rounded-full blur-3xl animate-nebula-drift"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-violet/8 rounded-full blur-3xl animate-galaxy-rotate"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-teal/5 rounded-full blur-2xl animate-gentle-pulse"></div>
        
        {/* Shooting stars for CTA section */}
        <div className="absolute top-20 left-0 w-2 h-2 bg-white rounded-full animate-shooting-star" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-40 left-0 w-1.5 h-1.5 bg-accent-cyan rounded-full animate-shooting-star" style={{animationDelay: '4s'}}></div>
        
        {/* Floating cosmic particles */}
        <div className="absolute top-20 right-1/4 w-3 h-3 bg-white/30 rounded-full animate-cosmic-twinkle"></div>
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-accent-cyan/40 rounded-full animate-cosmic-twinkle" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-accent-violet/35 rounded-full animate-cosmic-twinkle" style={{animationDelay: '2s'}}></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Create Your
              <span className="block text-gradient-aurora bg-clip-text text-transparent">
                Next Super Event?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-4xl mx-auto leading-relaxed">
              Bergabunglah dengan ribuan event organizer dan peserta di Indonesia. 
              Platform terpercaya untuk semua kebutuhan event Anda.
            </p>
            
            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/20 hover:border-cyan-400/50 transition-all">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-lg font-bold text-white mb-2">100% Satisfaction Guarantee</h3>
                <p className="text-slate-300 text-sm">Kepuasan pelanggan adalah prioritas utama kami</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-violet-400/20 hover:border-violet-400/50 transition-all">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-lg font-bold text-white mb-2">Best Quality Services</h3>
                <p className="text-slate-300 text-sm">Layanan berkualitas tinggi dengan tim profesional</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-teal-400/20 hover:border-teal-400/50 transition-all">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-lg font-bold text-white mb-2">Commitment to Customers</h3>
                <p className="text-slate-300 text-sm">Komitmen penuh untuk kesuksesan event Anda</p>
              </div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <button 
              onClick={() => navigate('/register')}
              className="group bg-gradient-nebula text-white font-bold py-5 px-12 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/30 border-2 border-transparent hover:border-cyan-400/30"
            >
              <span className="flex items-center gap-3">
                🚀 Start Your Journey
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
            
            <button 
              onClick={() => window.open('https://wa.me/6287777281237', '_blank')}
              className="group bg-transparent hover:bg-cyan-500/10 text-white font-bold py-5 px-12 rounded-2xl text-xl transition-all duration-300 border-2 border-cyan-400/40 hover:border-cyan-400/80 backdrop-blur-sm"
            >
              <span className="flex items-center gap-3">
                💬 Free Consultation
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </span>
            </button>
          </div>
          
          {/* Contact Info */}
          <div className="text-center">
            <p className="text-cyan-200 mb-4">
              Hubungi kami untuk konsultasi gratis dan dapatkan penawaran terbaik
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2 text-cyan-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +62 877-7728-1237
              </div>
              <div className="flex items-center gap-2 text-cyan-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                info@eventhub.co.id
              </div>
              <div className="flex items-center gap-2 text-cyan-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Jakarta, Indonesia
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">EventHub</h3>
              </div>
              <p className="text-purple-200 mb-4 max-w-md">
                The ultimate platform for discovering and managing events. Connect with your community and create memorable experiences.
              </p>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </button>
                <button className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </button>
                <button className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-purple-200 hover:text-white transition-colors">Home</a></li>
                <li><a href="#events" className="text-purple-200 hover:text-white transition-colors">Events</a></li>
                <li><a href="#categories" className="text-purple-200 hover:text-white transition-colors">Categories</a></li>
                <li><a href="#features" className="text-purple-200 hover:text-white transition-colors">Features</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-purple-200 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-purple-200">
              © 2024 EventHub. All rights reserved. Made with ❤️ for the community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
