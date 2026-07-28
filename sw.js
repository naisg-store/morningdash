const CACHE_NAME = 'morningdash-cache-v1';

// The core files we want to save to the phone for instant loading
const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './nav.js',
  './cities.json',
  './guides.json'
];

// 1. Install Event: Cache the core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(CORE_ASSETS);
      })
  );
  self.skipWaiting();
});

// 2. Activate Event: Clean up old caches if we update the app
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: Network-first approach for APIs, Cache-first for static files
self.addEventListener('fetch', event => {
  // Don't intercept API calls to Open-Meteo or Wikipedia
  if (event.request.url.includes('api.open-meteo.com') || event.request.url.includes('wikipedia.org')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Return cached file if it exists, otherwise go to the network
      return cachedResponse || fetch(event.request);
    })
  );
});