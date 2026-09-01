import axios from 'axios';
import { extractPrestigeError } from '../features/prestige/prestigePath';

const REALITY_NET_BASE = import.meta.env.VITE_REALITY_API_BASE_URL
  || (import.meta.env.DEV ? '/api-reality' : 'https://pss.reality.net');

export const runPrestigePathFinder = async (shipName, targetCrew, unownedExclude = '', unownedExtra = '') => {
  try {
    const formData = new FormData();
    formData.append('username', shipName);
    formData.append('target_name', targetCrew);
    formData.append('unowned_textarea', unownedExclude);
    formData.append('additional_crew', unownedExtra);

    const response = await axios.post(
      `${REALITY_NET_BASE}/run-script`,
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
