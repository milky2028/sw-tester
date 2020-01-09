console.log('sw registered');
import version from './version';
import resources from './resources';

declare var self: ServiceWorkerGlobalScope;

const staticCache = `static-${version}`;
// const disallowedUrls = ['.pdf'];

self.addEventListener('install', (installEvent) => {
  installEvent.waitUntil(
    (async () => {
      const cache = await caches.open(staticCache);
      return await cache.addAll(resources);
    })()
  );
});

self.addEventListener('fetch', (fetchEvent) => {
  const req = fetchEvent.request;
  if (req.method !== 'GET') {
    return;
  } else {
    fetchEvent.respondWith(
      (async () => {
        const cachedResponse = await self.caches.match(req, {
          ignoreSearch: true,
          ignoreVary: true
        });

        if (cachedResponse) {
          console.log(cachedResponse);
          return cachedResponse;
        } else {
          const cache = await self.caches.open(staticCache);
          // @ts-ignore;
          const [_, url] = req.url.split('8887');
          cache.add(url);
          console.log(req);
          return fetch(req);
        }
      })()
    );
  }
});

self.addEventListener('message', (msg) => {
  if (msg.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
