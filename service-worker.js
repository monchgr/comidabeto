const CACHE_NAME = 'version-1';
const urlsToCache = [
  '/',
  '/index.html',
  '/estilos.css',
  '/script.js',
  '/favicon/favicon-96x96.png',
  '/favicon/favicon-192x192.png',
  '/favicon/favicon-512x512.png'
  // Añade aquí todas las URL de los archivos estáticos que quieras cachear
];

// Instalación del Service Worker y almacenamiento en caché de los archivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptación de peticiones para servir desde la caché
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el recurso está en la caché, se devuelve. Si no, se hace la petición a la red.
        return response || fetch(event.request);
      })
  );
});