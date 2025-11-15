import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Event Yukk</h3>
            <p className="text-gray-400">
              Platform terbaik untuk menemukan dan mendaftar event berkualitas.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">Beranda</a></li>
              <li><a href="/events" className="hover:text-white transition-colors">Event</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Kontak</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Dukungan</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/help" className="hover:text-white transition-colors">Bantuan</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Kontak Kami</h4>
            <div className="text-gray-400 space-y-2">
              <p>📧 info@eventyukk.com</p>
              <p>📞 +62 123 456 7890</p>
              <p>📍 Jakarta, Indonesia</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2024 Event Yukk. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

