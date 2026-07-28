import { fetchThirdPartyData } from './thirdPartyAdapter';

export async function getFleetDataMarketPrices(itemDesignId) {
  const url = `/api-fleetdata/prices?itemDesignId=${itemDesignId}`;
  return fetchThirdPartyData('FleetData Analytics', url, { history: [] });
}

export async function getPixyShipItemHistory(itemDesignId) {
  const url = `/api-pixyship/item/${itemDesignId}/history`;
  return fetchThirdPartyData('PixyShip API', url, { sales: [] });
}

export async function getRealityDataStats() {
  const url = `/api-reality/stats`;
  return fetchThirdPartyData('Reality PSS', url, { stats: {} });
}
