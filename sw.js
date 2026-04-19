/* Service Worker do Templo de Hermes — PWA Offline */
const CACHE_NAME = 'templo-hermes-v1';
const ASSETS = [
  './',
  './index.html',
  './css/templo.css',
  './js/world.js',
  './js/items.js',
  './js/runes.js',
  './js/mcp_tools.js',
  './js/inbox.js',
  './js/agents.js',
  './js/council.js',
  './js/player.js',
  './js/renderer.js',
  './js/interactions.js',
  './js/initiation.js',
  './js/main.js',
  './manifest.json'
];

// Instalar — cachear tudo
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Ativar — limpar caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache first, fallback network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
