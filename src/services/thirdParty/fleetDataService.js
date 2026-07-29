import { fetchThirdPartyData } from './thirdPartyAdapter';

const FLEET_DATA_BASE = import.meta.env.VITE_FLEET_DATA_BASE_URL
  || (import.meta.env.DEV ? '/api-fleetdata' : 'https://fleetdata.dolores2.xyz');
const PIXYSHIP_BASE = import.meta.env.VITE_PIXYSHIP_API_BASE_URL
  || (import.meta.env.DEV ? '/api-pixyship' : 'https://pixyship.com/api');
const REALITY_BASE = import.meta.env.VITE_REALITY_API_BASE_URL
  || (import.meta.env.DEV ? '/api-reality' : 'https://pss.reality.net');

export async function getFleetDataMarketPrices(itemDesignId) {
  const url = `${FLEET_DATA_BASE}/prices?itemDesignId=${itemDesignId}`;
  return fetchThirdPartyData('FleetData Analytics', url, { history: [] });
}

export async function getPixyShipItemHistory(itemDesignId) {
  const url = `${PIXYSHIP_BASE}/item/${itemDesignId}/history`;
  return fetchThirdPartyData('PixyShip API', url, { sales: [] });
}

export async function getRealityDataStats() {
  const url = `${REALITY_BASE}/stats`;
  return fetchThirdPartyData('Reality PSS', url, { stats: {} });
}
