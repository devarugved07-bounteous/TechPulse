self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("techpulse-shell-v1").then((cache) => cache.addAll(["/", "/offline", "/icons/icon-192.png"])),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== "techpulse-shell-v1").map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful navigations lightly for revisit speed.
        if (request.mode === "navigate" && response.ok) {
          const copy = response.clone();
          caches.open("techpulse-shell-v1").then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") {
          const offline = await caches.match("/offline");
          if (offline) return offline;
        }
        return Response.error();
      }),
  );
});
