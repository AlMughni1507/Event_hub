import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Target, Award, Heart, Zap, Shield, Globe } from 'lucide-react';
import Footer from '../../components/Footer';

const AboutPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

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
      icon: Target,
      title: 'Our Mission',
      description: 'To connect people with amazing events and create unforgettable experiences that bring communities together.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'We believe in building strong communities through shared experiences and meaningful connections.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Constantly improving our platform with cutting-edge technology to provide the best user experience.'
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Your security is our priority. We ensure safe and secure transactions for all our users.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Events Hosted' },
    { number: '50K+', label: 'Happy Users' },
    { number: '100+', label: 'Cities Covered' },
    { number: '4.8/5', label: 'User Rating' }
  ];

  const team = [
    {
      name: 'Abdul Mughni',
      role: 'Founder & CEO',
      description: 'Passionate about creating meaningful connections through events.'
    },
    {
      name: 'Development Team',
      role: 'Tech Innovators',
      description: 'Building the future of event management platforms.'
    },
    {
      name: 'Community Team',
      role: 'Event Specialists',
      description: 'Ensuring every event is a memorable experience.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@300;400;600;700;900&display=swap');
        .font-bebas { font-family: 'Bebas Neue', cursive; }
        .font-poppins { font-family: 'Poppins', sans-serif; }
      `}</style>

      {/* Custom Transparent Navbar */}
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
              <button onClick={() => navigate('/about')} className="font-poppins text-pink-400 font-semibold">About</button>
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

      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-purple-900 via-purple-800 to-pink-900 pt-24 pb-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-bebas text-5xl md:text-7xl text-white mb-4 tracking-wider">ABOUT US</h1>
          <p className="font-poppins text-xl text-purple-200 max-w-2xl mx-auto">Connecting people through amazing events and unforgettable experiences</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Story Section */}
        <div className="mb-20 text-center">
          <h2 className="font-bebas text-4xl md:text-5xl text-gray-800 mb-6">OUR STORY</h2>
          <div className="max-w-3xl mx-auto">
            <p className="font-poppins text-lg text-gray-600 leading-relaxed mb-6">
              Event Yukk was born from a simple idea: to make discovering and attending events easier and more enjoyable for everyone. 
              We believe that events have the power to bring people together, create lasting memories, and build stronger communities.
            </p>
            <p className="font-poppins text-lg text-gray-600 leading-relaxed">
              Today, we're proud to be the leading platform for event discovery and management, serving thousands of users 
              and helping organizers create successful events across the country.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                  <div className="font-bebas text-4xl md:text-5xl text-purple-600 mb-2">{stat.number}</div>
                  <div className="font-poppins text-gray-600 font-semibold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="font-bebas text-4xl md:text-5xl text-gray-800 mb-12 text-center">WHY CHOOSE US</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-poppins text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="font-poppins text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="font-bebas text-4xl md:text-5xl text-gray-800 mb-12 text-center">OUR TEAM</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="font-poppins text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <p className="font-poppins text-purple-600 font-semibold mb-3">{member.role}</p>
                <p className="font-poppins text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-pink-900 rounded-2xl p-12 text-center text-white">
          <h2 className="font-bebas text-4xl md:text-5xl mb-6">OUR VALUES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <Heart className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-poppins text-xl font-bold mb-2">Passion</h3>
              <p className="font-poppins text-purple-200 text-sm">We love what we do and it shows in everything we create</p>
            </div>
            <div>
              <Award className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-poppins text-xl font-bold mb-2">Excellence</h3>
              <p className="font-poppins text-purple-200 text-sm">We strive for excellence in every aspect of our platform</p>
            </div>
            <div>
              <Globe className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-poppins text-xl font-bold mb-2">Community</h3>
              <p className="font-poppins text-purple-200 text-sm">Building connections and fostering community growth</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="font-bebas text-4xl md:text-5xl text-gray-800 mb-6">JOIN US TODAY</h2>
          <p className="font-poppins text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Start discovering amazing events or create your own. Join thousands of users who trust Event Yukk for their event needs.
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => navigate('/events')}
              className="font-poppins px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Explore Events
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="font-poppins px-8 py-4 bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 rounded-full font-semibold transition-all shadow-lg"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
