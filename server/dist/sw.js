const CACHE_NAME = 'eventyukk-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip caching for ALL API calls and localhost requests - always fetch from network
  // Also skip for POST, PUT, DELETE, PATCH requests
  if (url.pathname.startsWith('/api/') || 
      url.hostname === 'localhost' || 
      url.hostname === '127.0.0.1' ||
      url.port === '3000' ||
      ['POST', 'PUT', 'DELETE', 'PATCH'].includes(event.request.method)) {
    // Always fetch from network, never use cache
    event.respondWith(
      fetch(event.request, {
        cache: 'no-store',
        headers: event.request.headers
      }).catch((error) => {
        console.error('Fetch error:', error);
        // If fetch fails, return a basic error response instead of blocking
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Network error',
          message: 'Gagal terhubung ke server. Silakan coba lagi.'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }
  
  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
