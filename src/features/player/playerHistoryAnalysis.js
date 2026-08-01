const byTimestamp = (a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0);

export function buildFleetMembershipHistory(historyList = []) {
  const chronological = [...historyList].filter((entry) => entry.timestamp).sort(byTimestamp);
  const periods = [];
  chronological.forEach((entry) => {
    const fleetName = entry.fleetName || 'Unknown';
    const current = periods.at(-1);
    if (!current || current.fleetName !== fleetName) {
      periods.push({
        fleetName,
        joinedAt: entry.timestamp,
        leftAt: entry.timestamp,
        firstTrophy: entry.trophy || 0,
        lastTrophy: entry.trophy || 0,
        records: 1
      });
    } else {
      current.leftAt = entry.timestamp;
      current.lastTrophy = entry.trophy || 0;
      current.records += 1;
    }
  });
  return periods.reverse();
}

export function buildTournamentHistory(historyList = []) {
  const finalsByMonth = new Map();
  historyList.filter((entry) => entry.timestamp && entry.tournamentRunning).forEach((entry) => {
    const month = new Date(entry.timestamp).toISOString().slice(0, 7);
    const current = finalsByMonth.get(month);
    if (!current || new Date(entry.timestamp) > new Date(current.timestamp)) {
      finalsByMonth.set(month, { ...entry, month });
    }
  });
  return [...finalsByMonth.values()].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export function buildMonthlyPlayerHistory(historyList = []) {
  const latestByMonth = new Map();
  historyList.filter((entry) => entry.timestamp).forEach((entry) => {
    const month = new Date(entry.timestamp).toISOString().slice(0, 7);
    const current = latestByMonth.get(month);
    if (!current || new Date(entry.timestamp) > new Date(current.timestamp)) latestByMonth.set(month, entry);
  });
  return [...latestByMonth.values()].sort(byTimestamp);
}
