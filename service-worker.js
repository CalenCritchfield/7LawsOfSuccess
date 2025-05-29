const CACHE_NAME = "spiritual-laws-cache-v1"; // Increment this version number (e.g., v2, v3) every time you update your cached files!
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/notes/notes.html",
  "/notes/noteStyle.css",
  "/notes/note.js",

  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "icons/icon-maskable-192x192.png",
  "icons/icon-maskable-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
