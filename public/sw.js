const CACHE_NAME = 'booktracker-v1';
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
  '/offline.html',
  '/src/main.tsx',
  '/src/App.tsx'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - network first, falling back to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response before caching
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            // Only cache successful responses
            if (response.status === 200) {
              cache.put(event.request, responseClone);
            }
          });
        return response;
      })
      .catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);
        
        if (cachedResponse) {
          return cachedResponse;
        }

        // If the request is for a page (HTML), return the offline page
        if (event.request.mode === 'navigate') {
          const offlineResponse = await cache.match('/offline.html');
          if (offlineResponse) {
            return offlineResponse;
          }
        }

        // For non-HTML requests that aren't in cache, return a simple error response
        return new Response('Network error happened', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' },
        });
      })
  );
});

// Handle background sync for pending actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reading-updates') {
    event.waitUntil(syncReadingUpdates());
  }
});

// Function to sync reading updates when back online
async function syncReadingUpdates() {
  try {
    const pendingUpdates = await getPendingUpdates();
    for (const update of pendingUpdates) {
      await sendUpdate(update);
    }
    await clearPendingUpdates();
  } catch (error) {
    console.error('Error syncing reading updates:', error);
  }
}

// Helper functions for managing pending updates
async function getPendingUpdates() {
  const db = await openDB();
  return db.getAll('pending-updates');
}

async function clearPendingUpdates() {
  const db = await openDB();
  return db.clear('pending-updates');
}

async function sendUpdate(update) {
  // Implement the actual API call to sync the update
  return fetch('/api/reading-updates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(update),
  });
}

// IndexedDB helper
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('booktracker-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-updates')) {
        db.createObjectStore('pending-updates', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
} 