const FLEET_DATA_ORIGIN = 'https://fleetdata.dolores2.xyz';

function doGet(e) {
  const parameters = e && e.parameter ? e.parameter : {};
  const action = parameters.action || '';

  try {
    let data;

    switch (action) {
      case 'getCollections':
        data = getCollections_(parameters);
        break;
      case 'getAlliance':
        data = getAlliance_(parameters.collectionId, parameters.fleetId);
        break;
      case 'getUser':
        data = getUser_(parameters.userId);
        break;
      case 'getAllianceHistory':
        data = getAllianceHistory_(parameters.fleetId, parameters);
        break;
      default:
        data = { error: 'Invalid action' };
    }

    return json_(data);
  } catch (error) {
    return json_({ error: error.message || String(error) });
  }
}

function getUser_(userId) {
  requireDigits_('userId', userId);
  return fetchJson_(`/userHistory/${userId}`);
}

function getCollections_(parameters) {
  return fetchJson_('/collections/', parameters, [
    'fromDate',
    'toDate',
    'interval',
    'desc',
    'skip',
    'take',
    'tournaments_only'
  ]);
}

function getAlliance_(collectionId, fleetId) {
  requireDigits_('collectionId', collectionId);
  requireDigits_('fleetId', fleetId);
  return fetchJson_(`/collections/${collectionId}/alliances/${fleetId}`);
}

function getAllianceHistory_(fleetId, parameters) {
  requireDigits_('fleetId', fleetId);
  return fetchJson_(`/allianceHistory/${fleetId}`, parameters, [
    'fromDate',
    'toDate',
    'interval',
    'desc',
    'skip',
    'take',
    'onMissing'
  ]);
}

function fetchJson_(path, parameters, allowedParameters) {
  const query = [];
  (allowedParameters || []).forEach(function (name) {
    const value = parameters && parameters[name];
    if (value !== undefined && value !== null && value !== '') {
      query.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
    }
  });

  const url = FLEET_DATA_ORIGIN + path + (query.length ? '?' + query.join('&') : '');
  const response = UrlFetchApp.fetch(url, {
    method: 'get',
    muteHttpExceptions: true
  });
  const status = response.getResponseCode();
  const body = response.getContentText();

  if (status < 200 || status >= 300) {
    throw new Error(`FleetData returned HTTP ${status}: ${body.slice(0, 200)}`);
  }

  return JSON.parse(body);
}

function requireDigits_(name, value) {
  if (!/^\d+$/.test(String(value || ''))) {
    throw new Error(`Invalid ${name}`);
  }
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
