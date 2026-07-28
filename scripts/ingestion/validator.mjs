import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';

const MIN_EXPECTED_RECORDS = {
  'CharacterService/ListAllCharacterDesigns2': 50,
  'RoomService/ListRoomDesigns2': 30,
  'ShipService/ListAllShipDesigns2': 10,
  'ItemService/ListItemDesigns2': 50,
  'FileService/ListFiles4': 100,
  'FileService/ListSprites2': 100,
  'ResearchService/ListAllResearchDesigns2': 20
};

const OPTIONAL_OR_EMPTY_ENDPOINTS = new Set([
  'DesignService/ListAllDesigns7',
  'DesignService/ListAllDynamicDesigns',
  'DesignService/ListAllStaticDesigns2',
  'GalaxyService/ListPlanets',
  'SettingService/GetLatestVersion4'
]);

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  parseAttributeValue: true,
  processEntities: false
});

function extractRecordsFromObject(obj) {
  if (!obj || typeof obj !== 'object') return [];
  if (Array.isArray(obj)) return obj;
  
  const keys = Object.keys(obj);
  for (const k of keys) {
    if (Array.isArray(obj[k])) {
      return obj[k];
    }
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      const nested = extractRecordsFromObject(obj[k]);
      if (nested.length > 0) return nested;
    }
  }
  return [];
}

/**
 * Validate parsed XML object for a given endpoint
 */
export function validateEndpointPayload(endpoint, xmlContent) {
  if (!xmlContent || typeof xmlContent !== 'string') {
    return { valid: false, reason: 'Empty or invalid content payload' };
  }

  let parsed;
  try {
    parsed = xmlParser.parse(xmlContent);
  } catch (err) {
    return { valid: false, reason: `XML parse syntax error: ${err.message}` };
  }

  if (!parsed || typeof parsed !== 'object') {
    return { valid: false, reason: 'Parsed XML is null or not an object' };
  }

  // Check for API error response envelopes
  if (parsed.Error || parsed.Fault || parsed.error) {
    const errorMsg = parsed.Error?.Message || parsed.Error || 'Upstream service error envelope';
    return { valid: false, reason: `API error envelope detected: ${JSON.stringify(errorMsg)}` };
  }

  const records = extractRecordsFromObject(parsed);
  const count = records.length;
  const minThreshold = MIN_EXPECTED_RECORDS[endpoint] || 1;

  if (count < minThreshold && !OPTIONAL_OR_EMPTY_ENDPOINTS.has(endpoint)) {
    return {
      valid: false,
      reason: `Record count (${count}) is below safety threshold (${minThreshold}) for endpoint '${endpoint}'`
    };
  }

  return {
    valid: true,
    recordCount: count,
    isOptional: OPTIONAL_OR_EMPTY_ENDPOINTS.has(endpoint),
    sampleRecord: records[0] || null
  };
}

/**
 * Validate all fetched snapshot files in snapshot directory
 */
export function validateSnapshotDirectory(snapshotDir) {
  const rawDir = path.join(snapshotDir, 'raw');
  const manifestPath = path.join(snapshotDir, 'fetch_manifest.json');

  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Fetch manifest missing at ${manifestPath}`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const report = {
    timestamp: new Date().toISOString(),
    totalEndpoints: manifest.length,
    validEndpoints: 0,
    failedEndpoints: 0,
    details: {}
  };

  let criticalFailure = false;

  for (const item of manifest) {
    const filePath = path.join(rawDir, item.filename);
    if (!fs.existsSync(filePath)) {
      report.details[item.endpoint] = { valid: false, reason: 'File missing on disk' };
      report.failedEndpoints++;
      criticalFailure = true;
      continue;
    }

    const xmlContent = fs.readFileSync(filePath, 'utf8');
    const result = validateEndpointPayload(item.endpoint, xmlContent);

    report.details[item.endpoint] = result;

    if (result.valid) {
      report.validEndpoints++;
    } else {
      report.failedEndpoints++;
      // Check if endpoint is critical
      if (MIN_EXPECTED_RECORDS[item.endpoint]) {
        criticalFailure = true;
      }
    }
  }

  report.status = criticalFailure ? 'FAILED' : 'PASSED';
  
  const reportPath = path.join(snapshotDir, 'validation_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

  console.log(`[Validator] Validation finished. Status: ${report.status} (${report.validEndpoints}/${report.totalEndpoints} endpoints valid)`);
  return report;
}
