import axios from 'axios';

const DEFAULT_TIMEOUT_MS = 5000;

/**
 * Execute a third-party API request with strict isolation, timeout, and fallback object on error
 */
export async function fetchThirdPartyData(serviceName, url, fallbackData = null) {
  const startTime = Date.now();
  try {
    const response = await axios.get(url, {
      timeout: DEFAULT_TIMEOUT_MS,
      headers: {
        'Accept': 'application/json, text/plain, */*'
      }
    });

    return {
      serviceName,
      status: 'OK',
      fetchedAt: new Date().toISOString(),
      latencyMs: Date.now() - startTime,
      isThirdParty: true,
      data: response.data
    };
  } catch (err) {
    console.warn(`[ThirdPartyAdapter] Service '${serviceName}' request failed: ${err.message}. Degrading gracefully to fallback.`);
    return {
      serviceName,
      status: 'FAILED',
      error: err.message,
      fetchedAt: new Date().toISOString(),
      isThirdParty: true,
      data: fallbackData
    };
  }
}
