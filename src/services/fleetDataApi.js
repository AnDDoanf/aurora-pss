import axios from 'axios';
import { buildFleetSnapshotQuery } from '../features/fleet/fleetSnapshotSelection';

const FALLBACK_DIRECT_URL = 'https://fleetdata.dolores2.xyz';
const SESSION_CACHE_PREFIX = 'pss:fleetdata:v1:';
const COLLECTION_CACHE_MAX_AGE_MS = 15 * 60 * 1000;
const configuredBase = String(import.meta.env.VITE_FLEET_DATA_BASE_URL || '')
  .trim()
  .replace(/\/+$/, '');
const configuredProxy = String(import.meta.env.VITE_FLEET_DATA_PROXY_URL || '')
  .trim()
  .replace(/\/+$/, '');
const baseIsAppsScript = /script\.google\.com\/macros\/s\//i.test(configuredBase);
const FLEET_DATA_PROXY_URL = configuredProxy
  || (baseIsAppsScript ? configuredBase : '');
const FLEET_DATA_BASE = (baseIsAppsScript ? '' : configuredBase)
  || (import.meta.env.DEV ? '/api-fleetdata' : FALLBACK_DIRECT_URL);

const readSessionCache = (key, maxAge = Number.POSITIVE_INFINITY) => {
  if (typeof window === 'undefined' || !window.sessionStorage) return null;
  try {
    const cached = JSON.parse(window.sessionStorage.getItem(`${SESSION_CACHE_PREFIX}${key}`));
    if (!cached || !Object.prototype.hasOwnProperty.call(cached, 'data')) return null;
    if (Date.now() - cached.cachedAt > maxAge) {
      window.sessionStorage.removeItem(`${SESSION_CACHE_PREFIX}${key}`);
      return null;
    }
    return cached.data;
  } catch {
    return null;
  }
};

const writeSessionCache = (key, data) => {
  if (typeof window === 'undefined' || !window.sessionStorage) return data;
  const storageKey = `${SESSION_CACHE_PREFIX}${key}`;
  const payload = JSON.stringify({ cachedAt: Date.now(), data });
  try {
    window.sessionStorage.setItem(storageKey, payload);
  } catch {
    try {
      const cachedEntries = [];
      for (let index = 0; index < window.sessionStorage.length; index += 1) {
        const candidateKey = window.sessionStorage.key(index);
        if (!candidateKey?.startsWith(SESSION_CACHE_PREFIX) || candidateKey === storageKey) continue;
        let cachedAt = 0;
        try {
          cachedAt = JSON.parse(window.sessionStorage.getItem(candidateKey))?.cachedAt || 0;
        } catch {
          // Invalid entries are the first candidates for removal.
        }
        cachedEntries.push({ key: candidateKey, cachedAt });
      }
      cachedEntries
        .sort((a, b) => a.cachedAt - b.cachedAt)
        .slice(0, Math.max(1, Math.ceil(cachedEntries.length / 3)))
        .forEach((entry) => window.sessionStorage.removeItem(entry.key));
      window.sessionStorage.setItem(storageKey, payload);
    } catch {
      // Storage can be unavailable or full; network data remains usable.
    }
  }
  return data;
};

const appsScriptParams = (path, params = {}) => {
  let match = path.match(/^\/allianceHistory\/(\d+)$/);
  if (match) {
    return { ...params, action: 'getAllianceHistory', fleetId: match[1] };
  }

  match = path.match(/^\/collections\/(\d+)\/alliances\/(\d+)$/);
  if (match) {
    return {
      ...params,
      action: 'getAlliance',
      collectionId: match[1],
      fleetId: match[2]
    };
  }

  match = path.match(/^\/collections\/(\d+)\/alliances$/);
  if (match) {
    return {
      ...params,
      action: 'getCollectionAlliances',
      collectionId: match[1]
    };
  }

  match = path.match(/^\/userHistory\/(\d+)$/);
  if (match) {
    return { ...params, action: 'getUser', userId: match[1] };
  }

  if (path === '/collections') {
    return { ...params, action: 'getCollections' };
  }

  throw new Error(`Unsupported FleetData proxy path: ${path}`);
};

const requestFleetData = async (path, config = {}) => {
  if (FLEET_DATA_PROXY_URL) {
    const response = await axios.get(FLEET_DATA_PROXY_URL, {
      ...config,
      params: appsScriptParams(path, config.params)
    });
    if (response.data?.error) {
      throw new Error(response.data.error);
    }
    return response;
  }

  try {
    return await axios.get(`${FLEET_DATA_BASE}${path}`, config);
  } catch (error) {
    if (FLEET_DATA_BASE === FALLBACK_DIRECT_URL) throw error;
    return axios.get(`${FALLBACK_DIRECT_URL}${path}`, config);
  }
};

const parseMember = (member, fleetName) => {
  let id, name, trophy, allianceScore, maxTrophy;

  if (Array.isArray(member)) {
    id = member[0];
    name = member[1] || `Captain #${id}`;
    trophy = typeof member[3] === 'number' ? member[3] : 0;
    allianceScore = typeof member[4] === 'number' ? member[4] : 0;
    maxTrophy = typeof member[18] === 'number' ? member[18] : trophy;
  } else {
    id = member.id;
    name = member.name || `Captain #${id}`;
    trophy = member.trophy || 0;
    allianceScore = member.alliance_score || 0;
    maxTrophy = member.highest_trophy || trophy;
  }

  return { fleet: fleetName, id, name, trophy, maxTrophy, allianceScore };
};

const utcDateKey = (value) => new Date(value).toISOString().slice(0, 10);

const addUtcDays = (value, days) => {
  const date = new Date(value);
  date.setUTCDate(date.getUTCDate() + days);
  return date;
};

const earnedSincePreviousSnapshot = (currentScore, previousScore) =>
  currentScore >= previousScore
    ? currentScore - previousScore
    : currentScore;

const memberId = (member) => Array.isArray(member) ? member[0] : member?.id;
const memberAllianceScore = (member) => {
  const score = Array.isArray(member) ? member[4] : member?.alliance_score;
  return typeof score === 'number' ? score : 0;
};
const snapshotFleetScore = (snapshot) => {
  const score = Array.isArray(snapshot?.fleet)
    ? snapshot.fleet[2]
    : snapshot?.fleet?.score;
  return typeof score === 'number' ? score : 0;
};

const mapAllianceMembers = (users, fleetId, fleetName) =>
  users.map((member) => {
    const parsed = parseMember(member, fleetName);
    const starValue = Math.max(
      Math.floor(parsed.allianceScore * 0.15),
      Math.floor(parsed.trophy / 1000)
    );

    return {
      fleet: fleetName,
      fleetId,
      id: parsed.id,
      name: parsed.name,
      trophy: parsed.trophy,
      maxTrophy: parsed.maxTrophy,
      starValue,
      totalStars: parsed.allianceScore
    };
  });

export const getRunningCollectionId = async () => {
  const cached = readSessionCache('running-collection', COLLECTION_CACHE_MAX_AGE_MS);
  if (cached) return cached;
  try {
    const response = await requestFleetData('/collections', {
      params: { tournaments_only: true }
    });

    const collections = response.data;
    if (Array.isArray(collections) && collections.length > 0) {
      // Find the collection with the highest collection_id or latest timestamp
      const sorted = [...collections].sort((a, b) => b.collection_id - a.collection_id);
      return writeSessionCache('running-collection', sorted[0].collection_id);
    }
    return 36823; // fallback active collection ID if none returned
  } catch (err) {
    console.error("Failed to fetch collection ID from FleetData API:", err);
    return 36823;
  }
};

export const getTournamentCollections = async () => {
  const cached = readSessionCache('tournament-collections', COLLECTION_CACHE_MAX_AGE_MS);
  if (cached) return cached;
  try {
    const response = await requestFleetData('/collections', {
      params: { tournaments_only: true }
    });
    const collections = (Array.isArray(response.data) ? response.data : [])
      .filter((collection) => collection?.collection_id && collection?.timestamp)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return writeSessionCache('tournament-collections', collections);
  } catch (error) {
    console.error('Failed to fetch tournament collections:', error);
    return [];
  }
};

export const getLatestFleetSnapshots = async (take = 2) => {
  const safeTake = Math.min(100, Math.max(1, Number(take) || 2));
  const cacheKey = `latest-hourly-collections:${safeTake}`;
  const cached = readSessionCache(cacheKey, COLLECTION_CACHE_MAX_AGE_MS);
  if (cached) return cached;
  try {
    const response = await requestFleetData('/collections', {
      params: { interval: 'hour', desc: true, take: safeTake }
    });
    const snapshots = (Array.isArray(response.data) ? response.data : [])
      .filter((snapshot) => snapshot?.collection_id && snapshot?.timestamp)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return writeSessionCache(cacheKey, snapshots);
  } catch (error) {
    console.error('Failed to fetch latest hourly FleetData snapshots:', error);
    return [];
  }
};

export const getFleetSnapshotAt = async (dateValue, hourValue) => {
  const params = buildFleetSnapshotQuery(dateValue, hourValue);
  if (!params) return null;
  try {
    const response = await requestFleetData('/collections', { params });
    const snapshots = Array.isArray(response.data) ? response.data : [];
    const snapshot = snapshots
      .filter((snapshot) => snapshot?.collection_id && snapshot?.timestamp)
      .sort((a, b) => params.desc
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp))[0] || null;
    if (snapshot) return snapshot;

    // Immediately after UTC reset, today's first hourly collection may not
    // exist yet. "Today" without an hour still means the latest known snapshot.
    if (!hourValue && params.desc) {
      return (await getLatestFleetSnapshots(1))[0] || null;
    }
    return null;
  } catch (error) {
    console.error(`Failed to resolve FleetData snapshot for ${dateValue || 'today'} ${hourValue || ''}:`, error);
    return null;
  }
};

export const getCollectionAlliances = async (collectionId) => {
  const cacheKey = `collection:${collectionId}:alliances:all`;
  const cached = readSessionCache(cacheKey);
  if (cached) return cached;
  try {
    const response = await requestFleetData(`/collections/${collectionId}/alliances`);
    const fleets = Array.isArray(response.data?.fleets) ? response.data.fleets : [];
    const alliances = fleets.map((fleet) => {
      if (Array.isArray(fleet)) {
        return {
          id: Number(fleet[0]),
          name: fleet[1],
          stars: Number(fleet[2]) || 0,
          divisionId: Number(fleet[3]) || 0,
          trophy: Number(fleet[4]) || 0,
          memberCount: Number(fleet[6]) || 0
        };
      }
      return {
        id: Number(fleet.id),
        name: fleet.name,
        stars: Number(fleet.score) || 0,
        divisionId: Number(fleet.division_design_id) || 0,
        trophy: Number(fleet.trophy) || 0,
        memberCount: Number(fleet.member_count) || 0
      };
    }).filter((fleet) => fleet.id && fleet.name);
    return writeSessionCache(cacheKey, alliances);
  } catch (error) {
    console.error(`Failed to fetch fleets for collection ${collectionId}:`, error);
    return [];
  }
};

export const getFleetHistory = async (fleetId, interval = 'month', take = 100) => {
  const safeInterval = ['day', 'month'].includes(interval) ? interval : 'month';
  const safeTake = Math.min(100, Math.max(1, Number(take) || 100));
  const cacheKey = `fleet-history:${fleetId}:${safeInterval}:${safeTake}`;
  const cached = readSessionCache(cacheKey, COLLECTION_CACHE_MAX_AGE_MS);
  if (cached) return cached;
  try {
    const response = await requestFleetData(`/allianceHistory/${fleetId}`, {
      params: {
        interval: safeInterval,
        desc: safeInterval === 'day',
        take: safeTake,
        onMissing: 'skip'
      }
    });
    const points = (Array.isArray(response.data) ? response.data : []).map((snapshot) => {
      const fleet = snapshot?.fleet;
      const users = Array.isArray(snapshot?.users) ? snapshot.users : [];
      return {
        collectionId: snapshot?.collection?.collection_id,
        timestamp: snapshot?.collection?.timestamp,
        fleetName: Array.isArray(fleet) ? fleet[1] : fleet?.name,
        stars: Number(Array.isArray(fleet) ? fleet[2] : fleet?.score) || 0,
        divisionId: Number(Array.isArray(fleet) ? fleet[3] : fleet?.division_design_id) || 0,
        trophy: Number(Array.isArray(fleet) ? fleet[4] : fleet?.trophy) || 0,
        memberCount: Number(Array.isArray(fleet) ? fleet[6] : fleet?.member_count) || users.length,
        totalMemberStars: users.reduce((total, user) => total + memberAllianceScore(user), 0)
      };
    }).filter((point) => point.timestamp)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return writeSessionCache(cacheKey, points);
  } catch (error) {
    console.error(`Failed to fetch history for fleet ${fleetId}:`, error);
    return [];
  }
};

export const getTournamentCollectionAlliances = async (collectionId, division = 'Div A') => {
  const cacheKey = `collection:${collectionId}:alliances:${division}`;
  const cached = readSessionCache(cacheKey);
  if (cached) return cached;
  try {
    let response;
    try {
      response = await requestFleetData(`/collections/${collectionId}/alliances`);
    } catch (proxyError) {
      if (!import.meta.env.DEV) throw proxyError;
      response = await axios.get(`/api-fleetdata/collections/${collectionId}/alliances`);
    }

    const divisionId = division === 'Div A'
      ? 1
      : division === 'Div B'
        ? 2
        : division === 'Div C'
          ? 3
          : 4;
    const fleets = Array.isArray(response.data?.fleets) ? response.data.fleets : [];

    const alliances = fleets
      .filter((fleet) => Number(Array.isArray(fleet) ? fleet[3] : fleet?.division_design_id) === divisionId)
      .map((fleet, index) => {
        if (Array.isArray(fleet)) {
          return {
            alliance_id: Number(fleet[0]),
            alliance_name: fleet[1],
            stars: Number(fleet[2]) || 0,
            division,
            trophy: Number(fleet[4]) || 0,
            members: Number(fleet[6]) || 0,
            rank: index + 1
          };
        }
        return {
          alliance_id: Number(fleet.id),
          alliance_name: fleet.name,
          stars: Number(fleet.score) || 0,
          division,
          trophy: Number(fleet.trophy) || 0,
          members: Number(fleet.member_count) || 0,
          rank: index + 1
        };
      })
      .filter((fleet) => fleet.alliance_id && fleet.alliance_name);
    return writeSessionCache(cacheKey, alliances);
  } catch (error) {
    console.error(`Failed to fetch tournament collection ${collectionId}:`, error);
    return [];
  }
};

export const getLatestAllianceData = async (fleetId, fleetName) => {
  try {
    const response = await requestFleetData(
      `/allianceHistory/${fleetId}`,
      {
        params: {
          interval: 'hour',
          desc: true,
          take: 1,
          onMissing: 'last'
        }
      }
    );
    const snapshot = Array.isArray(response.data) ? response.data[0] : null;

    if (!snapshot || !Array.isArray(snapshot.users)) {
      return { players: [], timestamp: null };
    }

    return {
      players: mapAllianceMembers(snapshot.users, fleetId, fleetName),
      timestamp: snapshot.collection?.timestamp || null
    };
  } catch (error) {
    console.error(`Failed to fetch latest alliance data for ${fleetName} (${fleetId}):`, error);
    return { players: [], timestamp: null };
  }
};

export const getAllianceTournamentProgression = async (
  fleetId,
  fleetName,
  tournamentStatus
) => {
  const cacheKey = `progression:${fleetId}:${tournamentStatus.tournamentStartDate}:${tournamentStatus.tournamentEndDate}`;
  const cached = tournamentStatus.isLive ? null : readSessionCache(cacheKey);
  if (cached) return cached;
  const tournamentStart = new Date(tournamentStatus.tournamentStartDate);
  const tournamentEnd = new Date(tournamentStatus.tournamentEndDate);
  const baselineDate = addUtcDays(tournamentStart, -1);
  const visibleDayCount = tournamentStatus.isLive
    ? tournamentStatus.currentDay
    : tournamentStatus.totalDays;
  const lastVisibleDate = tournamentStatus.isLive
    ? new Date()
    : tournamentEnd;

  const dailyResponse = await requestFleetData(
    `/allianceHistory/${fleetId}`,
    {
      params: {
        fromDate: baselineDate.toISOString(),
        toDate: lastVisibleDate.toISOString(),
        interval: 'day',
        desc: false,
        take: tournamentStatus.totalDays + 1,
        onMissing: 'last'
      }
    }
  );
  const snapshots = Array.isArray(dailyResponse.data)
    ? [...dailyResponse.data]
    : [];

  // A PSS game day resets at 00:00 UTC. Daily history contains completed UTC
  // days; add the latest hourly snapshot for the active partial UTC day.
  if (tournamentStatus.isLive) {
    const currentDayStart = new Date();
    currentDayStart.setUTCHours(0, 0, 0, 0);
    const currentResponse = await requestFleetData(
      `/allianceHistory/${fleetId}`,
      {
        params: {
          fromDate: currentDayStart.toISOString(),
          toDate: new Date().toISOString(),
          interval: 'hour',
          desc: true,
          take: 1,
          onMissing: 'skip'
        }
      }
    );
    const currentSnapshot = Array.isArray(currentResponse.data)
      ? currentResponse.data[0]
      : null;

    if (currentSnapshot) {
      const currentKey = utcDateKey(currentSnapshot.collection.timestamp);
      const existingIndex = snapshots.findIndex(
        (snapshot) => utcDateKey(snapshot.collection.timestamp) === currentKey
      );

      if (existingIndex >= 0) {
        snapshots[existingIndex] = currentSnapshot;
      } else {
        snapshots.push(currentSnapshot);
      }
    }
  }

  snapshots.sort(
    (a, b) =>
      new Date(a.collection.timestamp) - new Date(b.collection.timestamp)
  );

  const snapshotByDate = new Map(
    snapshots.map((snapshot) => [
      utcDateKey(snapshot.collection.timestamp),
      snapshot
    ])
  );
  const baselineSnapshot = snapshotByDate.get(utcDateKey(baselineDate));
  const daySnapshots = Array.from({ length: visibleDayCount }, (_, index) => {
    const date = addUtcDays(tournamentStart, index);
    const dateKey = utcDateKey(date);

    return {
      day: index + 1,
      date: dateKey,
      snapshot: snapshotByDate.get(dateKey) || null
    };
  });
  const latestSnapshot = [...daySnapshots]
    .reverse()
    .find(({ snapshot }) => snapshot)?.snapshot;

  if (!latestSnapshot) {
    return {
      members: [],
      days: daySnapshots.map(({ day, date }) => ({ day, date }))
    };
  }

  const baselineScores = new Map(
    (baselineSnapshot?.users || []).map((member) => [
      memberId(member),
      memberAllianceScore(member)
    ])
  );
  const members = (latestSnapshot.users || []).map((rawMember) => {
    const member = parseMember(rawMember, fleetName);
    let previousScore = baselineScores.get(member.id) || 0;

    const dailyStars = daySnapshots.map(({ day, date, snapshot }) => {
      const rawSnapshotMember = (snapshot?.users || []).find(
        (candidate) => String(memberId(candidate)) === String(member.id)
      );
      const currentScore = rawSnapshotMember
        ? memberAllianceScore(rawSnapshotMember)
        : previousScore;
      const earned = earnedSincePreviousSnapshot(currentScore, previousScore);
      previousScore = currentScore;

      return { day, date, earned };
    });

    return {
      ...member,
      dailyStars,
      tournamentStars: dailyStars.reduce(
        (total, day) => total + day.earned,
        0
      )
    };
  });

  const result = {
    members,
    days: daySnapshots.map(({ day, date }) => ({ day, date }))
  };
  return tournamentStatus.isLive ? result : writeSessionCache(cacheKey, result);
};

export const getAllianceTournamentAnalytics = async (
  fleetId,
  fleetName,
  tournamentPeriod
) => {
  const cacheKey = `analytics:${fleetId}:${tournamentPeriod.tournamentStartDate}:${tournamentPeriod.tournamentEndDate}`;
  const cached = tournamentPeriod.isLive ? null : readSessionCache(cacheKey);
  if (cached) return cached;
  const tournamentStart = new Date(tournamentPeriod.tournamentStartDate);
  const tournamentEnd = new Date(tournamentPeriod.tournamentEndDate);
  const baselineDate = addUtcDays(tournamentStart, -1);
  const visibleDayCount = tournamentPeriod.isLive
    ? tournamentPeriod.currentDay
    : tournamentPeriod.totalDays;
  const lastVisibleDate = tournamentPeriod.isLive ? new Date() : tournamentEnd;

  try {
    const response = await requestFleetData(`/allianceHistory/${fleetId}`, {
      params: {
        fromDate: baselineDate.toISOString(),
        toDate: lastVisibleDate.toISOString(),
        interval: 'day',
        desc: false,
        take: tournamentPeriod.totalDays + 1,
        onMissing: 'last'
      }
    });
    const snapshots = Array.isArray(response.data) ? [...response.data] : [];

    if (tournamentPeriod.isLive) {
      const currentDayStart = new Date();
      currentDayStart.setUTCHours(0, 0, 0, 0);
      const currentResponse = await requestFleetData(`/allianceHistory/${fleetId}`, {
        params: {
          fromDate: currentDayStart.toISOString(),
          toDate: new Date().toISOString(),
          interval: 'hour',
          desc: true,
          take: 1,
          onMissing: 'skip'
        }
      });
      const currentSnapshot = Array.isArray(currentResponse.data)
        ? currentResponse.data[0]
        : null;
      if (currentSnapshot) {
        const key = utcDateKey(currentSnapshot.collection.timestamp);
        const existingIndex = snapshots.findIndex(
          (snapshot) => utcDateKey(snapshot.collection.timestamp) === key
        );
        if (existingIndex >= 0) snapshots[existingIndex] = currentSnapshot;
        else snapshots.push(currentSnapshot);
      }
    }

    const snapshotByDate = new Map(
      snapshots.map((snapshot) => [utcDateKey(snapshot.collection.timestamp), snapshot])
    );
    const previousScores = new Map(
      (snapshotByDate.get(utcDateKey(baselineDate))?.users || []).map((member) => [
        String(memberId(member)),
        memberAllianceScore(member)
      ])
    );
    let previousFleetScore = snapshotFleetScore(
      snapshotByDate.get(utcDateKey(baselineDate))
    );
    const participants = new Map();
    let cumulativeStars = 0;
    const daily = [];

    for (let index = 0; index < visibleDayCount; index += 1) {
      const date = addUtcDays(tournamentStart, index);
      const snapshot = snapshotByDate.get(utcDateKey(date));
      const currentFleetScore = snapshot
        ? snapshotFleetScore(snapshot)
        : previousFleetScore;
      const earned = earnedSincePreviousSnapshot(currentFleetScore, previousFleetScore);

      for (const member of snapshot?.users || []) {
        const id = String(memberId(member));
        const currentScore = memberAllianceScore(member);
        const gained = earnedSincePreviousSnapshot(currentScore, previousScores.get(id) || 0);
        if (gained > 0) {
          const parsed = parseMember(member, fleetName);
          const participant = participants.get(id) || {
            id: parsed.id,
            name: parsed.name,
            tournamentStars: 0,
            dailyStars: Array(visibleDayCount).fill(0)
          };
          participant.name = parsed.name;
          participant.tournamentStars += gained;
          participant.dailyStars[index] += gained;
          participants.set(id, participant);
        }
        previousScores.set(id, currentScore);
      }

      previousFleetScore = currentFleetScore;
      cumulativeStars += earned;
      daily.push({
        day: index + 1,
        date: utcDateKey(date),
        earned,
        cumulativeStars
      });
    }

    const result = {
      fleetId,
      fleetName,
      participantCount: participants.size,
      participants: [...participants.values()].sort(
        (a, b) => b.tournamentStars - a.tournamentStars
      ),
      totalStars: cumulativeStars,
      daily
    };
    return tournamentPeriod.isLive ? result : writeSessionCache(cacheKey, result);
  } catch (error) {
    console.error(`Failed to calculate tournament analytics for ${fleetName} (${fleetId}):`, error);
    return {
      fleetId,
      fleetName,
      participantCount: 0,
      participants: [],
      totalStars: 0,
      daily: []
    };
  }
};

export const getAllianceDataFromCollection = async (collectionId, fleetId, fleetName) => {
  const cacheKey = `collection:${collectionId}:fleet:${fleetId}:members`;
  const cached = readSessionCache(cacheKey);
  if (cached) return cached;
  try {
    const response = await requestFleetData(
      `/collections/${collectionId}/alliances/${fleetId}`
    );

    const alliance = response.data;
    
    if (alliance && Array.isArray(alliance.users)) {
      return writeSessionCache(
        cacheKey,
        mapAllianceMembers(alliance.users, fleetId, fleetName)
      );
    }
    return [];
  } catch (err) {
    console.error(`Failed to fetch alliance data for ${fleetName} (${fleetId}):`, err);
    return [];
  }
};

export const getUserHistory = async (userId) => {
  const cacheKey = `user-history:${userId}`;
  const cached = readSessionCache(cacheKey, COLLECTION_CACHE_MAX_AGE_MS);
  if (cached) return cached;
  try {
    const response = await requestFleetData(`/userHistory/${userId}`);

    if (Array.isArray(response.data)) {
      const historyList = response.data.map(item => {
        const timestamp = item.collection?.timestamp;
        
        let fleetName = 'Unknown';
        let divisionId = 1;
        if (Array.isArray(item.fleet)) {
          fleetName = item.fleet[1] || 'Unknown';
          divisionId = item.fleet[3] || 1;
        } else if (item.fleet) {
          fleetName = item.fleet.name || 'Unknown';
          divisionId = item.fleet.division_design_id || 1;
        }

        const divisionName = divisionId === 1 ? 'Div A' :
                             divisionId === 2 ? 'Div B' :
                             divisionId === 3 ? 'Div C' :
                             divisionId === 4 ? 'Div D' : 'Div A';

        const user = item.user;
        let id, name, trophy, allianceScore, maxTrophy;

        if (Array.isArray(user)) {
          id = user[0];
          name = user[1] || `Captain #${id}`;
          trophy = typeof user[3] === 'number' ? user[3] : 0;
          allianceScore = typeof user[4] === 'number' ? user[4] : 0;
          maxTrophy = typeof user[18] === 'number' ? user[18] : trophy;
        } else if (user) {
          id = user.id;
          name = user.name || `Captain #${id}`;
          trophy = user.trophy || 0;
          allianceScore = user.alliance_score || 0;
          maxTrophy = user.highest_trophy || trophy;
        }

        const starValue = Math.max(
          Math.floor(allianceScore * 0.15),
          Math.floor(trophy / 1000)
        );

        return {
          timestamp,
          date: timestamp ? new Date(timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A',
          fleetName,
          division: divisionName,
          id,
          name,
          trophy,
          maxTrophy,
          totalStars: allianceScore,
          starValue
        };
      });

      // Sort descending by timestamp so closest/most recent date is on top!
      historyList.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

      // Extract unique past names used by this user over time
      const pastNames = Array.from(new Set(historyList.map(h => h.name).filter(Boolean)));

      return writeSessionCache(cacheKey, {
        historyList,
        pastNames
      });
    }
    return { historyList: [], pastNames: [] };
  } catch (err) {
    console.error(`Failed to fetch user history for #${userId}:`, err);
    return { historyList: [], pastNames: [] };
  }
};
