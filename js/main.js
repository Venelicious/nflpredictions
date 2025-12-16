// main.js
import { auth } from './features/auth.js';
import { dom } from './ui/dom.js';
import { renderScoreboard } from './ui/renderScoreboard.js';
import { extractStandings } from './data/standings.js';

let standingsSnapshot = null;

async function init() {
  await auth.init();

  // Beispiel: Standings laden
  fetch('/standings.json')
    .then(r => r.json())
    .then(data => {
      standingsSnapshot = extractStandings(data);
      render();
    });
}

function render() {
  if (!standingsSnapshot) return;

  renderScoreboard({
    container: dom.overviewContent,
    participants: auth.users,
    standingsSnapshot,
    getParticipantPredictions: p => p.predictionsBySeason?.['2025'],
  });
}

init();