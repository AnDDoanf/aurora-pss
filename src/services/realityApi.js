import axios from 'axios';
import { extractPrestigeError } from '../features/prestige/prestigePath';

const REALITY_DIRECT_BASE = 'https://pss.reality.net';
const DEFAULT_GOOGLE_PROXY = 'https://script.google.com/macros/s/AKfycbzBIKVNThUxIL6mxs1pUISmiYYQXOuhdZfxJ-nZcZklXiYrfezhCy9QZp44Lzf973SdIw/exec';
const normalizeBaseUrl = (value) => String(value || '').trim().replace(/\/+$/, '');
const configuredRealityBase = normalizeBaseUrl(import.meta.env.VITE_REALITY_API_BASE_URL);
const configuredGoogleProxy = normalizeBaseUrl(
  import.meta.env.VITE_FLEET_DATA_PROXY_URL || DEFAULT_GOOGLE_PROXY
);
const directRealityConfigured = configuredRealityBase === REALITY_DIRECT_BASE;
const REALITY_NET_BASE = import.meta.env.DEV
  ? (configuredRealityBase || '/api-reality')
  : ((!configuredRealityBase || directRealityConfigured) && configuredGoogleProxy
    ? configuredGoogleProxy
    : (configuredRealityBase || REALITY_DIRECT_BASE));
const REALITY_USES_APPS_SCRIPT = /script\.google\.com\/macros\/s\//i.test(REALITY_NET_BASE);
const REALITY_ENDPOINT = REALITY_USES_APPS_SCRIPT
  ? REALITY_NET_BASE
  : `${REALITY_NET_BASE}/run-script`;

export const runPrestigePathFinder = async (shipName, targetCrew, unownedExclude = '', unownedExtra = '') => {
  try {
    const formData = new FormData();
    formData.append('username', shipName);
    formData.append('target_name', targetCrew);
    formData.append('unowned_textarea', unownedExclude);
    formData.append('additional_crew', unownedExtra);
    if (REALITY_USES_APPS_SCRIPT) formData.append('action', 'runPrestige');

    const response = await axios.post(
      REALITY_ENDPOINT,
      formData,
      { timeout: 2000000 }
    );

    const data = response.data || {};
    const embeddedError = extractPrestigeError(data.output);
    if (data.status !== 'success' || embeddedError) {
      return {
        ...data,
        status: 'error',
        message: embeddedError || data.message || 'The prestige path service returned an error.'
      };
    }

    return data; // { status: 'success', message: '...', output: '...' }
  } catch (err) {
    console.error("Failed to run prestige pathfinder on pss.reality.net:", err);
    return {
      status: 'error',
      message: err.message || 'Failed to connect to pss.reality.net backend.'
    };
  }
};

export const runManualPrestigePathFinder = async (targetCrew, expandedCrewList) => (
  runPrestigePathFinder(
    '',
    targetCrew,
    'David, Male Nurse, __manual_inventory__',
    expandedCrewList
  )
);
