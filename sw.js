const CACHE_NAME = 'sawah-iot-cache-v1';

// Daftar file yang WAJIB disimpan di HP biar bisa dibuka pas offline
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './ikon-sawah.png' // Pastikan nama ini sesuai dengan file gambar di folder lo!
];

// Tahap 1: Install dan Simpan File ke Cache HP
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Tahap 2: Ambil file dari Cache pas internet mati
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Kalau file ada di cache, pakai yang di cache. Kalau nggak, ambil dari internet.
        return response || fetch(event.request);
      })
  );
});

// Tahap 3: Hapus Cache lama kalau ada update versi baru
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
