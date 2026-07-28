// LocalStorage and CSV Import/Export Service for Star Targeting Logs

const STORAGE_KEY = 'pss_star_targeting_statuses';

export const getTargetStatuses = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error("Failed to load target statuses from localStorage:", err);
    return {};
  }
};

export const setTargetStatus = (playerId, status) => {
  const current = getTargetStatuses();
  if (!status) {
    delete current[playerId];
  } else {
    current[playerId] = {
      status, // 'W', 'L', 'U'
      updatedAt: new Date().toISOString()
    };
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error("Failed to save target status:", err);
  }
  return current;
};

export const exportToCSV = (targets) => {
  // Format matching user's original star_targeting.csv: ["Fleet", "Id", "Name", "Trophy", "Max Trophy", "Star Value", "Total Stars", "Status"]
  const headers = ["Fleet", "Id", "Name", "Trophy", "Max Trophy", "Star Value", "Total Stars", "Status"];
  const rows = targets.map(t => [
    `"${(t.fleet || '').replace(/"/g, '""')}"`,
    t.id,
    `"${(t.name || '').replace(/"/g, '""')}"`,
    t.trophy,
    t.maxTrophy,
    t.starValue,
    t.totalStars,
    t.status || ''
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `star_targeting_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
