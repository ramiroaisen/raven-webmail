import { build, files, timestamp } from "$service-worker";
import { registerRoute, setCatchHandler, setDefaultHandler } from "workbox-routing";
import { StaleWhileRevalidate, CacheFirst, NetworkOnly } from "workbox-strategies";
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { matchPrecache, precacheAndRoute } from "workbox-precaching";
import { ExpirationPlugin } from "workbox-expiration";

const revision = timestamp.toString(32);

precacheAndRoute(build);
precacheAndRoute(files.map(url => ({ url, revision })));
precacheAndRoute([{ url: "/offline", revision }]);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
registerRoute(
  ({url}) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
    ]
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
registerRoute(
  ({url}) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

setDefaultHandler(new NetworkOnly());

setCatchHandler(async ({url, request}) => {
  if(url.origin === location.origin && request.destination === "document") {
    return await matchPrecache("/offline")
  }

  return Response.error();
})
