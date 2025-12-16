// ui/renderPredictions.js
import { teams } from '../data/teams.js';
import { splitTeamName, getTeamLogo } from '../core/utils.js';
import { normalizePrediction } from '../features/predictions.js';

export function renderPredictions(container, predictions) {
  container.innerHTML = '';

  teams.forEach(team => {
    const p = normalizePrediction(predictions[team.name]);
    const row = document.createElement('div');
    row.className = 'prediction-row';
    row.dataset.team = team.name;

    const { city, alias } = splitTeamName(team.name);

    row.innerHTML = `
      <div class="prediction-team">
        <img src="${getTeamLogo(team.name)}" class="team-logo">
        <div class="team-name team-name--stacked">
          <span class="team-name__city">${city}</span>
          <strong>${alias}</strong>
        </div>
      </div>
      <div class="prediction-record">
        <span>Div</span>
        <input
          type="number"
          min="1"
          max="4"
          name="divisionRank"
          aria-label="Division Platzierung für ${team.name}"
          value="${p.divisionRank}"
        />
      </div>
      <div class="prediction-record">
        <span>W</span>
        <input
          type="number"
          min="0"
          max="17"
          name="wins"
          aria-label="Siege für ${team.name}"
          value="${p.wins}"
        />
        <span>L</span>
        <input
          type="number"
          min="0"
          max="17"
          name="losses"
          aria-label="Niederlagen für ${team.name}"
          value="${p.losses}"
        />
      </div>
    `;

    container.appendChild(row);
  });
}