import axios from 'axios';

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
      formData
    );

    return response.data; // { status: 'success', message: '...', output: '...' }
  } catch (err) {
    console.error("Failed to run prestige pathfinder on pss.reality.net:", err);
    return {
      status: 'error',
      message: err.message || 'Failed to connect to pss.reality.net backend.'
    };
  }
};
