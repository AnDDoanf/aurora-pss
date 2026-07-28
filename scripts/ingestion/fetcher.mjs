import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import axios from 'axios';

const PRIMARY_HOST = 'https://api.pixelstarships.com';
const USER_AGENT = 'PSS-Guide-Library-Ingestion/1.0 (Public Reference App)';
const TIMEOUT_MS = 15000;
const RETRY_LIMIT = 3;

export const ENDPOINTS = [
  'AchievementService/ListAchievementDesigns2',
  'AnimationService/ListAnimations',
  'BackgroundService/ListBackgrounds',
  'ChallengeService/ListAllChallengeDesigns2',
  'CollectionService/ListAllCollectionDesigns',
  'DesignService/ListAllDesigns7',
  'DesignService/ListAllDynamicDesigns',
  'DesignService/ListAllStaticDesigns2',
  'DivisionService/ListAllDivisionDesigns2',
  'LeagueService/ListLeagues2',
  'PromotionService/ListAllPromotionDesigns2',
  'RewardService/ListAllRewardDesigns2',
  'SeasonService/ListAllSeasonDesigns',
  'SettingService/ListAllNewsDesigns',
  'SituationService/ListSituationDesigns',
  'TaskService/ListAllTaskDesigns2',
  'CharacterService/ListAllCharacterDesigns2',
  'CharacterService/ListAllCharacterDesignActions',
  'CharacterService/ListAllDrawDesigns',
  'TrainingService/ListAllTrainingDesigns2',
  'ItemService/ListItemDesigns2',
  'ItemService/ListItemDesignActions',
  'RoomService/ListRoomDesigns2',
  'RoomService/ListRoomDesignPurchase',
  'RoomService/ListCraftDesigns',
  'RoomService/ListMissileDesigns',
  'RoomService/ListActionTypes2',
  'RoomService/ListConditionTypes2',
  'RoomDesignSpriteService/ListRoomDesignSprites2',
  'ShipService/ListAllShipDesigns2',
  'UserService/ListSkins2',
  'UserService/ListSkinSets2',
  'ResearchService/ListAllResearchDesigns2',
  'MissionService/ListAllMissionDesigns4',
  'GalaxyService/ListStarSystems',
  'GalaxyService/ListStarSystemLinks',
  'GalaxyService/ListPlanets',
  'GalaxyService/ListInfrastructureDesigns',
  'GalaxyService/ListStarSystemInfrastructureDesigns',
  'GalaxyService/ListMarkerGeneratorDesigns',
  'FileService/ListFiles4',
  'FileService/ListSprites2',
  'SettingService/GetLatestVersion4'
];

/**
 * Delay execution for rate-limiting
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Compute MD5 hash of raw string content
 */
export function computeHash(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * Fetch a single XML endpoint with retries and exponential backoff
 */
export async function fetchEndpoint(endpoint, lang = 'en', deviceType = 'Windows') {
  const url = `${PRIMARY_HOST}/${endpoint}?languageKey=${lang}&deviceType=${deviceType}`;
  let attempt = 0;
  
  while (attempt < RETRY_LIMIT) {
    attempt++;
    try {
      const response = await axios.get(url, {
        timeout: TIMEOUT_MS,
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'application/xml, text/xml, */*'
        },
        responseType: 'text'
      });

      if (response.status === 200 && response.data) {
        const hash = computeHash(response.data);
        return {
          endpoint,
          url,
          status: response.status,
          hash,
          byteLength: Buffer.byteLength(response.data, 'utf8'),
          data: response.data,
          fetchedAt: new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn(`[Fetcher] Attempt ${attempt}/${RETRY_LIMIT} failed for ${endpoint}: ${err.message}`);
      if (attempt < RETRY_LIMIT) {
        await sleep(1000 * Math.pow(2, attempt - 1));
      } else {
        throw new Error(`Failed to fetch ${endpoint} after ${RETRY_LIMIT} attempts: ${err.message}`);
      }
    }
  }
}

/**
 * Fetch all 43 catalog endpoints sequentially and persist raw files in the target directory
 */
export async function fetchAllSnapshots(outputDir, lang = 'en') {
  const rawDir = path.join(outputDir, 'raw');
  fs.mkdirSync(rawDir, { recursive: true });

  const manifest = [];
  console.log(`[Fetcher] Starting fetch for ${ENDPOINTS.length} XML endpoints to ${rawDir}...`);

  for (let i = 0; i < ENDPOINTS.length; i++) {
    const endpoint = ENDPOINTS[i];
    console.log(`[Fetcher] [${i + 1}/${ENDPOINTS.length}] Fetching ${endpoint}...`);
    
    try {
      const result = await fetchEndpoint(endpoint, lang);
      const safeFilename = endpoint.replace(/\//g, '_') + '.xml';
      const rawFilePath = path.join(rawDir, safeFilename);
      
      fs.writeFileSync(rawFilePath, result.data, 'utf8');

      manifest.push({
        endpoint: result.endpoint,
        filename: safeFilename,
        hash: result.hash,
        byteLength: result.byteLength,
        fetchedAt: result.fetchedAt,
        status: 'OK'
      });

      // Small delay between requests to be respectful to server
      await sleep(150);
    } catch (err) {
      console.error(`[Fetcher] Error fetching ${endpoint}: ${err.message}`);
      manifest.push({
        endpoint,
        status: 'FAILED',
        error: err.message,
        fetchedAt: new Date().toISOString()
      });
    }
  }

  const manifestPath = path.join(outputDir, 'fetch_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`[Fetcher] Ingestion fetch complete. Manifest written to ${manifestPath}`);
  return manifest;
}
