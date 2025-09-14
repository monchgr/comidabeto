const CACHE_NAME = 'version-1';
const urlsToCache = [
  '/',
  '/index.html',
  '/estilos.css',
  '/script.js',
  '/favicon/favicon-96x96.png',
  '/favicon/web-app-manifest-192x192.png',
  '/favicon/web-app-manifest-512x512.png'
];

// Instalación: precache seguro
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        urlsToCache.map(url =>
          fetch(url)
            .then(response => {
              if (!response.ok) throw new Error(`Fallo al cachear ${url}`);
              return cache.put(url, response);
            })
            .catch(err => console.warn(err))
        )
      );
    })
  );
});

// Activación: limpieza de caches antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// Interceptación de fetch: cache first con fallback a red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).catch(() => {
        // Opcional: fallback si no hay conexión y recurso no está en cache
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
