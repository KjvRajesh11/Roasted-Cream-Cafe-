/* =========================================================
   Roasted Cream – sw.js (Service Worker)
   PWA stub: caches core assets for offline cart browsing
   ========================================================= */

const CACHE_NAME   = 'rc-v1';
const OFFLINE_PAGE = '/offline.html';

/* Assets to pre-cache on install */
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/cart.js',
  '/js/checkout.js',
  '/js/main.js',
  '/js/utils.js',
  '/js/supabase.js',
  '/js/data/menu.js',
  '/404.html',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
];

/* Image assets — will be cached on first visit (network-first for images) */
const IMAGE_PREFIXES = ['/images/'];

/* ─── Install: pre-cache static shell ─── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Some assets failed to cache (CDN may be unavailable):', err);
      });
    })
  );
  self.skipWaiting();
});

/* ─── Activate: clean old caches ─── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

/* ─── Fetch strategy ─── */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, Supabase API, Razorpay
  if (request.method !== 'GET') return;
  if (url.hostname.includes('supabase.co')) return;
  if (url.hostname.includes('razorpay.com')) return;

  // Images → cache-first with network fallback
  const isImage =
    request.destination === 'image' ||
    IMAGE_PREFIXES.some((p) => url.pathname.startsWith(p));

  if (isImage) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((res) => {
            if (!res || res.status !== 200) return res;
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone));
            return res;
          })
          .catch(() => caches.match('/images/hero-bg.jpg')); // fallback image
      })
    );
    return;
  }

  // HTML navigation → network-first → cache → offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/404.html'))
        )
    );
    return;
  }

  // JS/CSS → stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request).then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
        }
        return res;
      });
      return cached || networkFetch;
    })
  );
});
