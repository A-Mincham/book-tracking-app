/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'booktracker-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-512x512.png',
  // Add other static assets here
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Cache static assets
      await cache.addAll(STATIC_ASSETS);
      // Cache offline page
      const offlineResponse = new Response(
        'You are offline. Please check your internet connection.',
        {
          headers: { 'Content-Type': 'text/html' },
        }
      );
      await cache.put(OFFLINE_URL, offlineResponse);
    })()
  );
  // Force waiting service worker to become active
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
      // Take control of all pages under this service worker's scope
      await self.clients.claim();
    })()
  );
});

// Fetch event - handle offline functionality
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // Try network first
      try {
        const networkResponse = await fetch(event.request);
        
        // Cache successful GET requests
        if (event.request.method === 'GET') {
          cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
      } catch (error) {
        // If network fails, try cache
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;

        // If cache fails, return offline page for HTML requests
        if (event.request.headers.get('Accept')?.includes('text/html')) {
          return cache.match(OFFLINE_URL);
        }

        // Return error for other requests
        return new Response('Network error happened', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    })()
  );
});

// Background sync for reading updates
const SYNC_TAG = 'reading-updates-sync';

interface ReadingUpdate {
  id: string;
  timestamp: string;
  bookId: string;
  currentPage: number;
  thoughts: string;
}

// Queue failed updates for background sync
const queueUpdate = async (update: ReadingUpdate) => {
  const db = await openDB();
  await db.add('updates', update);
  await self.registration.sync.register(SYNC_TAG);
};

// Process queued updates when back online
self.addEventListener('sync', (event) => {
  if (event.tag === SYNC_TAG) {
    event.waitUntil(syncReadingUpdates());
  }
});

// IndexedDB setup
const DB_NAME = 'BookTrackerOfflineDB';
const DB_VERSION = 1;

const openDB = async () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('updates')) {
        db.createObjectStore('updates', { keyPath: 'id' });
      }
    };
  });
};

// Sync reading updates
const syncReadingUpdates = async () => {
  const db = await openDB();
  const updates = await getAllUpdates(db);

  for (const update of updates) {
    try {
      await fetch('/api/reading-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
      });
      await deleteUpdate(db, update.id);
    } catch (error) {
      console.error('Failed to sync update:', error);
    }
  }
};

// Helper functions for IndexedDB operations
const getAllUpdates = (db: IDBDatabase): Promise<ReadingUpdate[]> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('updates', 'readonly');
    const store = transaction.objectStore('updates');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const deleteUpdate = (db: IDBDatabase, id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('updates', 'readwrite');
    const store = transaction.objectStore('updates');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}; 