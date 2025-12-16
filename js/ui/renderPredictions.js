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

    const { city, alias } = splitTeamName(team.name);

    row.innerHTML = `
      <img src="${getTeamLogo(team.name)}" class="team-logo">
      <div>
        <div>${city}</div>
        <strong>${alias}</strong>
      </div>
      <span>${p.wins}-${p.losses}</span>
    `;

    container.appendChild(row);
  });
}