import axios from 'axios';

const PSS_API_BASE = typeof window !== 'undefined' ? '/api-pss' : 'http://api.pixelstarships.com';
const FALLBACK_DIRECT_URL = 'http://api.pixelstarships.com';

export const getTournamentStatus = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const dayOfMonth = now.getUTCDate();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const tournamentStartDay = daysInMonth - 6; // last 7 days of every month

  const isLive = dayOfMonth >= tournamentStartDay;
  const tournamentMonth = isLive ? month : month - 1;
  const tournamentYear = tournamentMonth < 0 ? year - 1 : year;
  const normalizedTournamentMonth = (tournamentMonth + 12) % 12;
  const tournamentEndDay = new Date(
    Date.UTC(tournamentYear, normalizedTournamentMonth + 1, 0)
  ).getUTCDate();
  const tournamentStartDate = new Date(
    Date.UTC(tournamentYear, normalizedTournamentMonth, tournamentEndDay - 6)
  );
  const tournamentEndDate = new Date(
    Date.UTC(tournamentYear, normalizedTournamentMonth, tournamentEndDay, 23, 59, 59)
  );
  const currentDay = isLive
    ? Math.min(7, Math.max(1, dayOfMonth - tournamentStartDay + 1))
    : 7;
  const monthName = tournamentStartDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });

  return {
    isLive,
    currentDay,
    totalDays: 7,
    monthName,
    tournamentStartDate: tournamentStartDate.toISOString(),
    tournamentEndDate: tournamentEndDate.toISOString(),
    statusLabel: isLive ? `LIVE TOURNAMENT ACTIVE — Tournament Week (Day ${currentDay} of 7)` : `LATEST COMPLETED TOURNAMENT — ${monthName} Final Standings`,
    daysRemaining: isLive ? (daysInMonth - dayOfMonth) : 0
  };
};

export const getAllianceRankingsWithDivisions = async (skip = 0, take = 100) => {
  try {
    let response;
    try {
      response = await axios.get(`${PSS_API_BASE}/AllianceService/ListAlliancesByRanking`, {
        params: { skip, take }
      });
    } catch (e) {
      response = await axios.get(`${FALLBACK_DIRECT_URL}/AllianceService/ListAlliancesByRanking`, {
        params: { skip, take }
      });
    }

    const xmlData = typeof response.data === 'string' ? response.data : String(response.data);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");
    const allianceNodes = xmlDoc.getElementsByTagName("Alliance");

    const divisions = {
      'Div A': [],
      'Div B': [],
      'Div C': [],
      'Div D': []
    };

    for (let i = 0; i < allianceNodes.length; i++) {
      const node = allianceNodes[i];
      const name = node.getAttribute("AllianceName");
      const id = node.getAttribute("AllianceId");
      const trophy = parseInt(node.getAttribute("Trophy") || "0", 10);
      const score = parseInt(node.getAttribute("Score") || "0", 10);
      const divId = parseInt(node.getAttribute("DivisionDesignId") || "1", 10);
      const members = parseInt(node.getAttribute("NumberOfMembers") || "100", 10);

      const divKey = divId === 1 ? 'Div A' :
                     divId === 2 ? 'Div B' :
                     divId === 3 ? 'Div C' : 'Div D';

      if (name && id) {
        divisions[divKey].push({
          rank: divisions[divKey].length + 1,
          overallRank: i + 1,
          id: parseInt(id, 10),
          fleet: name,
          stars: score,
          trophy: trophy,
          members: members,
          trophyAvg: members > 0 ? Math.round(trophy / members) : 0,
          division: divKey
        });
      }
    }
    return divisions;
  } catch (err) {
    console.error("Failed to fetch alliance rankings with divisions:", err);
    // Fallback division list
    return {
      'Div A': [
        { rank: 1, overallRank: 1, id: 9343, fleet: 'Trek Federation', stars: 6426, trophy: 596283, members: 100, trophyAvg: 5962, division: 'Div A' },
        { rank: 2, overallRank: 2, id: 43776, fleet: 'Summit', stars: 5631, trophy: 568328, members: 100, trophyAvg: 5683, division: 'Div A' },
        { rank: 3, overallRank: 3, id: 23429, fleet: 'Red Barons', stars: 5420, trophy: 547840, members: 100, trophyAvg: 5478, division: 'Div A' },
        { rank: 4, overallRank: 4, id: 14349, fleet: 'Dynasty', stars: 5253, trophy: 535557, members: 100, trophyAvg: 5355, division: 'Div A' },
        { rank: 5, overallRank: 5, id: 12008, fleet: 'Trek Pastafarians', stars: 2589, trophy: 492245, members: 100, trophyAvg: 4922, division: 'Div A' },
        { rank: 6, overallRank: 6, id: 22572, fleet: 'Firefly Vikings', stars: 1941, trophy: 478795, members: 99, trophyAvg: 4836, division: 'Div A' }
      ],
      'Div B': [
        { rank: 1, overallRank: 7, id: 1234, fleet: 'Soltan Empire', stars: 4089, trophy: 476835, members: 99, trophyAvg: 4816, division: 'Div B' },
        { rank: 2, overallRank: 8, id: 1235, fleet: 'Eternal Gensokyo', stars: 4711, trophy: 461623, members: 89, trophyAvg: 5186, division: 'Div B' }
      ],
      'Div C': [
        { rank: 1, overallRank: 19, id: 1236, fleet: 'China Fleet', stars: 1283, trophy: 346204, members: 93, trophyAvg: 3722, division: 'Div C' }
      ],
      'Div D': [
        { rank: 1, overallRank: 41, id: 1237, fleet: 'Pioneer Squadron', stars: 850, trophy: 210000, members: 80, trophyAvg: 2625, division: 'Div D' }
      ]
    };
  }
};

export const getDivisionAlliances = async (skip = 0, take = 6) => {
  try {
    let response;
    try {
      response = await axios.get(`${PSS_API_BASE}/AllianceService/ListAlliancesByRanking`, {
        params: { skip, take }
      });
    } catch (e) {
      response = await axios.get(`${FALLBACK_DIRECT_URL}/AllianceService/ListAlliancesByRanking`, {
        params: { skip, take }
      });
    }
    
    // Parse XML string response from SavySoda PSS API
    const xmlData = typeof response.data === 'string' ? response.data : String(response.data);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");
    const allianceNodes = xmlDoc.getElementsByTagName("Alliance");

    const result = [];
    for (let i = 0; i < allianceNodes.length; i++) {
      const node = allianceNodes[i];
      const name = node.getAttribute("AllianceName");
      const id = node.getAttribute("AllianceId");
      const trophy = node.getAttribute("Trophy");
      const score = node.getAttribute("Score");
      if (name && id) {
        result.push({
          alliance_name: name,
          alliance_id: parseInt(id, 10),
          trophy: parseInt(trophy || '0', 10),
          score: parseInt(score || '0', 10)
        });
      }
    }
    return result;
  } catch (err) {
    console.error("Failed to fetch division alliances from api.pixelstarships.com:", err);
    // Fallback Division A alliances from app_star_checker
    return [
      { alliance_name: "Trek Federation", alliance_id: 9343 },
      { alliance_name: "Summit", alliance_id: 43776 },
      { alliance_name: "Red Barons", alliance_id: 23429 },
      { alliance_name: "Dynasty", alliance_id: 14349 },
      { alliance_name: "Trek Pastafarians", alliance_id: 12008 },
      { alliance_name: "Firefly Vikings", alliance_id: 22572 }
    ];
  }
};

export const searchUsers = async (searchStr) => {
  try {
    let response;
    try {
      response = await axios.get(`${PSS_API_BASE}/UserService/SearchUsers`, {
        params: { searchString: searchStr }
      });
    } catch (e) {
      response = await axios.get(`${FALLBACK_DIRECT_URL}/UserService/SearchUsers`, {
        params: { searchString: searchStr }
      });
    }

    const xmlData = typeof response.data === 'string' ? response.data : String(response.data);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");
    const userNodes = xmlDoc.getElementsByTagName("User");

    const users = [];
    for (let i = 0; i < userNodes.length; i++) {
      const node = userNodes[i];
      users.push({
        id: node.getAttribute("Id"),
        name: node.getAttribute("Name"),
        trophy: parseInt(node.getAttribute("Trophy") || "0", 10),
        highestTrophy: parseInt(node.getAttribute("HighestTrophy") || node.getAttribute("Trophy") || "0", 10),
        allianceName: node.getAttribute("AllianceName") || "No Fleet",
        allianceId: node.getAttribute("AllianceId") || "0",
        shipDesignId: parseInt(node.getAttribute("ShipDesignId") || "0", 10),
        pvpWins: parseInt(node.getAttribute("PVPAttackWins") || "0", 10),
        pvpLosses: parseInt(node.getAttribute("PVPAttackLosses") || "0", 10),
        pvpDraws: parseInt(node.getAttribute("PVPAttackDraws") || "0", 10),
        crewDonated: parseInt(node.getAttribute("CrewDonated") || "0", 10),
        crewReceived: parseInt(node.getAttribute("CrewReceived") || "0", 10),
        allianceScore: parseInt(node.getAttribute("AllianceScore") || "0", 10)
      });
    }
    return users;
  } catch (err) {
    console.error("Failed to search users on PSS API:", err);
    return [];
  }
};
