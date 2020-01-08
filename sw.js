console.log('sw registered');

const version = '1.0.0';
const staticCache = `static-${version}`;

self.addEventListener('message', (msg) => {
  if (msg.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (fetchEvent) => {
  const req = fetchEvent.request;
  if (req.method !== 'GET') {
    return;
  } else {
    fetchEvent.respondWith(
      (async () => {
        const cachedResponse = await caches.match(req, {
          ignoreSearch: true,
          ignoreVary: true
        });

        if (cachedResponse) {
          console.log(cachedResponse);
          return cachedResponse;
        } else {
          const cache = await caches.open(staticCache);
          const [_, url] = req.url.split('8887');
          cache.add(url);
          console.log(req);
          return fetch(req);
        }
      })()
    );
  }
});
