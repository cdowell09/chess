/* Service worker for offline play (PWA-lite, no build plugins required). */

const CACHE_NAME = 'kids-chess-v1'

const CORE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/offline.html',
  '/vite.svg',
  '/icons/icon.svg',
]

function isSameOrigin(requestUrl) {
  try {
    return new URL(requestUrl).origin === self.location.origin
  } catch {
    return false
  }
}

function extractSameOriginAssetUrlsFromHtml(html) {
  const urls = new Set()

  const attrRegex = /\s(?:src|href)=["']([^"']+)["']/g
  let match
  while ((match = attrRegex.exec(html))) {
    const raw = match[1]
    if (!raw) continue
    if (raw.startsWith('http:') || raw.startsWith('https:') || raw.startsWith('data:')) continue

    const url = new URL(raw, self.location.origin)
    if (url.origin !== self.location.origin) continue
    if (url.pathname.endsWith('.map')) continue

    urls.add(url.pathname)
  }

  return [...urls]
}

async function precacheFromIndexHtml(cache) {
  const response = await fetch('/', { cache: 'reload' })
  const html = await response.text()
  const urls = extractSameOriginAssetUrlsFromHtml(html)

  const extra = urls.filter((u) => u.startsWith('/assets/') || u.endsWith('.css') || u.endsWith('.js'))
  if (extra.length) {
    await cache.addAll(extra)
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      await cache.addAll(CORE_URLS)

      try {
        await precacheFromIndexHtml(cache)
      } catch {
        // If this fails, runtime caching still makes offline work after first load.
      }

      self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('message', (event) => {
  if (event?.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) return cached

  const response = await fetch(request)
  const cache = await caches.open(CACHE_NAME)
  cache.put(request, response.clone())
  return response
}

async function networkFirstForNavigate(request) {
  try {
    const response = await fetch(request)
    const cache = await caches.open(CACHE_NAME)
    cache.put(request, response.clone())
    return response
  } catch {
    const cachedShell =
      (await caches.match('/index.html')) ||
      (await caches.match('/', { ignoreSearch: true })) ||
      (await caches.match('/offline.html'))

    return cachedShell || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } })
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  if (!isSameOrigin(request.url)) return

  // SPA navigations: prefer fresh, fall back to cached app shell.
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstForNavigate(request))
    return
  }

  // Static assets: cache-first for snappy offline behavior.
  event.respondWith(cacheFirst(request))
})

