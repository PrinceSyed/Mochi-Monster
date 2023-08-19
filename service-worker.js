const cacheName = "Mochi Monster";
const contentToCache = [
    "Build/V82.loader.js",
    "Build/V82.framework.js",
    "Build/V82.data",
    "Build/V82.wasm",

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});


self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});

if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then((persistent) => {
      if (persistent) {
          console.log("Storage will be persistent and not cleared except by explicit user action");
      } else {
          console.log("Storage may be cleared by the browser under storage pressure.");
      }
  });
}

navigator.storage.estimate().then((estimate) => {
  console.log(`Using ${estimate.usage} out of ${estimate.quota} bytes.`);
});

