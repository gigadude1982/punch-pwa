// Self-destroying service worker.
// The apex (punchtamagotchi.com) previously hosted the PWA app, whose service
// worker is still installed in returning visitors' browsers and keeps serving
// the cached game. This SW unregisters itself, clears all caches, and reloads
// any controlled clients onto the current (landing) site.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await self.registration.unregister();
    for (const key of await caches.keys()) await caches.delete(key);
    for (const client of await self.clients.matchAll()) client.navigate(client.url);
  })());
});
