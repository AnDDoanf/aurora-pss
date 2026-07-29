const normalizeBaseUrl = (value) => String(value || '').trim().replace(/\/+$/, '');

export const PSS_DIRECT_API_BASE_URL = 'https://api.pixelstarships.com';

export const PSS_API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_PSS_API_BASE_URL
  || (import.meta.env.DEV ? '/api-pss' : PSS_DIRECT_API_BASE_URL)
);

export const pssApiUrl = (path = '') =>
  `${PSS_API_BASE_URL}/${String(path).replace(/^\/+/, '')}`;
