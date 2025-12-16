// main.js
import { auth } from './features/auth.js';
import { dom } from './ui/dom.js';
import { renderScoreboard } from './ui/renderScoreboard.js';
import { extractStandings } from './data/standings.js';

let standingsSnapshot = null;

async function init() {
  setupAuthForms();
  setupTabs();

  await auth.init();
  updateAuthUI();
  loadStandings();
}

function setupTabs() {
  const buttons = Array.from(document.querySelectorAll('.tab-button'));
  const panes = Array.from(document.querySelectorAll('.tab-pane'));

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      buttons.forEach(b => b.classList.toggle('active', b.dataset.tab === target));
      panes.forEach(p => p.classList.toggle('active', p.id === target));
    });
  });
}

function setupAuthForms() {
  dom.showRegister?.addEventListener('click', () => toggleAuthForm('register'));
  dom.showLogin?.addEventListener('click', () => toggleAuthForm('login'));

  dom.loginForm?.addEventListener('submit', onLoginSubmit);
  dom.registerForm?.addEventListener('submit', onRegisterSubmit);
  dom.logoutBtn?.addEventListener('click', onLogout);
}

function toggleAuthForm(mode) {
  const toLogin = mode === 'login';
  dom.loginForm?.classList.toggle('hidden', !toLogin);
  dom.registerForm?.classList.toggle('hidden', toLogin);
  dom.authArea?.classList.toggle('auth-area--logged-in', false);
}

function setStatus(el, message, isError = false) {
  if (!el) return;
  el.textContent = message || '';
  el.classList.toggle('error', isError);
}

function setFormDisabled(formEl, disabled) {
  if (!formEl) return;
  formEl.querySelectorAll('input, button').forEach(el => { el.disabled = disabled; });
}

async function onLoginSubmit(event) {
  event.preventDefault();
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

async function onRegisterSubmit(event) {
  event.preventDefault();
  setStatus(dom.registerStatus, '');
  setFormDisabled(dom.registerForm, true);

  try {
    await auth.register({
      name: dom.registerName.value.trim(),
      email: dom.registerEmail.value.trim(),
      password: dom.registerPassword.value.trim(),
    });
    updateAuthUI();
    render();
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
  fetch('/standings.json')
    .then(r => r.json())
    .then(data => {
      standingsSnapshot = extractStandings(data);
      render();
    })
    .catch(() => setStatus(dom.registerStatus, 'Konnte Standings nicht laden', true));
}

function updateAuthUI() {
  const user = auth.getUser(auth.currentUser);
  const isLoggedIn = Boolean(user);

  dom.authArea?.classList.toggle('auth-area--logged-in', isLoggedIn);
  dom.welcomeBox?.classList.toggle('hidden', !isLoggedIn);
  dom.welcomeArea?.classList.toggle('hidden', !isLoggedIn);
  dom.tabs?.classList.toggle('hidden', !isLoggedIn);
  dom.loginForm?.classList.toggle('hidden', isLoggedIn);
  dom.registerForm?.classList.toggle('hidden', true);

  if (isLoggedIn) {
    dom.headerWelcomeName.textContent = user.name || 'Coach';
    dom.headerWelcomeEmail.textContent = user.email;
    dom.welcomeName.textContent = user.name || 'Coach';
    dom.welcomeEmail.textContent = user.email;
  } else {
    setStatus(dom.loginStatus, '');
    setStatus(dom.registerStatus, '');
    dom.loginForm?.reset();
    dom.registerForm?.reset();
  }
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
