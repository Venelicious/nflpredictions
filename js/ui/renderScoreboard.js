// ui/renderScoreboard.js
import { CONFERENCE_ORDER, STAT_DIVISION_ORDER } from '../core/config.js';
import { teams } from '../data/teams.js';
import { splitTeamName, getTeamLogo } from '../core/utils.js';
import {
  calculateTeamPoints,
  calculateDivisionBonus,
  calculateUserTotalPoints
} from '../features/scoring.js';

export function renderScoreboard({
  container,
  participants,
  standingsSnapshot,
  getParticipantPredictions
}) {
  container.innerHTML = '';

  // ===== GRID ROOT =====
  const matrix = document.createElement('div');
  matrix.className = 'scoreboard-matrix';
  matrix.style.setProperty(
    '--cols',
    participants.length + 1 // Standings + User
  );

  // ===== HEADER =====
  matrix.appendChild(headerCell('Standings'));

  participants.forEach(p => {
    const total = calculateUserTotalPoints(
      getParticipantPredictions(p),
      standingsSnapshot
    );
    matrix.appendChild(headerCell(p.name, total));
  });

  // ===== DIVISIONS =====
  CONFERENCE_ORDER.forEach(conf => {
    STAT_DIVISION_ORDER.forEach(div => {
      matrix.appendChild(divisionBanner(conf, div));

      const divisionTeams = teams.filter(
        t => t.conference === conf && t.division === div
      );

      const actual = standingsSnapshot.divisions?.[conf]?.[div] || [];

      const userPredictions = participants.map(p => {
        const preds = getParticipantPredictions(p);
        return divisionTeams
          .map(team => ({
            team,
            prediction: preds[team.name]
          }))
          .sort((a, b) => a.prediction.divisionRank - b.prediction.divisionRank);
      });

      const rows = Math.max(actual.length, divisionTeams.length);

      // Bonus row
      matrix.appendChild(emptyCell());
      userPredictions.forEach(entries => {
        const bonus = calculateDivisionBonus(entries, standingsSnapshot);
        matrix.appendChild(bonusCell(bonus));
      });

      // Rows
      for (let i = 0; i < rows; i++) {
        matrix.appendChild(standingsCell(actual[i], i));

        userPredictions.forEach(entries => {
          matrix.appendChild(predictionCell(entries[i], standingsSnapshot));
        });
      }
    });
  });

  container.appendChild(matrix);
}

/* ---------- Cells ---------- */

function headerCell(label, points) {
  const el = document.createElement('div');
  el.className = 'sb-cell sb-header';
  el.innerHTML = `
    <div class="sb-title">${label}</div>
    ${typeof points === 'number'
      ? `<div class="sb-points">${points} P</div>`
      : ''}
  `;
  return el;
}

function divisionBanner(conf, div) {
  const el = document.createElement('div');
  el.className = `sb-division sb-${conf.toLowerCase()}`;
  el.style.gridColumn = '1 / -1';
  el.innerHTML = `
    <span class="sb-conf">${conf}</span>
    <span class="sb-div">${div}</span>
  `;
  return el;
}

function standingsCell(entry, index) {
  const el = document.createElement('div');
  el.className = 'sb-cell sb-standings';

  if (!entry) {
    el.textContent = '–';
    return el;
  }

  const { alias } = splitTeamName(entry.team.name);
  el.innerHTML = `
    <span class="sb-rank">${index + 1}.</span>
    <img src="${entry.stats.logo}" class="team-logo">
    <span class="sb-team">${alias || entry.team.name}</span>
    <span class="sb-record">${entry.stats.wins}-${entry.stats.losses}</span>
  `;
  return el;
}

function predictionCell(entry, standingsSnapshot) {
  const el = document.createElement('div');
  el.className = 'sb-cell sb-prediction';

  if (!entry) {
    el.textContent = '–';
    return el;
  }

  const pts = calculateTeamPoints(
    entry.team.name,
    entry.prediction,
    standingsSnapshot
  );

  el.innerHTML = `
    <img src="${getTeamLogo(entry.team.name)}" class="team-logo">
    <span class="sb-record">${entry.prediction.wins}-${entry.prediction.losses}</span>
    <span class="sb-pts">${pts ?? '–'}</span>
  `;
  return el;
}

function bonusCell(active) {
  const el = document.createElement('div');
  el.className = `sb-cell sb-bonus ${active ? 'active' : ''}`;
  el.textContent = active ? '⭐ +1' : '–';
  return el;
}

function emptyCell() {
  const el = document.createElement('div');
  el.className = 'sb-cell sb-empty';
  return el;
}