import axios from 'axios';

const FALLBACK_DIRECT_URL = 'https://fleetdata.dolores2.xyz';
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
  try {
    const response = await requestFleetData('/collections', {
      params: { tournaments_only: true }
    });

    const collections = response.data;
    if (Array.isArray(collections) && collections.length > 0) {
      // Find the collection with the highest collection_id or latest timestamp
      const sorted = [...collections].sort((a, b) => b.collection_id - a.collection_id);
      return sorted[0].collection_id;
    }
    return 36823; // fallback active collection ID if none returned
  } catch (err) {
    console.error("Failed to fetch collection ID from FleetData API:", err);
    return 36823;
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

  return {
    members,
    days: daySnapshots.map(({ day, date }) => ({ day, date }))
  };
};

export const getAllianceDataFromCollection = async (collectionId, fleetId, fleetName) => {
  try {
    const response = await requestFleetData(
      `/collections/${collectionId}/alliances/${fleetId}`
    );

    const alliance = response.data;
    
    if (alliance && Array.isArray(alliance.users)) {
      return mapAllianceMembers(alliance.users, fleetId, fleetName);
    }
    return [];
  } catch (err) {
    console.error(`Failed to fetch alliance data for ${fleetName} (${fleetId}):`, err);
    return [];
  }
};

export const getUserHistory = async (userId) => {
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

      return {
        historyList,
        pastNames
      };
    }
    return { historyList: [], pastNames: [] };
  } catch (err) {
    console.error(`Failed to fetch user history for #${userId}:`, err);
    return { historyList: [], pastNames: [] };
  }
};
