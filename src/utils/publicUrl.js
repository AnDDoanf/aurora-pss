const BASE_URL = import.meta.env.BASE_URL || '/';

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
  window.fetch = (resource, options) => {
    if (typeof resource === 'string' && resource.startsWith('/') && !resource.startsWith('//')) {
      return nativeFetch(publicUrl(resource), options);
    }
    return nativeFetch(resource, options);
  };
  window.__pssBaseAwareFetchInstalled = true;
}
