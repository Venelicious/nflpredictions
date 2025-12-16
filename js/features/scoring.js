// features/scoring.js
import { teams } from '../data/teams.js';

export function calculateTeamPoints(teamName, prediction, standingsSnapshot) {
  if (!standingsSnapshot) return null;
  const actual = standingsSnapshot.teamStats[teamName];
  const rank = standingsSnapshot.divisionRanks[teamName];
  if (!actual || !rank) return null;

  let pts = 0;
  if (prediction.divisionRank === rank) pts += 1;
  if (prediction.wins === actual.wins && prediction.losses === actual.losses) pts += 1;
  return pts;
}

export function calculateDivisionBonus(entries, standingsSnapshot) {
  if (!standingsSnapshot) return 0;
  return entries.every(e => standingsSnapshot.divisionRanks[e.team.name] === e.prediction.divisionRank) ? 1 : 0;
}

export function calculateUserTotalPoints(predictions, standingsSnapshot) {
  if (!standingsSnapshot) return null;
  let total = 0;
  const buckets = {};

  teams.forEach(team => {
    const p = predictions?.[team.name];
    const pts = calculateTeamPoints(team.name, p, standingsSnapshot);
    if (typeof pts === 'number') total += pts;
    const key = `${team.conference}-${team.division}`;
    buckets[key] = buckets[key] || [];
    buckets[key].push({ team, prediction: p });
  });

  Object.values(buckets).forEach(entries => {
    total += calculateDivisionBonus(entries, standingsSnapshot);
  });

  return total;
}