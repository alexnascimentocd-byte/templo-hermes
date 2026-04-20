/* Service Worker do Templo de Hermes — PWA Offline */
const CACHE_NAME = 'templo-hermes-v4';
const ASSETS = [
  './',
  './index.html',
  './css/templo.css',
  './js/world.js',
  './js/persistence.js',
  './js/knowledge-base.js',
  './js/response-engine.js',
  './js/items.js',
  './js/runes.js',
  './js/mcp_tools.js',
  './js/inbox.js',
  './js/console.js',
  './js/agents.js',
  './js/council.js',
  './js/player.js',
  './js/renderer.js',
  './js/interactions.js',
  './js/initiation.js',
  './js/main.js',
  './js/system-admin.js',
  './js/remote-admin.js',
  './js/parallel-engine.js',
  './js/agent-trainer.js',
  './js/crystal-ball.js',
  './js/alchemy-economy.js',
  './js/cognitive-cortex.js',
  './js/npc-grimoire.js',
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

// Fetch — network first, fallback cache (sempre pega versão nova)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Atualizar cache com versão nova
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
