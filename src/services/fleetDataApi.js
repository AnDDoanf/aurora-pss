import axios from 'axios';

// Use Vite proxy route in browser environment to prevent CORS issues
const FLEET_DATA_BASE = typeof window !== 'undefined' ? '/api-fleetdata' : 'https://fleetdata.dolores2.xyz';
const FALLBACK_DIRECT_URL = 'https://fleetdata.dolores2.xyz';

const requestFleetData = async (path, config = {}) => {
  try {
    return await axios.get(`${FLEET_DATA_BASE}${path}`, config);
  } catch (error) {
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

export const getRunningCollectionId = async () => {
  try {
    // 1. Try querying recent tournament collection via proxy or direct endpoint
    let response;
    try {
      response = await axios.get(`${FLEET_DATA_BASE}/collections`, {
        params: { tournaments_only: true }
      });
    } catch (e) {
      response = await axios.get(`${FALLBACK_DIRECT_URL}/collections`, {
        params: { tournaments_only: true }
      });
    }

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

  // Daily history only contains completed UTC days. Add the latest snapshot
  // for today's partial day while a tournament is active.
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
      member[0],
      typeof member[4] === 'number' ? member[4] : 0
    ])
  );
  const members = (latestSnapshot.users || []).map((rawMember) => {
    const member = parseMember(rawMember, fleetName);
    let previousScore = baselineScores.get(member.id) || 0;

    const dailyStars = daySnapshots.map(({ day, date, snapshot }) => {
      const rawSnapshotMember = (snapshot?.users || []).find(
        (candidate) => candidate[0] === member.id
      );
      const currentScore = rawSnapshotMember
        ? (typeof rawSnapshotMember[4] === 'number' ? rawSnapshotMember[4] : 0)
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
    let response;
    try {
      response = await axios.get(`${FLEET_DATA_BASE}/collections/${collectionId}/alliances/${fleetId}`);
    } catch (e) {
      response = await axios.get(`${FALLBACK_DIRECT_URL}/collections/${collectionId}/alliances/${fleetId}`);
    }

    const alliance = response.data;
    
    if (alliance && Array.isArray(alliance.users)) {
      return alliance.users.map(member => {
        let id, name, trophy, maxTrophy, allianceScore;

        if (Array.isArray(member)) {
          // Member format returned by FleetData API is a tuple/array:
          // [0: id, 1: name, 2: alliance_id, 3: trophy, 4: alliance_score, ..., 18: highest_trophy]
          id = member[0];
          name = member[1] || `Captain #${id}`;
          trophy = typeof member[3] === 'number' ? member[3] : 0;
          allianceScore = typeof member[4] === 'number' ? member[4] : 0;
          maxTrophy = typeof member[18] === 'number' ? member[18] : trophy;
        } else {
          // Fallback object format if API structure changes
          id = member.id;
          name = member.name || `Captain #${id}`;
          trophy = member.trophy || 0;
          allianceScore = member.alliance_score || 0;
          maxTrophy = member.highest_trophy || trophy;
        }

        // Star calculation formula matching app_star_checker/main.py:
        // stars = max(floor(alliance_score * 0.15), floor(trophy / 1000))
        const starValue = Math.max(
          Math.floor(allianceScore * 0.15),
          Math.floor(trophy / 1000)
        );

        return {
          fleet: fleetName,
          id: id,
          name: name,
          trophy: trophy,
          maxTrophy: maxTrophy,
          starValue: starValue,
          totalStars: allianceScore
        };
      });
    }
    return [];
  } catch (err) {
    console.error(`Failed to fetch alliance data for ${fleetName} (${fleetId}):`, err);
    return [];
  }
};

export const getUserHistory = async (userId) => {
  try {
    let response;
    try {
      response = await axios.get(`${FLEET_DATA_BASE}/userHistory/${userId}`);
    } catch (e) {
      response = await axios.get(`${FALLBACK_DIRECT_URL}/userHistory/${userId}`);
    }

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
