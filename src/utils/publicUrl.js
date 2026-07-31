const BASE_URL = import.meta.env.BASE_URL || '/';
const STATIC_CACHE_PREFIX = 'pss:static-json:v1:';
const staticResponseCache = new Map();
const pendingStaticRequests = new Map();

const staticJsonCacheKey = (url) => `${STATIC_CACHE_PREFIX}${url}`;

const readStaticJsonCache = (url) => {
  if (staticResponseCache.has(url)) return staticResponseCache.get(url);
  try {
    const value = window.sessionStorage.getItem(staticJsonCacheKey(url));
    if (value !== null) {
      staticResponseCache.set(url, value);
      return value;
    }
  } catch {
    // In-memory caching still works when session storage is unavailable.
  }
  return null;
};

const writeStaticJsonCache = (url, body) => {
  staticResponseCache.set(url, body);
  try {
    window.sessionStorage.setItem(staticJsonCacheKey(url), body);
  } catch {
    try {
      const keys = [];
      for (let index = 0; index < window.sessionStorage.length; index += 1) {
        const key = window.sessionStorage.key(index);
        if (key?.startsWith(STATIC_CACHE_PREFIX) && key !== staticJsonCacheKey(url)) {
          keys.push(key);
        }
      }
      keys.forEach((key) => window.sessionStorage.removeItem(key));
      window.sessionStorage.setItem(staticJsonCacheKey(url), body);
    } catch {
      // Some catalog payloads exceed the browser quota; memory retains them.
    }
  }
};

const jsonResponse = (body) => new Response(body, {
  status: 200,
  headers: { 'Content-Type': 'application/json' }
});

export function publicUrl(path = '') {
  if (!path || /^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('#')) {
    return path;
  }

  const cleanPath = String(path).replace(/^\/+/, '');
  const cleanBase = BASE_URL.replace(/^\/+|\/+$/g, '');

  if (cleanBase && (cleanPath === cleanBase || cleanPath.startsWith(cleanBase + '/'))) {
    return '/' + cleanPath;
  }

  const prefix = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
  return `${prefix}${cleanPath}`;
}

export function installBaseAwareFetch() {
  if (typeof window === 'undefined' || window.__pssBaseAwareFetchInstalled) return;

  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (resource, options) => {
    const resolvedResource = typeof resource === 'string'
      && resource.startsWith('/')
      && !resource.startsWith('//')
      ? publicUrl(resource)
      : resource;
    const method = String(options?.method || 'GET').toUpperCase();
    const isStaticJson = method === 'GET'
      && typeof resolvedResource === 'string'
      && /\/data\/active\/[^/?]+\.json(?:[?#]|$)/.test(resolvedResource);

    if (!isStaticJson) return nativeFetch(resolvedResource, options);

    const cached = readStaticJsonCache(resolvedResource);
    if (cached !== null) return jsonResponse(cached);

    if (!pendingStaticRequests.has(resolvedResource)) {
      pendingStaticRequests.set(resolvedResource, (async () => {
        const response = await nativeFetch(resolvedResource, options);
        if (!response.ok) return response;
        const body = await response.clone().text();
        writeStaticJsonCache(resolvedResource, body);
        return response;
      })().finally(() => pendingStaticRequests.delete(resolvedResource)));
    }

    const response = await pendingStaticRequests.get(resolvedResource);
    const memoryBody = staticResponseCache.get(resolvedResource);
    return memoryBody !== undefined ? jsonResponse(memoryBody) : response.clone();
  };
  window.__pssBaseAwareFetchInstalled = true;
}
