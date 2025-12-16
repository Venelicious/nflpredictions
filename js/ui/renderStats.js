// ui/renderStats.js
import { splitTeamName } from '../core/utils.js';

export function renderStats(container, snapshot) {
  container.innerHTML = '';

  Object.entries(snapshot.divisions).forEach(([conf, divs]) => {
    Object.entries(divs).forEach(([div, entries]) => {
      const block = document.createElement('div');
      block.className = 'stats-division';

      block.innerHTML = `<h4>${conf} ${div}</h4>`;

      entries.forEach((e, i) => {
        const { alias } = splitTeamName(e.team.name);
        const row = document.createElement('div');
        row.textContent = `${i + 1}. ${alias} ${e.stats.wins}-${e.stats.losses}`;
        block.appendChild(row);
      });

      container.appendChild(block);
    });
  });
}