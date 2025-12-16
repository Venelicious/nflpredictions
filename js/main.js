// main.js
import { auth } from './features/auth.js';
import { dom } from './ui/dom.js';
import { authUI } from './ui/authUI.js';
import { initTabs } from './ui/tabs.js';
import { renderScoreboard } from './ui/renderScoreboard.js';
import { renderPredictions } from './ui/renderPredictions.js';
import { renderStats } from './ui/renderStats.js';
import { extractStandings } from './data/standings.js';
import { defaultPredictions, normalizePrediction } from './features/predictions.js';
import { apiClient } from './api/apiClient.js';

let standingsSnapshot = null;
let tabs;

async function init() {
  tabs = initTabs();
  authUI.bind({
    onLoginSubmit,
    onRegisterSubmit,
    onLogout,
  });
  setupPredictionInteractions();

  await auth.init();
  updateAuthUI();
  loadStandings();
}

function setupPredictionInteractions() {
  dom.predictionsContent?.addEventListener('input', onPredictionInput);
  dom.savePredictions?.addEventListener('click', onSavePredictions);
}

async function onLoginSubmit(_event, helpers) {
  const { setStatus, setFormDisabled } = helpers;
  setStatus(dom.loginStatus, '');
  setFormDisabled(dom.loginForm, true);

  try {
    await auth.login(dom.loginEmail.value.trim(), dom.loginPassword.value.trim());
    updateAuthUI();
    render();
  } catch (err) {
    setStatus(dom.loginStatus, err.message || 'Login fehlgeschlagen', true);
  } finally {
    setFormDisabled(dom.loginForm, false);
  }
}

async function onRegisterSubmit(_event, helpers) {
  const { setStatus, setFormDisabled } = helpers;
  setStatus(dom.registerStatus, '');
  setFormDisabled(dom.registerForm, true);

  try {
    const password = dom.registerPassword.value.trim();
    const confirm = dom.registerPasswordConfirm?.value.trim();

    if (!dom.registerName.value.trim()) throw new Error('Benutzername fehlt');
    if (confirm !== undefined && password !== confirm) throw new Error('Passwörter stimmen nicht überein');

    await auth.register({
      name: dom.registerName.value.trim(),
      email: dom.registerEmail.value.trim(),
      password,
    });
    updateAuthUI();
    render();
    authUI.closeRegisterModal();
  } catch (err) {
    setStatus(dom.registerStatus, err.message || 'Registrierung fehlgeschlagen', true);
  } finally {
    setFormDisabled(dom.registerForm, false);
  }
}

async function onLogout() {
  await auth.logout();
  updateAuthUI();
  render();
}

function loadStandings() {
  authUI.setStatus(dom.statsStatus, '');
  dom.overviewStatus.textContent = '';

  fetch('/standings.json')
    .then(r => r.json())
    .then(data => {
      standingsSnapshot = extractStandings(data);
      render();
    })
    .catch(() => {
      authUI.setStatus(dom.statsStatus, 'Konnte Standings nicht laden', true);
      dom.overviewStatus.textContent = 'Konnte Standings nicht laden.';
    });
}

function updateAuthUI() {
  const user = auth.getUser(auth.currentUser);
  const isLoggedIn = Boolean(user);

  authUI.renderUser(user);
  tabs?.setVisible(isLoggedIn);

  // Make sure auth-only controls are hidden immediately, even before data loads
  dom.predictionsActions?.classList.toggle('hidden', !isLoggedIn);
  if (dom.savePredictions) dom.savePredictions.disabled = !isLoggedIn;

  if (!isLoggedIn) {
    tabs?.activate('predictionsTab');
  }
}

function render() {
  if (!standingsSnapshot) return;

  const user = auth.getUser(auth.currentUser);
  const predictions = user
    ? user.predictionsBySeason?.[auth.season] || defaultPredictions()
    : null;

  if (user) {
    renderPredictions(dom.predictionsContent, predictions);
    authUI.setStatus(dom.predictionStatus, '');
    dom.overviewStatus.textContent = '';
  } else {
    dom.predictionsContent.innerHTML = '<p class="hint">Bitte einloggen, um deine Tipps zu sehen.</p>';
    authUI.setStatus(dom.predictionStatus, '');
    dom.overviewStatus.textContent = 'Melde dich an, um das Scoreboard zu sehen.';
  }

  dom.predictionsActions?.classList.toggle('hidden', !user);
  dom.savePredictions.disabled = !user;

  renderScoreboardView(Boolean(user));
  renderStats(dom.statsContent, standingsSnapshot);
}

function renderScoreboardView(isLoggedIn) {
  if (!isLoggedIn) {
    dom.overviewContent.innerHTML = '';
    return;
  }

  renderScoreboard({
    container: dom.overviewContent,
    participants: auth.users,
    standingsSnapshot,
    getParticipantPredictions: p => p.predictionsBySeason?.[auth.season],
  });
}

function onPredictionInput(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  const row = input.closest('.prediction-row');
  if (!row) return;

  const team = row.dataset.team;
  const field = input.name;
  if (!team || !['wins', 'losses', 'divisionRank'].includes(field)) return;

  const user = auth.getUser(auth.currentUser);
  if (!user) return;

  const predictions = {
    ...(user.predictionsBySeason?.[auth.season] || defaultPredictions()),
  };

  predictions[team] = normalizePrediction({
    ...(predictions[team] || {}),
    [field]: input.value,
  });

  auth.profiles[user.email] = {
    ...user,
    predictionsBySeason: {
      ...(user.predictionsBySeason || {}),
      [auth.season]: predictions,
    },
  };

  renderScoreboardView(Boolean(user));
}

async function onSavePredictions() {
  const user = auth.getUser(auth.currentUser);
  if (!user) return;

  const predictions = user.predictionsBySeason?.[auth.season] || defaultPredictions();

  authUI.setStatus(dom.predictionStatus, 'Speichere ...');
  dom.savePredictions.disabled = true;

  try {
    await apiClient.saveTip({
      season: auth.season,
      payload: predictions,
    });
    authUI.setStatus(dom.predictionStatus, 'Gespeichert');
  } catch (err) {
    authUI.setStatus(dom.predictionStatus, err.message || 'Konnte nicht speichern', true);
  } finally {
    dom.savePredictions.disabled = false;
  }
}

init();
