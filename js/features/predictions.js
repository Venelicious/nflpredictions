// features/predictions.js
import { clamp } from '../core/utils.js';
import { teams } from '../data/teams.js';

export function defaultPredictions() {
  const divisionCounts = {};
  return teams.reduce((acc, team) => {
    const key = `${team.conference}-${team.division}`;
    const next = ((divisionCounts[key] || 0) % 4) + 1;
    divisionCounts[key] = next;
    acc[team.name] = { divisionRank: next, wins: 0, losses: 0 };
    return acc;
  }, {});
}

export function normalizePrediction(p = {}) {
  return {
    divisionRank: clamp(Number(p.divisionRank) || 1, 1, 4),
    wins: clamp(Number(p.wins) || 0, 0, 17),
    losses: clamp(Number(p.losses) || 0, 0, 17),
  };
}

export function migratePredictions(user, season) {
  if (!user) return defaultPredictions();
  const bySeason = { ...(user.predictionsBySeason || {}) };
  if (!bySeason[season]) bySeason[season] = defaultPredictions();
  return bySeason[season];
}

export function hasMeaningfulPredictions(predictions) {
  const base = defaultPredictions();
  return Object.entries(predictions || {}).some(([t, p]) => {
    const a = normalizePrediction(p);
    const b = normalizePrediction(base[t]);
    return a.divisionRank !== b.divisionRank || a.wins !== b.wins || a.losses !== b.losses;
  });
}