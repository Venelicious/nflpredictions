// core/utils.js
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

export function normalizeTeamKey(label = '') {
  return label.toLowerCase().replace(/[^a-z0-9 ]/gi, ' ').replace(/\s+/g, ' ').trim();
}

export function splitTeamName(teamName) {
  const parts = teamName.split(' ');
  if (parts.length === 1) return { city: teamName, alias: '' };
  const alias = parts.pop();
  return { city: parts.join(' '), alias };
}

export function sortByName(list) {
  return [...list].sort((a, b) =>
    (a?.name || a?.email || '').localeCompare(b?.name || b?.email || '', 'de')
  );
}

export function generateUUID() {
  return crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}