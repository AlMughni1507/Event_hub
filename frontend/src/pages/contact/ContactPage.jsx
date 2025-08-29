import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FallingStars from '../../components/FallingStars';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setMessage(data.message || 'Gagal mengirim pesan');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setMessage('Terjadi kesalahan saat mengirim pesan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Falling Stars Background */}
      <FallingStars density="light" />
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up text-starlight">
              Hubungi Kami
            </h1>
            <p className="text-xl text-star-white/90 max-w-3xl mx-auto animate-slide-in-left">
              Punya pertanyaan tentang event atau butuh bantuan? Tim EventHub siap membantu Anda 24/7
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-cosmic mb-6 animate-fade-in-up">Tentang EventHub</h2>
              <p className="text-moon-silver text-lg leading-relaxed mb-8 animate-slide-in-left">
                EventHub adalah platform terdepan untuk menemukan dan mengikuti berbagai event menarik. 
                Kami menghubungkan penyelenggara event dengan peserta yang antusias, menciptakan 
                pengalaman yang tak terlupakan untuk semua.
              </p>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="cosmic-glass rounded-2xl p-6 animate-fade-in-up">
                <div className="w-12 h-12 bg-gradient-to-r from-comet-cyan to-plasma-purple rounded-xl flex items-center justify-center mb-4 animate-glow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-starlight font-semibold mb-2">Telepon</h3>
                <p className="text-moon-silver">+62 21 1234 5678</p>
                <p className="text-moon-silver">+62 812 3456 7890</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-plasma-purple to-nebula-pink rounded-xl flex items-center justify-center mb-4 animate-glow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <h3 className="text-starlight font-semibold mb-2">Email</h3>
                <p className="text-moon-silver">hello@eventhub.com</p>
                <p className="text-moon-silver">support@eventhub.com</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-aurora-green to-comet-cyan rounded-xl flex items-center justify-center mb-4 animate-glow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-starlight font-semibold mb-2">Alamat</h3>
                <p className="text-moon-silver">Jl. Sudirman No. 123</p>
                <p className="text-moon-silver">Jakarta Pusat, 10220</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-comet-cyan to-stellar-blue rounded-xl flex items-center justify-center mb-4 animate-glow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-starlight font-semibold mb-2">Jam Operasional</h3>
                <p className="text-moon-silver">Senin - Jumat: 09:00 - 18:00</p>
                <p className="text-moon-silver">Sabtu: 09:00 - 15:00</p>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-starlight font-semibold mb-4 animate-cosmic-twinkle">Ikuti Kami</h3>
              <div className="flex space-x-4">
                <a href="https://instagram.com/eventhub" target="_blank" rel="noopener noreferrer" 
                   className="w-12 h-12 bg-gradient-to-r from-nebula-pink to-plasma-purple rounded-xl flex items-center justify-center hover:scale-110 transition-transform animate-glow">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.315 0-.612-.123-.837-.348-.225-.225-.348-.522-.348-.837s.123-.612.348-.837c.225-.225.522-.348.837-.348s.612.123.837.348c.225.225.348.522.348.837s-.123.612-.348.837c-.225.225-.522.348-.837.348z"/>
                  </svg>
                </a>
                <a href="https://twitter.com/eventhub" target="_blank" rel="noopener noreferrer"
                   className="w-12 h-12 bg-gradient-to-r from-comet-cyan to-aurora-green rounded-xl flex items-center justify-center hover:scale-110 transition-transform animate-glow">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://facebook.com/eventhub" target="_blank" rel="noopener noreferrer"
                   className="w-12 h-12 bg-gradient-to-r from-stellar-blue to-plasma-purple rounded-xl flex items-center justify-center hover:scale-110 transition-transform animate-glow">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/company/eventhub" target="_blank" rel="noopener noreferrer"
                   className="w-12 h-12 bg-gradient-to-r from-stellar-blue to-cosmic-navy rounded-xl flex items-center justify-center hover:scale-110 transition-transform animate-glow">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="cosmic-glass rounded-2xl p-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-cosmic mb-6 animate-cosmic-twinkle">Kirim Pesan</h2>
            
            {message && (
              <div className={`p-4 rounded-xl mb-6 ${
                message.includes('berhasil') 
                  ? 'cosmic-glass text-aurora-green border border-aurora-green/50' 
                  : 'cosmic-glass text-nebula-pink border border-nebula-pink/50'
              }`}>
                <div className="flex items-center">
                  <span className="mr-2">
                    {message.includes('berhasil') ? '✅' : '❌'}
                  </span>
                  {message}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-moon-silver mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 cosmic-glass border border-starlight/20 rounded-xl text-star-white placeholder-moon-silver focus:outline-none focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all animate-glow"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-moon-silver mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 cosmic-glass border border-starlight/20 rounded-xl text-star-white placeholder-moon-silver focus:outline-none focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all animate-glow"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-moon-silver mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 cosmic-glass border border-starlight/20 rounded-xl text-star-white placeholder-moon-silver focus:outline-none focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all animate-glow"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-moon-silver mb-2">
                    Subjek *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 cosmic-glass border border-starlight/20 rounded-xl text-star-white placeholder-moon-silver focus:outline-none focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all animate-glow"
                    placeholder="Topik pesan Anda"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-moon-silver mb-2">
                  Pesan *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 cosmic-glass border border-starlight/20 rounded-xl text-star-white placeholder-moon-silver focus:outline-none focus:ring-2 focus:ring-comet-cyan focus:border-comet-cyan transition-all resize-none animate-glow"
                  placeholder="Tulis pesan Anda di sini..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-comet-cyan to-plasma-purple hover:from-comet-cyan/80 hover:to-plasma-purple/80 text-star-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-comet-cyan disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none animate-glow"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengirim Pesan...
                  </span>
                ) : (
                  <>
                    <span className="mr-2">📧</span>
                    Kirim Pesan
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
