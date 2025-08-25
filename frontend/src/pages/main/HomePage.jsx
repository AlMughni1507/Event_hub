import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Logo dengan desain swirl */}
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6">
                <a href="#home" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Upcoming Events</a>
                <a href="#services" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Services</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Contact Us</a>
                <button onClick={()=>navigate('/login')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center">
                  Login Organizer
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">Upcoming Events</a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">Services</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">Contact Us</a>
              <button onClick={()=>navigate('/login')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg w-full mt-2 flex items-center justify-center">
                Login Organizer
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Balanced Gradient Background */}
      <section id="home" className="pt-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-white" style={{
          clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 60%)'
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Registrasi & ticketing untuk{' '}
                <span className="text-blue-200">segala acara</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed opacity-90">
                Kami membantu me-manage registrasi, otomasi pembayaran tiket & check-in peserta event Anda secara real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
                  Ayo Ikut Event
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="bg-white hover:bg-gray-100 text-blue-600 font-semibold py-3 px-6 rounded-lg transition-colors">
                  Kontak Kami
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {eventCategories.map((category, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow relative group">
                  <div className="absolute -top-1 -right-1 text-yellow-400 text-xs">✨</div>
                  <div className="absolute -bottom-1 -left-1 text-yellow-400 text-xs">✨</div>
                  <div className="absolute top-2 left-2 text-blue-600 text-lg">
                    {category.icon}
                  </div>
                  <div className="text-4xl mb-3 text-center mt-4">
                    {category.image}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 text-center">
                    {category.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl font-bold">{feature.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Platform Registrasi & Ticketing Terpercaya
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            Galanesia membantu ribuan organizer event di Indonesia untuk mengelola registrasi dan ticketing dengan mudah dan efisien.
          </p>
          <button 
            onClick={()=>navigate('/events')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Mulai Sekarang
          </button>
        </div>
      </section>

      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={()=>navigate('/login')} className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
