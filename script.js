const LOCK_DATE = new Date('2024-09-01T12:00:00Z');
const teams = [
  'Arizona Cardinals', 'Atlanta Falcons', 'Baltimore Ravens', 'Buffalo Bills', 'Carolina Panthers',
  'Chicago Bears', 'Cincinnati Bengals', 'Cleveland Browns', 'Dallas Cowboys', 'Denver Broncos',
  'Detroit Lions', 'Green Bay Packers', 'Houston Texans', 'Indianapolis Colts', 'Jacksonville Jaguars',
  'Kansas City Chiefs', 'Las Vegas Raiders', 'Los Angeles Chargers', 'Los Angeles Rams', 'Miami Dolphins',
  'Minnesota Vikings', 'New England Patriots', 'New Orleans Saints', 'New York Giants', 'New York Jets',
  'Philadelphia Eagles', 'Pittsburgh Steelers', 'San Francisco 49ers', 'Seattle Seahawks', 'Tampa Bay Buccaneers',
  'Tennessee Titans', 'Washington Commanders'
];

const auth = {
  storageKey: 'nflp_users',
  currentKey: 'nflp_current',
  get users() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  },
  set users(list) {
    localStorage.setItem(this.storageKey, JSON.stringify(list));
  },
  get currentUser() {
    return localStorage.getItem(this.currentKey);
  },
  set currentUser(email) {
    if (email) {
      localStorage.setItem(this.currentKey, email);
    } else {
      localStorage.removeItem(this.currentKey);
    }
  },
  register({ name, email, password }) {
    const existing = this.users.find(u => u.email === email);
    if (existing) throw new Error('E-Mail ist bereits registriert.');
    const user = {
      name,
      email,
      password: btoa(password),
      favorite: '',
      predictions: defaultPredictions(),
    };
    this.users = [...this.users, user];
    this.currentUser = email;
    return user;
  },
  login(email, password) {
    const user = this.users.find(u => u.email === email && u.password === btoa(password));
    if (!user) throw new Error('Anmeldung fehlgeschlagen. Prüfe E-Mail oder Passwort.');
    this.currentUser = email;
    return user;
  },
  logout() {
    this.currentUser = '';
  },
  updateProfile(email, payload) {
    const updated = this.users.map(u => (u.email === email ? { ...u, ...payload } : u));
    this.users = updated;
  },
  updatePredictions(email, predictions) {
    const updated = this.users.map(u => (u.email === email ? { ...u, predictions } : u));
    this.users = updated;
  },
  getUser(email) {
    return this.users.find(u => u.email === email);
  }
};

const elements = {
  loginForm: document.getElementById('loginForm'),
  registerForm: document.getElementById('registerForm'),
  showRegister: document.getElementById('showRegister'),
  showLogin: document.getElementById('showLogin'),
  welcomeArea: document.getElementById('welcomeArea'),
  welcomeName: document.getElementById('welcomeName'),
  welcomeEmail: document.getElementById('welcomeEmail'),
  logoutBtn: document.getElementById('logoutBtn'),
  tabs: document.getElementById('tabs'),
  welcomeHero: document.getElementById('welcomeHero'),
  tabButtons: document.querySelectorAll('.tab-button'),
  tabPanes: document.querySelectorAll('.tab-pane'),
  profileForm: document.getElementById('profileForm'),
  profileName: document.getElementById('profileName'),
  profileEmail: document.getElementById('profileEmail'),
  profileFavorite: document.getElementById('profileFavorite'),
  profileStatus: document.getElementById('profileStatus'),
  lockInfo: document.getElementById('lockInfo'),
  predictionsTable: document.querySelector('#predictionsTable tbody'),
  savePredictions: document.getElementById('savePredictions'),
  predictionStatus: document.getElementById('predictionStatus'),
  startNow: document.getElementById('startNow'),
  authArea: document.getElementById('authArea'),
  statsContent: document.getElementById('statsContent'),
  refreshStats: document.getElementById('refreshStats'),
};

function defaultPredictions() {
  return teams.reduce((acc, team, index) => {
    acc[team] = index + 1;
    return acc;
  }, {});
}

function populateTeamSelect() {
  teams.forEach(team => {
    const option = document.createElement('option');
    option.value = team;
    option.textContent = team;
    elements.profileFavorite.appendChild(option);
  });
}

function showAuth(mode) {
  elements.loginForm.classList.toggle('hidden', mode !== 'login');
  elements.registerForm.classList.toggle('hidden', mode !== 'register');
}

function updateAuthUI() {
  const current = auth.currentUser;
  const loggedIn = Boolean(current);
  elements.welcomeArea.classList.toggle('hidden', !loggedIn);
  elements.tabs.classList.toggle('hidden', !loggedIn);
  elements.welcomeHero.classList.toggle('hidden', loggedIn);
  if (loggedIn) {
    const user = auth.getUser(current);
    elements.welcomeName.textContent = user?.name || '';
    elements.welcomeEmail.textContent = user?.email || '';
    elements.profileName.value = user?.name || '';
    elements.profileEmail.value = user?.email || '';
    elements.profileFavorite.value = user?.favorite || '';
    renderPredictions(user?.predictions || defaultPredictions());
    updateLockInfo();
  }
}

function switchTab(targetId) {
  elements.tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === targetId));
  elements.tabPanes.forEach(pane => pane.classList.toggle('active', pane.id === targetId));
}

function renderPredictions(predictions) {
  elements.predictionsTable.innerHTML = '';
  const lockExpired = isLocked();
  Object.entries(predictions).forEach(([team, position]) => {
    const row = document.createElement('tr');
    const teamCell = document.createElement('td');
    teamCell.textContent = team;

    const positionCell = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.max = '32';
    input.value = position;
    input.dataset.team = team;
    input.disabled = lockExpired;
    input.addEventListener('input', handlePredictionChange);
    positionCell.appendChild(input);

    row.appendChild(teamCell);
    row.appendChild(positionCell);
    elements.predictionsTable.appendChild(row);
  });
  updateSaveState();
}

function handlePredictionChange(event) {
  const current = auth.getUser(auth.currentUser);
  if (!current) return;
  const team = event.target.dataset.team;
  const value = parseInt(event.target.value, 10) || 1;
  current.predictions[team] = Math.min(32, Math.max(1, value));
  highlightConflicts(current.predictions);
  auth.updatePredictions(current.email, current.predictions);
  updateSaveState('Änderungen werden automatisch zwischengespeichert.');
}

function highlightConflicts(predictions) {
  const counts = {};
  Object.values(predictions).forEach(pos => {
    counts[pos] = (counts[pos] || 0) + 1;
  });
  elements.predictionsTable.querySelectorAll('input').forEach(input => {
    const isConflict = counts[input.value] > 1;
    input.classList.toggle('conflict', isConflict);
  });
}

function updateSaveState(message = '') {
  const locked = isLocked();
  elements.savePredictions.disabled = locked;
  if (message) {
    elements.predictionStatus.textContent = message;
  }
}

function updateLockInfo() {
  const locked = isLocked();
  const readable = LOCK_DATE.toLocaleString('de-DE', { dateStyle: 'long', timeStyle: 'short' });
  elements.lockInfo.textContent = locked
    ? `Tipps sind seit ${readable} gesperrt.`
    : `Tipps können bis ${readable} bearbeitet werden.`;
  elements.savePredictions.disabled = locked;
  elements.predictionsTable.querySelectorAll('input').forEach(input => {
    input.disabled = locked;
  });
}

function isLocked() {
  return new Date() > LOCK_DATE;
}

function savePredictions() {
  const user = auth.getUser(auth.currentUser);
  if (!user) return;
  const predictions = {};
  let hasConflict = false;
  elements.predictionsTable.querySelectorAll('input').forEach(input => {
    predictions[input.dataset.team] = Number(input.value);
  });
  const counts = {};
  Object.values(predictions).forEach(pos => {
    counts[pos] = (counts[pos] || 0) + 1;
    if (counts[pos] > 1) hasConflict = true;
  });
  highlightConflicts(predictions);
  if (hasConflict) {
    elements.predictionStatus.textContent = 'Bitte entferne doppelte Platzierungen.';
    elements.predictionStatus.className = 'status error';
    return;
  }
  auth.updatePredictions(user.email, predictions);
  elements.predictionStatus.textContent = 'Tipps gespeichert!';
  elements.predictionStatus.className = 'status success';
}

function handleProfileSubmit(event) {
  event.preventDefault();
  const current = auth.getUser(auth.currentUser);
  if (!current) return;
  const payload = {
    name: elements.profileName.value.trim(),
    favorite: elements.profileFavorite.value,
  };
  auth.updateProfile(current.email, payload);
  elements.welcomeName.textContent = payload.name;
  elements.profileStatus.textContent = 'Profil gespeichert';
  elements.profileStatus.className = 'status success';
}

function handleRegister(event) {
  event.preventDefault();
  try {
    auth.register({
      name: document.getElementById('registerName').value.trim(),
      email: document.getElementById('registerEmail').value.trim().toLowerCase(),
      password: document.getElementById('registerPassword').value,
    });
    showAuth('');
    updateAuthUI();
  } catch (err) {
    alert(err.message);
  }
}

function handleLogin(event) {
  event.preventDefault();
  try {
    auth.login(
      document.getElementById('loginEmail').value.trim().toLowerCase(),
      document.getElementById('loginPassword').value
    );
    showAuth('');
    updateAuthUI();
  } catch (err) {
    alert(err.message);
  }
}

function renderStats(data) {
  if (!data || !data.children) {
    elements.statsContent.textContent = 'Keine Daten verfügbar.';
    return;
  }
  const groups = data.children
    .filter(item => item.standings && item.standings.entries)
    .flatMap(item => item.standings.entries)
    .slice(0, 12); // keep things small for display

  const container = document.createElement('div');
  container.className = 'stats-grid';

  groups.forEach(entry => {
    const teamName = entry.team?.displayName || 'Team';
    const wins = entry.stats?.find(s => s.name === 'wins')?.value ?? '-';
    const losses = entry.stats?.find(s => s.name === 'losses')?.value ?? '-';
    const pct = entry.stats?.find(s => s.name === 'winPercent')?.value ?? '-';

    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `
      <h4>${teamName}</h4>
      <p>Bilanz: ${wins}-${losses}</p>
      <p>Siegquote: ${(pct * 100).toFixed ? (pct * 100).toFixed(1) + '%' : pct}</p>
    `;
    container.appendChild(card);
  });

  elements.statsContent.innerHTML = '';
  elements.statsContent.appendChild(container);
}

async function loadStats() {
  elements.statsContent.textContent = 'Lade aktuelle Daten…';
  try {
    const response = await fetch('https://site.api.espn.com/apis/v2/sports/football/nfl/standings');
    if (!response.ok) throw new Error('Fehler beim Abrufen.');
    const data = await response.json();
    renderStats(data);
  } catch (err) {
    elements.statsContent.textContent = 'Aktualisierung nicht möglich. Prüfe deine Verbindung.';
    console.error(err);
  }
}

function setupEvents() {
  elements.showRegister.addEventListener('click', () => showAuth('register'));
  elements.showLogin.addEventListener('click', () => showAuth('login'));
  elements.startNow.addEventListener('click', () => showAuth('register'));
  elements.registerForm.addEventListener('submit', handleRegister);
  elements.loginForm.addEventListener('submit', handleLogin);
  elements.logoutBtn.addEventListener('click', () => { auth.logout(); updateAuthUI(); showAuth('login'); });
  elements.profileForm.addEventListener('submit', handleProfileSubmit);
  elements.savePredictions.addEventListener('click', savePredictions);
  elements.tabButtons.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
  elements.refreshStats.addEventListener('click', loadStats);
}

function init() {
  populateTeamSelect();
  showAuth('login');
  setupEvents();
  if (auth.currentUser) {
    updateAuthUI();
  }
  loadStats();
}

document.addEventListener('DOMContentLoaded', init);
