/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

void self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('push', (event) => {
  const data = event.data?.json() as { title: string; body: string };

  if (data.body && data.title) {
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: new URL('/icons/push.png', self.registration.scope).toString(),
      })
    );
  }
});
