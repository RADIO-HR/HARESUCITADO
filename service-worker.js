
const CACHE_NAME = 'haresucitado-cache-v1';
const ASSETS_TO_CACHE = [
  '/HARESUCITADO/',
  '/HARESUCITADO/index.html',
  '/HARESUCITADO/icon-192.png',
  '/HARESUCITADO/icon-512.png'
];

// Install - cache assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activate - cleanup old caches
self.addEventListener('activate', (event) => {
  clients.claim();
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        return res;
      }).catch(() => {
        return caches.match('/HARESUCITADO/index.html');
      });
    })
  );
});