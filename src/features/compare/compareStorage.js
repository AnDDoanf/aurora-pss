const COMPARE_STORAGE_PREFIX = 'pss_compare_selection';
const MAX_COMPARE_ITEMS = 4;

function normalizeIds(ids) {
  return [...new Set((ids || []).map(String).filter(Boolean))].slice(0, MAX_COMPARE_ITEMS);
}

export function getStoredCompareIds(type) {
  try {
    const stored = localStorage.getItem(`${COMPARE_STORAGE_PREFIX}:${type}`);
    return stored ? normalizeIds(JSON.parse(stored)) : [];
  } catch {
    return [];
  }
}

export function setStoredCompareIds(type, ids) {
  const normalized = normalizeIds(ids);
  try {
    localStorage.setItem(`${COMPARE_STORAGE_PREFIX}:${type}`, JSON.stringify(normalized));
  } catch {
    // Comparison still works for this session when storage is unavailable.
  }
  return normalized;
}

