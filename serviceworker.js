let staticCache = 'staticv1';
let cacheList = [
  '/',
  '/index.html',
  '/retaurant.html',
  '/css/styles.css',
  '/data/restaurants.json',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches
    .open(staticCache)
    .then(cache => {
      return cache.addAll(cacheList);
    })
    .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (staticCache.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
        } else {
          return fetch(event.request)
          .then(response => {
            const responseClone = response.clone();
            return caches.open(staticCache)
            .then(cache => {
              cache.put(event.request, responseClone);
              return response;
            })
          })
          .catch(error => {
            console.error(error)
          });
        }}));
});
