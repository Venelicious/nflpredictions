// data/standings.js
import { teams, teamLogos } from './teams.js';

export function buildStandingsSnapshot(teamStats) {
  const divisions = {};
  const divisionRanks = {};

  teams.forEach(team => {
    divisions[team.conference] ??= {};
    divisions[team.conference][team.division] ??= [];

    const stats = teamStats[team.name] || {
      wins: 0,
      losses: 0,
      pct: -1,
      logo: teamLogos[team.name] || '',
    };

    divisions[team.conference][team.division].push({ team, stats });
  });

  Object.values(divisions).forEach(conf =>
    Object.values(conf).forEach(list => {
      list.sort((a, b) => b.stats.pct - a.stats.pct);
      list.forEach((e, i) => (divisionRanks[e.team.name] = i + 1));
    })
  );

  return { teamStats, divisions, divisionRanks };
}

export function extractStandings(data) {
  if (!data) return null;

  const records =
    data.teamRecords ||
    data.records ||
    data.league?.teamRecords ||
    [];

  const stats = {};

  records.forEach(r => {
    const name =
      r.team?.displayName ||
      r.team?.fullName ||
      r.team?.name;

    if (!name) return;

    stats[name] = {
      wins: r.wins ?? 0,
      losses: r.losses ?? 0,
      pct: r.winPct ?? -1,
      logo: teamLogos[name] || '',
    };
  });

  return Object.keys(stats).length
    ? buildStandingsSnapshot(stats)
    : null;
}