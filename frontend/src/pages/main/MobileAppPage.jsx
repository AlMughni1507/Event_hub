import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';

// Enhanced CSS animations for MobileAppPage
const mobileAppAnimationStyles = `
  @keyframes slideInFromBottom {
    0% { transform: translateY(100px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }

  @keyframes fadeInScale {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes floatPhone {
    0%, 100% { transform: translateY(0px) rotate(-5deg); }
    50% { transform: translateY(-15px) rotate(5deg); }
  }

  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 30px rgba(0,0,0,0.1); }
    50% { box-shadow: 0 0 50px rgba(0,0,0,0.2); }
  }

  @keyframes slideInLeft {
    0% { transform: translateX(-50px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideInRight {
    0% { transform: translateX(50px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes wave {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-10px) rotate(5deg); }
    50% { transform: translateY(0) rotate(0deg); }
    75% { transform: translateY(-10px) rotate(-5deg); }
  }

  .animate-slide-in-bottom { animation: slideInFromBottom 0.8s ease-out forwards; }
  .animate-fade-in-scale { animation: fadeInScale 0.8s ease-out forwards; }
  .animate-float-phone { animation: floatPhone 4s ease-in-out infinite; }
  .animate-pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
  .animate-slide-in-left { animation: slideInLeft 0.8s ease-out forwards; }
  .animate-slide-in-right { animation: slideInRight 0.8s ease-out forwards; }
  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-rotate { animation: rotate 20s linear infinite; }
  .animate-shimmer { 
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    background-size: 1000px 100%;
    animation: shimmer 3s infinite;
  }
  .animate-bounce-slow { animation: bounce 2s ease-in-out infinite; }
  .animate-wave { animation: wave 3s ease-in-out infinite; }
  
  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
  .stagger-4 { animation-delay: 0.4s; }
  .stagger-5 { animation-delay: 0.5s; }
  .stagger-6 { animation-delay: 0.6s; }
`;

const MobileAppPage = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Handle navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      id: 1,
      icon: "📅",
      title: "Event Discovery",
      description: "Temukan event menarik di sekitar Anda dengan mudah"
    },
    {
      id: 2,
      icon: "🎫",
      title: "Easy Registration",
      description: "Daftar event hanya dengan beberapa tap di layar"
    },
    {
      id: 3,
      icon: "🔔",
      title: "Smart Notifications",
      description: "Dapatkan notifikasi untuk event yang Anda ikuti"
    },
    {
      id: 4,
      icon: "📱",
      title: "Offline Access",
      description: "Akses tiket dan informasi event tanpa internet"
    },
    {
      id: 5,
      icon: "🏆",
      title: "Digital Certificates",
      description: "Kumpulkan sertifikat digital dari event yang diikuti"
    },
    {
      id: 6,
      icon: "👥",
      title: "Social Features",
      description: "Terhubung dengan peserta event lainnya"
    }
  ];

  const screenshots = [
    {
      id: 1,
      title: "Home Screen",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=600&fit=crop"
    },
    {
      id: 2,
      title: "Event Details",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&h=600&fit=crop"
    },
    {
      id: 3,
      title: "My Tickets",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=600&fit=crop"
    }
  ];

  return (
    <>
      <style>{mobileAppAnimationStyles}</style>
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-black">
        {/* Custom Transparent Navbar - Same as HomePage */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-black/90 backdrop-blur-md shadow-lg' 
            : 'bg-transparent'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="font-bebas text-2xl text-white tracking-wider">EVENT YUKK</span>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-8">
                <button onClick={() => navigate('/')} className="font-poppins text-white hover:text-pink-400 transition-colors font-medium">Home</button>
                <button onClick={() => navigate('/events')} className="font-poppins text-white hover:text-pink-400 transition-colors font-medium">Events</button>
                <button onClick={() => navigate('/blog')} className="font-poppins text-white hover:text-pink-400 transition-colors font-medium">Blog</button>
                <button onClick={() => navigate('/contact')} className="font-poppins text-white hover:text-pink-400 transition-colors font-medium">Contact</button>
              </div>

              {/* CTA Button */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="hidden md:block font-poppins px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  Get Started
                </button>
                
                {/* Mobile Menu Button */}
                <button className="md:hidden text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-gradient-to-br from-purple-900 via-purple-800 to-black overflow-hidden">
          {/* Floating decorative elements - Pink particles with dynamic animations */}
          <div className="absolute inset-0 opacity-20 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-pink-400 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${2 + Math.random() * 4}px`,
                  height: `${2 + Math.random() * 4}px`,
                  animation: `float ${3 + Math.random() * 3}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              ></div>
            ))}
            {/* Rotating gradient orbs */}
            {[...Array(5)].map((_, i) => (
              <div
                key={`orb-${i}`}
                className="absolute rounded-full blur-3xl animate-rotate"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${20 + i * 15}%`,
                  width: `${100 + i * 50}px`,
                  height: `${100 + i * 50}px`,
                  background: `radial-gradient(circle, rgba(236,72,153,0.3), rgba(147,51,234,0.2))`,
                  animation: `rotate ${15 + i * 5}s linear infinite`,
                  animationDelay: `${i * 2}s`
                }}
              ></div>
            ))}
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="animate-slide-in-left relative z-10">
                <div className="inline-block mb-4">
                  <span className="bg-pink-500/20 text-pink-400 px-4 py-2 rounded-full text-sm font-semibold border border-pink-500/30">
                    📱 Coming Soon
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bebas font-black text-white mb-6 leading-tight">
                  EVENT YUKK
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                    MOBILE APP
                  </span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed font-poppins">
                  Nikmati pengalaman Event Yukk yang lebih personal dan mudah diakses kapan saja, 
                  di mana saja melalui aplikasi mobile kami. Temukan, daftar, dan kelola event 
                  favorit Anda dengan mudah.
                </p>
                
                {/* App Store Badges */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-poppins font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center">
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Download for iOS
                  </button>
                  <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-8 py-4 rounded-xl font-poppins font-semibold transition-all border border-white/30 flex items-center justify-center">
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    Download for Android
                  </button>
                </div>

                {/* Stats */}
                <div className="flex gap-8">
                  <div className="animate-fade-in-scale stagger-3">
                    <div className="text-3xl font-bebas font-black text-pink-400">100K+</div>
                    <div className="text-gray-400 font-poppins">Downloads</div>
                  </div>
                  <div className="animate-fade-in-scale stagger-4">
                    <div className="text-3xl font-bebas font-black text-pink-400">4.8★</div>
                    <div className="text-gray-400 font-poppins">Rating</div>
                  </div>
                  <div className="animate-fade-in-scale stagger-5">
                    <div className="text-3xl font-bebas font-black text-pink-400">50K+</div>
                    <div className="text-gray-400 font-poppins">Reviews</div>
                  </div>
                </div>
              </div>

              {/* Right Content - Realistic Phone Mockup */}
              <div className="relative animate-slide-in-right">
                <div className="relative mx-auto w-80 h-[600px] animate-float-phone">
                  {/* Phone Frame */}
                  <div className="absolute inset-0 bg-black rounded-[3rem] p-2 animate-pulse-glow shadow-2xl">
                    <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                      
                      {/* Status Bar */}
                      <div className="absolute top-0 left-0 right-0 h-12 bg-white flex items-center justify-between px-6 text-black text-sm font-medium z-10">
                        <div className="flex items-center space-x-1">
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-black rounded-full"></div>
                            <div className="w-1 h-1 bg-black rounded-full"></div>
                            <div className="w-1 h-1 bg-black rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                          </div>
                          <span className="ml-2 text-xs">Telkomsel</span>
                        </div>
                        <div className="text-xs font-semibold">11:08</div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2 17h20v2H2zm1.15-4.05L4 11.47l.85 1.48L3 14.42l-.85-1.47zm2.83-2.83L6.83 9.2l1.48.85-1.47.85-.86-1.48zm2.83-2.83L9.66 6.37l1.48.85L9.67 8.69l-.86-1.48zm2.83-2.83L12.49 3.54l1.48.85-1.47.85-.86-1.48zm2.83-2.83L15.32.71l1.48.85L15.33 3.03l-.86-1.48zM18.15 2.88L19 1.4l1.48.85L19 3.72l-.85-1.47z"/>
                          </svg>
                          <div className="w-6 h-3 border border-black rounded-sm">
                            <div className="w-4 h-1.5 bg-green-500 rounded-sm m-0.5"></div>
                          </div>
                        </div>
                      </div>

                      {/* App Content */}
                      <div className="absolute inset-0 pt-12 pb-8 bg-white">
                        {/* App Header */}
                        <div className="bg-black text-white p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-bold text-sm">Event Yukk</h3>
                              <p className="text-xs text-gray-300">Discover Events</p>
                            </div>
                          </div>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5h5v5z" />
                          </svg>
                        </div>

                        {/* Search Bar */}
                        <div className="p-4 bg-gray-50">
                          <div className="bg-white rounded-xl p-3 flex items-center space-x-3 shadow-sm">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="text-gray-400 text-sm">Search events...</span>
                          </div>
                        </div>

                        {/* Event Cards */}
                        <div className="flex-1 overflow-hidden">
                          <div className="p-4 space-y-4">
                            <h4 className="font-bold text-black text-sm">Featured Events</h4>
                            
                            {/* Event Card 1 */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                              <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                                <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-xs">
                                  Tech
                                </div>
                                <div className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded text-xs font-semibold">
                                  Free
                                </div>
                              </div>
                              <div className="p-3">
                                <h5 className="font-bold text-xs text-black mb-1">Tech Conference 2024</h5>
                                <div className="flex items-center text-xs text-gray-500 mb-2">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  Mar 15, 2024
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center text-xs text-gray-500">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                    1.2K attending
                                  </div>
                                  <button className="bg-black text-white px-3 py-1 rounded text-xs font-semibold">
                                    Join
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Event Card 2 */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                              <div className="h-24 bg-gradient-to-r from-green-500 to-teal-600 relative">
                                <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-xs">
                                  Workshop
                                </div>
                                <div className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded text-xs font-semibold">
                                  $50
                                </div>
                              </div>
                              <div className="p-3">
                                <h5 className="font-bold text-xs text-black mb-1">Digital Marketing</h5>
                                <div className="flex items-center text-xs text-gray-500 mb-2">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  Mar 20, 2024
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center text-xs text-gray-500">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                    800 attending
                                  </div>
                                  <button className="bg-black text-white px-3 py-1 rounded text-xs font-semibold">
                                    Join
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Navigation */}
                        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2">
                          <div className="flex justify-around">
                            <div className="flex flex-col items-center space-y-1">
                              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                              </svg>
                              <span className="text-xs text-black font-semibold">Home</span>
                            </div>
                            <div className="flex flex-col items-center space-y-1">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              <span className="text-xs text-gray-400">Search</span>
                            </div>
                            <div className="flex flex-col items-center space-y-1">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-xs text-gray-400">Tickets</span>
                            </div>
                            <div className="flex flex-col items-center space-y-1">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="text-xs text-gray-400">Profile</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Home Indicator */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-black via-purple-900 to-purple-800 relative overflow-hidden">
          {/* Animated particles */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-pink-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 animate-slide-in-bottom">
              <h2 className="text-4xl md:text-5xl font-bebas font-black text-white mb-6">
                FITUR UNGGULAN
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-poppins">
                Aplikasi mobile Event Yukk dilengkapi dengan berbagai fitur canggih untuk 
                memberikan pengalaman terbaik dalam mengelola event Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className={`bg-white/10 backdrop-blur-md border border-pink-500/20 rounded-2xl p-8 text-center hover:bg-white/20 hover:border-pink-500/40 transition-all duration-300 cursor-pointer animate-fade-in-scale stagger-${(index % 6) + 1}`}
                  onMouseEnter={() => setHoveredFeature(feature.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className={`text-6xl mb-6 transition-transform duration-300 ${hoveredFeature === feature.id ? 'scale-110' : 'scale-100'}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bebas font-black text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 font-poppins">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Screenshots Section */}
        <section className="py-20 bg-gradient-to-b from-purple-800 via-purple-900 to-black relative overflow-hidden">
          {/* Animated particles */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(10)].map((_, i) => (
              <div
                key={`screenshot-${i}`}
                className="absolute w-2 h-2 bg-pink-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 animate-slide-in-bottom">
              <h2 className="text-4xl md:text-5xl font-bebas font-black text-white mb-6">
                PREVIEW APLIKASI
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto font-poppins">
                Lihat tampilan dan antarmuka aplikasi Event Yukk yang intuitif dan modern.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {screenshots.map((screenshot, index) => (
                <div
                  key={screenshot.id}
                  className={`text-center animate-fade-in-scale stagger-${index + 1}`}
                >
                  <div className="relative mx-auto w-64 h-96 mb-6">
                    <div className="absolute inset-0 bg-black rounded-[2rem] p-1">
                      <img
                        src={screenshot.image}
                        alt={screenshot.title}
                        className="w-full h-full object-cover rounded-[1.5rem]"
                      />
                    </div>
                  </div>
                  <h3 className="text-lg font-bebas font-black text-white">{screenshot.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Download CTA Section */}
        <section className="py-20 bg-gradient-to-b from-black to-purple-900 text-white relative overflow-hidden">
          {/* Animated particles */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <div
                key={`cta-${i}`}
                className="absolute w-3 h-3 bg-pink-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="animate-slide-in-bottom">
              <h2 className="text-4xl md:text-5xl font-bebas font-black mb-6">
                DOWNLOAD SEKARANG
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-poppins">
                Bergabunglah dengan ribuan pengguna yang sudah merasakan kemudahan 
                mengelola event melalui aplikasi Event Yukk.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-poppins font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  App Store
                </button>
                <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-8 py-4 rounded-xl font-poppins font-semibold transition-all border border-white/30 flex items-center justify-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  Google Play
                </button>
              </div>

              <p className="text-gray-400 text-sm">
                Tersedia untuk iOS 12+ dan Android 8+
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Event Yukk Mobile</h3>
              </div>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Aplikasi mobile terdepan untuk mengelola dan menemukan event terbaik di Indonesia.
              </p>
              
              <div className="border-t border-gray-800 pt-8">
                <p className="text-gray-400">
                  © 2024 Event Yukk. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MobileAppPage;
