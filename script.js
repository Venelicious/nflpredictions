const DEFAULT_LOCK_DATES = {
  '2024': '2024-09-01T12:00:00Z',
  '2025': '2025-09-01T12:00:00Z',
};
const CONFERENCE_ORDER = ['AFC', 'NFC'];
const DIVISION_ORDER = ['East', 'North', 'South', 'West'];
const STAT_DIVISION_ORDER = ['North', 'East', 'South', 'West'];
const AVAILABLE_SEASONS = [
  { value: '2024', label: 'Saison 2024/2025 (abgeschlossen)' },
  { value: '2025', label: 'Saison 2025/2026' },
];
const PREDICTION_SEASON_KEY = 'nflp_prediction_season';
const LOCK_DATE_STORAGE_KEY = 'nflp_lock_dates';
const GITHUB_CONFIG_KEY = 'nflp_github_sync';
let predictionSeason = localStorage.getItem(PREDICTION_SEASON_KEY) || AVAILABLE_SEASONS[0].value;

const teamLogos = {
  'Buffalo Bills': 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png',
  'Miami Dolphins': 'https://a.espncdn.com/i/teamlogos/nfl/500/mia.png',
  'New England Patriots': 'https://a.espncdn.com/i/teamlogos/nfl/500/ne.png',
  'New York Jets': 'https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png',
  'Baltimore Ravens': 'https://a.espncdn.com/i/teamlogos/nfl/500/bal.png',
  'Cincinnati Bengals': 'https://a.espncdn.com/i/teamlogos/nfl/500/cin.png',
  'Cleveland Browns': 'https://a.espncdn.com/i/teamlogos/nfl/500/cle.png',
  'Pittsburgh Steelers': 'https://a.espncdn.com/i/teamlogos/nfl/500/pit.png',
  'Houston Texans': 'https://a.espncdn.com/i/teamlogos/nfl/500/hou.png',
  'Indianapolis Colts': 'https://a.espncdn.com/i/teamlogos/nfl/500/ind.png',
  'Jacksonville Jaguars': 'https://a.espncdn.com/i/teamlogos/nfl/500/jac.png',
  'Tennessee Titans': 'https://a.espncdn.com/i/teamlogos/nfl/500/ten.png',
  'Denver Broncos': 'https://a.espncdn.com/i/teamlogos/nfl/500/den.png',
  'Kansas City Chiefs': 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png',
  'Las Vegas Raiders': 'https://a.espncdn.com/i/teamlogos/nfl/500/lv.png',
  'Los Angeles Chargers': 'https://a.espncdn.com/i/teamlogos/nfl/500/lac.png',
  'Dallas Cowboys': 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png',
  'New York Giants': 'https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png',
  'Philadelphia Eagles': 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png',
  'Washington Commanders': 'https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png',
  'Chicago Bears': 'https://a.espncdn.com/i/teamlogos/nfl/500/chi.png',
  'Detroit Lions': 'https://a.espncdn.com/i/teamlogos/nfl/500/det.png',
  'Green Bay Packers': 'https://a.espncdn.com/i/teamlogos/nfl/500/gb.png',
  'Minnesota Vikings': 'https://a.espncdn.com/i/teamlogos/nfl/500/min.png',
  'Atlanta Falcons': 'https://a.espncdn.com/i/teamlogos/nfl/500/atl.png',
  'Carolina Panthers': 'https://a.espncdn.com/i/teamlogos/nfl/500/car.png',
  'New Orleans Saints': 'https://a.espncdn.com/i/teamlogos/nfl/500/no.png',
  'Tampa Bay Buccaneers': 'https://a.espncdn.com/i/teamlogos/nfl/500/tb.png',
  'Arizona Cardinals': 'https://a.espncdn.com/i/teamlogos/nfl/500/ari.png',
  'Los Angeles Rams': 'https://a.espncdn.com/i/teamlogos/nfl/500/lar.png',
  'San Francisco 49ers': 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png',
  'Seattle Seahawks': 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png',
};

const teams = [
  { name: 'Buffalo Bills', conference: 'AFC', division: 'East', league: 'NFL' },
  { name: 'Miami Dolphins', conference: 'AFC', division: 'East', league: 'NFL' },
  { name: 'New England Patriots', conference: 'AFC', division: 'East', league: 'NFL' },
  { name: 'New York Jets', conference: 'AFC', division: 'East', league: 'NFL' },
  { name: 'Baltimore Ravens', conference: 'AFC', division: 'North', league: 'NFL' },
  { name: 'Cincinnati Bengals', conference: 'AFC', division: 'North', league: 'NFL' },
  { name: 'Cleveland Browns', conference: 'AFC', division: 'North', league: 'NFL' },
  { name: 'Pittsburgh Steelers', conference: 'AFC', division: 'North', league: 'NFL' },
  { name: 'Houston Texans', conference: 'AFC', division: 'South', league: 'NFL' },
  { name: 'Indianapolis Colts', conference: 'AFC', division: 'South', league: 'NFL' },
  { name: 'Jacksonville Jaguars', conference: 'AFC', division: 'South', league: 'NFL' },
  { name: 'Tennessee Titans', conference: 'AFC', division: 'South', league: 'NFL' },
  { name: 'Denver Broncos', conference: 'AFC', division: 'West', league: 'NFL' },
  { name: 'Kansas City Chiefs', conference: 'AFC', division: 'West', league: 'NFL' },
  { name: 'Las Vegas Raiders', conference: 'AFC', division: 'West', league: 'NFL' },
  { name: 'Los Angeles Chargers', conference: 'AFC', division: 'West', league: 'NFL' },
  { name: 'Dallas Cowboys', conference: 'NFC', division: 'East', league: 'NFL' },
  { name: 'New York Giants', conference: 'NFC', division: 'East', league: 'NFL' },
  { name: 'Philadelphia Eagles', conference: 'NFC', division: 'East', league: 'NFL' },
  { name: 'Washington Commanders', conference: 'NFC', division: 'East', league: 'NFL' },
  { name: 'Chicago Bears', conference: 'NFC', division: 'North', league: 'NFL' },
  { name: 'Detroit Lions', conference: 'NFC', division: 'North', league: 'NFL' },
  { name: 'Green Bay Packers', conference: 'NFC', division: 'North', league: 'NFL' },
  { name: 'Minnesota Vikings', conference: 'NFC', division: 'North', league: 'NFL' },
  { name: 'Atlanta Falcons', conference: 'NFC', division: 'South', league: 'NFL' },
  { name: 'Carolina Panthers', conference: 'NFC', division: 'South', league: 'NFL' },
  { name: 'New Orleans Saints', conference: 'NFC', division: 'South', league: 'NFL' },
  { name: 'Tampa Bay Buccaneers', conference: 'NFC', division: 'South', league: 'NFL' },
  { name: 'Arizona Cardinals', conference: 'NFC', division: 'West', league: 'NFL' },
  { name: 'Los Angeles Rams', conference: 'NFC', division: 'West', league: 'NFL' },
  { name: 'San Francisco 49ers', conference: 'NFC', division: 'West', league: 'NFL' },
  { name: 'Seattle Seahawks', conference: 'NFC', division: 'West', league: 'NFL' },
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
      predictionsBySeason: { [predictionSeason]: defaultPredictions() },
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
  updatePredictions(email, predictions, season = predictionSeason) {
    const updated = this.users.map(u => (u.email === email ? { ...u, predictions } : u));
    const cleaned = updated.map(u => {
      if (u.email !== email) return u;
      const predictionsBySeason = {
        ...(u.predictionsBySeason || {}),
        [season]: predictions,
      };
      const copy = { ...u, predictionsBySeason };
      delete copy.predictions;
      return copy;
    });
    this.users = cleaned;
  },
  getUser(email) {
    return this.users.find(u => u.email === email);
  }
};

const githubSync = {
  get config() {
    return JSON.parse(localStorage.getItem(GITHUB_CONFIG_KEY) || '{}');
  },
  save(config) {
    localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(config));
  },
  setStatus(message, type = 'info') {
    if (!elements.githubStatus) return;
    elements.githubStatus.textContent = message;
    elements.githubStatus.className = `status ${type === 'error' ? 'error' : type === 'success' ? 'success' : ''}`;
  },
  applyConfigToForm() {
    const cfg = this.config;
    if (!elements.githubOwner) return;
    elements.githubOwner.value = cfg.owner || '';
    elements.githubRepo.value = cfg.repo || '';
    elements.githubBranch.value = cfg.branch || 'main';
    elements.githubFile.value = cfg.file || 'data/nflpredictions.json';
    elements.githubToken.value = cfg.token || '';
  },
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
  predictionsContent: document.getElementById('predictionsContent'),
  seasonPicker: document.getElementById('seasonPicker'),
  savePredictions: document.getElementById('savePredictions'),
  predictionStatus: document.getElementById('predictionStatus'),
  startNow: document.getElementById('startNow'),
  authArea: document.getElementById('authArea'),
  statsContent: document.getElementById('statsContent'),
  refreshStats: document.getElementById('refreshStats'),
  overviewContent: document.getElementById('overviewContent'),
  overviewStatus: document.getElementById('overviewStatus'),
  lockSeasonSelect: document.getElementById('lockSeasonSelect'),
  lockDateInput: document.getElementById('lockDateInput'),
  lockDateStatus: document.getElementById('lockDateStatus'),
  saveLockDate: document.getElementById('saveLockDate'),
  githubOwner: document.getElementById('githubOwner'),
  githubRepo: document.getElementById('githubRepo'),
  githubBranch: document.getElementById('githubBranch'),
  githubFile: document.getElementById('githubFile'),
  githubToken: document.getElementById('githubToken'),
  githubSaveConfig: document.getElementById('githubSaveConfig'),
  githubPull: document.getElementById('githubPull'),
  githubPush: document.getElementById('githubPush'),
  githubStatus: document.getElementById('githubStatus'),
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getLockDates() {
  const stored = JSON.parse(localStorage.getItem(LOCK_DATE_STORAGE_KEY) || '{}');
  return { ...DEFAULT_LOCK_DATES, ...stored };
}

function saveLockDates(lockDates) {
  localStorage.setItem(LOCK_DATE_STORAGE_KEY, JSON.stringify(lockDates));
}

function getLockDateForSeason(season = predictionSeason) {
  const lockDates = getLockDates();
  const value = lockDates[season] || DEFAULT_LOCK_DATES[season] || DEFAULT_LOCK_DATES[AVAILABLE_SEASONS[0].value];
  return new Date(value);
}

function formatLockDateForInput(date) {
  const pad = num => String(num).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function defaultPredictions() {
  const divisionCounts = {};
  return teams.reduce((acc, team) => {
    const divisionKey = `${team.conference}-${team.division}`;
    const nextRank = ((divisionCounts[divisionKey] || 0) % 4) + 1;
    divisionCounts[divisionKey] = nextRank;
    acc[team.name] = { divisionRank: nextRank, wins: 9, losses: 8 };
    return acc;
  }, {});
}

function migratePredictions(user, season = predictionSeason) {
  if (!user) return defaultPredictions();
  const predictionsBySeason = {
    ...(user.predictionsBySeason || {}),
  };

  if (!Object.keys(predictionsBySeason).length) {
    predictionsBySeason[AVAILABLE_SEASONS[0].value] = user.predictions || defaultPredictions();
  }

  if (!predictionsBySeason[season]) {
    predictionsBySeason[season] = defaultPredictions();
  }

  auth.updateProfile(user.email, { predictionsBySeason });
  return predictionsBySeason[season];
}

function normalizePrediction(prediction = {}) {
  return {
    divisionRank: clamp(Number(prediction.divisionRank) || 1, 1, 4),
    wins: clamp(Number(prediction.wins) || 0, 0, 17),
    losses: clamp(Number(prediction.losses) || 0, 0, 17),
  };
}

function sortTeams() {
  return [...teams].sort((a, b) => {
    if (a.league !== b.league) return a.league.localeCompare(b.league);
    if (a.conference !== b.conference) {
      return CONFERENCE_ORDER.indexOf(a.conference) - CONFERENCE_ORDER.indexOf(b.conference);
    }
    if (a.division !== b.division) {
      return DIVISION_ORDER.indexOf(a.division) - DIVISION_ORDER.indexOf(b.division);
    }
    return a.name.localeCompare(b.name);
  });
}

function getTeamLogo(teamName) {
  return teamLogos[teamName] || '';
}

function renderTeamLabel(name) {
  const wrapper = document.createElement('div');
  wrapper.className = 'team-label';

  const logo = document.createElement('img');
  logo.className = 'team-logo';
  logo.src = getTeamLogo(name);
  logo.alt = `${name} Logo`;
  logo.loading = 'lazy';

  const text = document.createElement('span');
  text.textContent = name;

  wrapper.appendChild(logo);
  wrapper.appendChild(text);
  return wrapper;
}

function populateTeamSelect() {
  teams.forEach(team => {
    const option = document.createElement('option');
    option.value = team.name;
    option.textContent = `${team.name} (${team.conference} ${team.division})`;
    elements.profileFavorite.appendChild(option);
  });
}

function populateSeasonPicker() {
  if (!elements.seasonPicker) return;
  elements.seasonPicker.innerHTML = '';
  AVAILABLE_SEASONS.forEach(season => {
    const option = document.createElement('option');
    option.value = season.value;
    option.textContent = season.label;
    elements.seasonPicker.appendChild(option);
  });
  elements.seasonPicker.value = predictionSeason;
}

function populateLockSeasonSelect() {
  if (!elements.lockSeasonSelect) return;
  elements.lockSeasonSelect.innerHTML = '';
  AVAILABLE_SEASONS.forEach(season => {
    const option = document.createElement('option');
    option.value = season.value;
    option.textContent = season.label;
    elements.lockSeasonSelect.appendChild(option);
  });
  elements.lockSeasonSelect.value = predictionSeason;
  updateLockDateForm();
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
    if (elements.seasonPicker) {
      elements.seasonPicker.value = predictionSeason;
    }
    if (elements.lockSeasonSelect) {
      elements.lockSeasonSelect.value = predictionSeason;
      updateLockDateForm();
    }
    renderPredictions(migratePredictions(user, predictionSeason));
    updateLockInfo();
  } else {
    updateOverviewAccess();
  }
}

function switchTab(targetId) {
  const targetButton = Array.from(elements.tabButtons).find(btn => btn.dataset.tab === targetId);
  if (targetButton?.disabled) return;
  elements.tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === targetId));
  elements.tabPanes.forEach(pane => pane.classList.toggle('active', pane.id === targetId));
}

function renderPredictions(predictions) {
  elements.predictionsContent.innerHTML = '';
  const lockExpired = isLocked();
  const container = document.createElement('div');
  container.className = 'stats-columns prediction-columns';

  CONFERENCE_ORDER.forEach(conf => {
    const column = document.createElement('div');
    column.className = 'stats-column';
    column.innerHTML = `<h3>${conf}</h3>`;

    STAT_DIVISION_ORDER.forEach(div => {
      const division = document.createElement('div');
      division.className = 'stats-division stats-division--editable';
      division.innerHTML = `<div class="stats-division__title">${div}</div>`;

      const list = document.createElement('div');
      list.className = 'stats-division__list prediction-list';

      const divisionTeams = teams
        .filter(team => team.conference === conf && team.division === div)
        .map(team => ({ team, prediction: normalizePrediction(predictions[team.name]) }))
        .sort((a, b) => a.prediction.divisionRank - b.prediction.divisionRank);

      divisionTeams.forEach(({ team, prediction }) => {
        const row = document.createElement('div');
        row.className = 'stat-row prediction-row';
        row.dataset.team = team.name;
        row.dataset.divisionKey = `${team.conference}-${team.division}`;

        const teamArea = document.createElement('div');
        teamArea.className = 'stat-row__team prediction-team';

        const rankInput = document.createElement('input');
        rankInput.type = 'number';
        rankInput.min = '1';
        rankInput.max = '4';
        rankInput.value = prediction.divisionRank;
        rankInput.dataset.team = team.name;
        rankInput.dataset.field = 'divisionRank';
        rankInput.disabled = lockExpired;
        rankInput.addEventListener('input', handlePredictionChange);

        const logo = document.createElement('img');
        logo.src = getTeamLogo(team.name);
        logo.alt = `${team.name} Logo`;
        logo.className = 'team-logo';
        logo.loading = 'lazy';

        const teamName = document.createElement('span');
        teamName.className = 'team-name';
        teamName.textContent = team.name;

        teamArea.appendChild(rankInput);
        teamArea.appendChild(logo);
        teamArea.appendChild(teamName);

        const meta = document.createElement('div');
        meta.className = 'stat-row__record prediction-record';

        const winsInput = document.createElement('input');
        winsInput.type = 'number';
        winsInput.min = '0';
        winsInput.max = '17';
        winsInput.value = prediction.wins;
        winsInput.dataset.team = team.name;
        winsInput.dataset.field = 'wins';
        winsInput.disabled = lockExpired;
        winsInput.addEventListener('input', handlePredictionChange);

        const separator = document.createElement('span');
        separator.textContent = '–';
        separator.className = 'record-separator';

        const lossesInput = document.createElement('input');
        lossesInput.type = 'number';
        lossesInput.min = '0';
        lossesInput.max = '17';
        lossesInput.value = prediction.losses;
        lossesInput.dataset.team = team.name;
        lossesInput.dataset.field = 'losses';
        lossesInput.disabled = lockExpired;
        lossesInput.addEventListener('input', handlePredictionChange);

        meta.appendChild(winsInput);
        meta.appendChild(separator);
        meta.appendChild(lossesInput);

        row.appendChild(teamArea);
        row.appendChild(meta);
        list.appendChild(row);
      });

      division.appendChild(list);
      column.appendChild(division);
    });

    container.appendChild(column);
  });

  elements.predictionsContent.appendChild(container);
  highlightConflicts(predictions);
  updateSaveState();
}

function calculateTeamPoints(teamName, prediction) {
  if (!standingsSnapshot) return null;
  const actualStats = standingsSnapshot.teamStats[teamName];
  const actualRank = standingsSnapshot.divisionRanks[teamName];
  if (!actualStats || !actualRank) return null;

  let points = 0;
  if (prediction.divisionRank === actualRank) points += 1;
  if (prediction.wins === actualStats.wins && prediction.losses === actualStats.losses) points += 1;
  return points;
}

function calculateDivisionBonus(divisionEntries) {
  if (!standingsSnapshot) return 0;
  return divisionEntries.every(entry => {
    const rank = standingsSnapshot.divisionRanks[entry.team.name];
    return rank === entry.prediction.divisionRank;
  })
    ? 1
    : 0;
}

function calculateUserTotalPoints(predictions) {
  if (!standingsSnapshot) return null;
  let total = 0;
  const divisionBuckets = {};

  teams.forEach(team => {
    const prediction = normalizePrediction(predictions?.[team.name]);
    const teamPoints = calculateTeamPoints(team.name, prediction);
    if (typeof teamPoints === 'number') total += teamPoints;

    const key = `${team.conference}-${team.division}`;
    divisionBuckets[key] = divisionBuckets[key] || [];
    divisionBuckets[key].push({ team, prediction });
  });

  Object.values(divisionBuckets).forEach(entries => {
    total += calculateDivisionBonus(entries);
  });

  return total;
}

function handlePredictionChange(event) {
  const current = auth.getUser(auth.currentUser);
  if (!current) return;
  const team = event.target.dataset.team;
  const field = event.target.dataset.field;
  const rawValue = parseInt(event.target.value, 10);
  const predictions = migratePredictions(current, predictionSeason);
  const prediction = normalizePrediction(predictions[team]);

  if (field === 'divisionRank') {
    prediction.divisionRank = clamp(rawValue || 1, 1, 4);
  } else if (field === 'wins') {
    prediction.wins = clamp(rawValue || 0, 0, 17);
  } else if (field === 'losses') {
    prediction.losses = clamp(rawValue || 0, 0, 17);
  }

  predictions[team] = prediction;
  event.target.value = prediction[field];
  highlightConflicts(predictions);
  auth.updatePredictions(current.email, predictions, predictionSeason);
  updateSaveState('Änderungen werden automatisch zwischengespeichert.');
}

function highlightConflicts(predictions) {
  const divisionCounts = {};

  teams.forEach(team => {
    const prediction = normalizePrediction(predictions[team.name]);
    const divisionKey = `${team.conference}-${team.division}`;
    divisionCounts[divisionKey] = divisionCounts[divisionKey] || {};
    divisionCounts[divisionKey][prediction.divisionRank] =
      (divisionCounts[divisionKey][prediction.divisionRank] || 0) + 1;
  });

  elements.predictionsContent.querySelectorAll('input[data-field="divisionRank"]').forEach(input => {
    const team = teams.find(t => t.name === input.dataset.team);
    const divisionKey = `${team.conference}-${team.division}`;
    const isConflict = divisionCounts[divisionKey][Number(input.value)] > 1;
    input.classList.toggle('conflict', isConflict);
  });
}

function toBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function fromBase64(str) {
  return decodeURIComponent(escape(atob(str)));
}

function collectGithubConfig() {
  return {
    owner: elements.githubOwner?.value?.trim(),
    repo: elements.githubRepo?.value?.trim(),
    branch: elements.githubBranch?.value?.trim() || 'main',
    file: elements.githubFile?.value?.trim() || 'data/nflpredictions.json',
    token: elements.githubToken?.value?.trim(),
  };
}

function githubHeaders(token) {
  const headers = { Accept: 'application/vnd.github+json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function fetchGithubFile(config) {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.file}?ref=${config.branch}`;
  const response = await fetch(url, { headers: githubHeaders(config.token) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('GitHub antwortet nicht wie erwartet.');
  return response.json();
}

async function pullFromGithub() {
  const config = collectGithubConfig();
  if (!config.owner || !config.repo || !config.file) {
    githubSync.setStatus('Bitte Owner, Repository und Dateipfad ausfüllen.', 'error');
    return;
  }

  githubSync.save(config);
  githubSync.setStatus('Lade Datenbank aus GitHub…');
  try {
    const file = await fetchGithubFile(config);
    if (!file?.content) {
      githubSync.setStatus('Noch keine Datenbank gefunden. Lege die Datei zuerst an.', 'error');
      return;
    }

    const decoded = JSON.parse(fromBase64(file.content));
    if (decoded.users) auth.users = decoded.users;
    if (decoded.lockDates) saveLockDates(decoded.lockDates);
    githubSync.setStatus('Datenbank geladen. Lokale Daten wurden aktualisiert.', 'success');

    updateLockDateForm();
    updateLockInfo();
    const current = auth.getUser(auth.currentUser);
    if (current) renderPredictions(migratePredictions(current, predictionSeason));
    updateAuthUI();
  } catch (err) {
    console.error(err);
    githubSync.setStatus('Download fehlgeschlagen. Prüfe Token, Repository oder Rechte.', 'error');
  }
}

async function pushToGithub() {
  const config = collectGithubConfig();
  if (!config.owner || !config.repo || !config.file) {
    githubSync.setStatus('Bitte Owner, Repository und Dateipfad ausfüllen.', 'error');
    return;
  }

  githubSync.save(config);
  githubSync.setStatus('Lade bestehenden Stand von GitHub…');
  try {
    const existing = await fetchGithubFile(config);
    const payload = {
      message: 'Sync NFL Predictions Datenbank',
      branch: config.branch,
      content: toBase64(
        JSON.stringify(
          {
            users: auth.users,
            lockDates: getLockDates(),
          },
          null,
          2
        )
      ),
    };

    if (existing?.sha) payload.sha = existing.sha;

    const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.file}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: { ...githubHeaders(config.token), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Upload fehlgeschlagen.');
    githubSync.setStatus('Datenbank erfolgreich nach GitHub geschrieben.', 'success');
  } catch (err) {
    console.error(err);
    githubSync.setStatus('Upload fehlgeschlagen. Prüfe Token und Schreibrechte.', 'error');
  }
}

function updateSaveState(message = '') {
  const locked = isLocked();
  elements.savePredictions.disabled = locked;
  if (message) {
    elements.predictionStatus.textContent = message;
  }
}

function updateLockInfo() {
  const lockDate = getLockDateForSeason(predictionSeason);
  const locked = isLocked();
  const readable = lockDate.toLocaleString('de-DE', { dateStyle: 'long', timeStyle: 'short' });
  elements.lockInfo.textContent = locked
    ? `Tipps sind seit ${readable} gesperrt.`
    : `Tipps können bis ${readable} bearbeitet werden.`;
  elements.savePredictions.disabled = locked;
  elements.predictionsContent.querySelectorAll('input').forEach(input => {
    input.disabled = locked;
  });
  updateOverviewAccess();
}

function updateLockDateForm() {
  if (!elements.lockSeasonSelect || !elements.lockDateInput) return;
  const season = elements.lockSeasonSelect.value || predictionSeason;
  const lockDate = getLockDateForSeason(season);
  elements.lockDateInput.value = formatLockDateForInput(lockDate);
  if (elements.lockDateStatus) elements.lockDateStatus.textContent = '';
}

function handleLockDateSave() {
  if (!elements.lockSeasonSelect || !elements.lockDateInput) return;
  const season = elements.lockSeasonSelect.value;
  const rawValue = elements.lockDateInput.value;
  if (!rawValue) {
    elements.lockDateStatus.textContent = 'Bitte ein gültiges Datum wählen.';
    elements.lockDateStatus.className = 'status error';
    return;
  }

  const iso = new Date(rawValue).toISOString();
  const lockDates = getLockDates();
  lockDates[season] = iso;
  saveLockDates(lockDates);
  elements.lockDateStatus.textContent = 'Stichtag gespeichert.';
  elements.lockDateStatus.className = 'status success';

  if (season === predictionSeason) {
    updateLockInfo();
    const current = auth.getUser(auth.currentUser);
    if (current) renderPredictions(migratePredictions(current, predictionSeason));
  }
}

function handleSeasonChange(event) {
  predictionSeason = event.target.value;
  localStorage.setItem(PREDICTION_SEASON_KEY, predictionSeason);

  const current = auth.getUser(auth.currentUser);
  if (current) {
    renderPredictions(migratePredictions(current, predictionSeason));
  }
  updateSaveState();
  if (elements.lockSeasonSelect) {
    elements.lockSeasonSelect.value = predictionSeason;
    updateLockDateForm();
  }
  updateLockInfo();
  loadStats(predictionSeason);
}

function isLocked() {
  const lockDate = getLockDateForSeason(predictionSeason);
  return new Date() > lockDate;
}

function savePredictions() {
  const user = auth.getUser(auth.currentUser);
  if (!user) return;
  const predictions = {};
  const divisionCounts = {};
  let hasConflict = false;
  let invalidRecord = false;

  elements.predictionsContent.querySelectorAll('.prediction-row').forEach(row => {
    const team = row.dataset.team;
    const divisionKey = row.dataset.divisionKey;
    const divisionRank = Number(row.querySelector('input[data-field="divisionRank"]').value);
    const wins = Number(row.querySelector('input[data-field="wins"]').value);
    const losses = Number(row.querySelector('input[data-field="losses"]').value);

    predictions[team] = normalizePrediction({ divisionRank, wins, losses });

    divisionCounts[divisionKey] = divisionCounts[divisionKey] || {};
    divisionCounts[divisionKey][predictions[team].divisionRank] =
      (divisionCounts[divisionKey][predictions[team].divisionRank] || 0) + 1;

    if (predictions[team].wins + predictions[team].losses > 17) {
      invalidRecord = true;
    }
  });

  Object.values(divisionCounts).forEach(counts => {
    Object.values(counts).forEach(count => {
      if (count > 1) hasConflict = true;
    });
  });

  highlightConflicts(predictions);

  if (hasConflict) {
    elements.predictionStatus.textContent = 'Bitte vergebe jede Divisionsplatzierung nur einmal pro Division.';
    elements.predictionStatus.className = 'status error';
    return;
  }

  if (invalidRecord) {
    elements.predictionStatus.textContent = 'Die Bilanz darf maximal 17 Spiele umfassen.';
    elements.predictionStatus.className = 'status error';
    return;
  }

  auth.updatePredictions(user.email, predictions, predictionSeason);
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

let standingsSnapshot = null;

function extractStandings(data) {
  if (!data || !data.children) return null;

  const entries = data.children
    .filter(item => item.standings && item.standings.entries)
    .flatMap(item => item.standings.entries);

  const teamStats = entries.reduce((acc, entry) => {
    const teamName = entry.team?.displayName;
    if (!teamName) return acc;
    const wins = entry.stats?.find(s => s.name === 'wins')?.value;
    const losses = entry.stats?.find(s => s.name === 'losses')?.value;
    const pct = entry.stats?.find(s => s.name === 'winPercent')?.value;
    acc[teamName] = {
      wins: typeof wins === 'number' ? wins : 0,
      losses: typeof losses === 'number' ? losses : 0,
      pct: typeof pct === 'number' ? pct : -1,
      note: entry.standings?.note || '',
      logo: entry.team?.logos?.[0]?.href || getTeamLogo(teamName),
    };
    return acc;
  }, {});

  const divisions = {};
  const divisionRanks = {};

  teams.forEach(team => {
    divisions[team.conference] = divisions[team.conference] || {};
    divisions[team.conference][team.division] = divisions[team.conference][team.division] || [];
    const stats = teamStats[team.name] || { wins: 0, losses: 0, pct: -1, note: '', logo: getTeamLogo(team.name) };
    divisions[team.conference][team.division].push({ team, stats });
  });

  Object.values(divisions).forEach(conf => {
    Object.values(conf).forEach(list => {
      list.sort((a, b) => {
        if (a.stats.pct !== b.stats.pct) return b.stats.pct - a.stats.pct;
        return b.stats.wins - a.stats.wins;
      });
      list.forEach((entry, idx) => {
        divisionRanks[entry.team.name] = idx + 1;
      });
    });
  });

  return { teamStats, divisions, divisionRanks };
}

function renderStats(data) {
  const snapshot = extractStandings(data);
  standingsSnapshot = snapshot;

  if (!snapshot) {
    elements.statsContent.textContent = 'Keine Daten verfügbar.';
    return;
  }

  const container = document.createElement('div');
  container.className = 'stats-columns';

  CONFERENCE_ORDER.forEach(conf => {
    const column = document.createElement('div');
    column.className = 'stats-column';
    const heading = document.createElement('h3');
    heading.textContent = conf;
    column.appendChild(heading);

    STAT_DIVISION_ORDER.forEach(div => {
      const divisionTeams = snapshot.divisions[conf]?.[div] || [];

      const division = document.createElement('div');
      division.className = 'stats-division';
      division.innerHTML = `<div class="stats-division__title">${div}</div>`;

      const list = document.createElement('div');
      list.className = 'stats-division__list';

      divisionTeams.forEach((entry, idx) => {
        const row = document.createElement('div');
        row.className = 'stat-row';
        row.innerHTML = `
          <div class="stat-row__team">
            <span class="stat-rank">${idx + 1}.</span>
            <img src="${entry.stats.logo}" alt="${entry.team.name} Logo" class="team-logo" loading="lazy" />
            <div>
              <strong>${entry.team.name}</strong>
              <p class="stat-meta">${entry.stats.note}</p>
            </div>
          </div>
          <div class="stat-row__record">
            <span>${entry.stats.wins}-${entry.stats.losses}</span>
            <span class="stat-pct">${
              entry.stats.pct >= 0 ? (entry.stats.pct * 100).toFixed(1) + '%' : '–'
            }</span>
          </div>
        `;
        list.appendChild(row);
      });

      division.appendChild(list);
      column.appendChild(division);
    });

    container.appendChild(column);
  });

  elements.statsContent.innerHTML = '';
  elements.statsContent.appendChild(container);
}

async function loadStats(season = predictionSeason) {
  elements.statsContent.textContent = `Lade Daten für Saison ${season}…`;
  try {
    const response = await fetch(
      `https://site.api.espn.com/apis/v2/sports/football/nfl/standings?season=${season}`
    );
    if (!response.ok) throw new Error('Fehler beim Abrufen.');
    const data = await response.json();
    renderStats(data);
    renderPredictionsOverview();
  } catch (err) {
    elements.statsContent.textContent = 'Aktualisierung nicht möglich. Prüfe deine Verbindung.';
    console.error(err);
  }
}

function renderPredictionsOverview() {
  const locked = isLocked();
  elements.overviewContent.innerHTML = '';
  const standingsAvailable = Boolean(standingsSnapshot);

  if (!locked) {
    elements.overviewContent.textContent = 'Die Übersicht wird nach dem Stichtag freigeschaltet.';
    return;
  }

  const users = auth.users;
  if (!users.length) {
    elements.overviewContent.textContent = 'Noch keine Benutzer vorhanden.';
    return;
  }

  const scoreboard = buildOverviewScoreboard(users);
  if (scoreboard) {
    elements.overviewContent.appendChild(scoreboard);
  }

  users.forEach(user => {
    const seasonPredictions = migratePredictions(user, predictionSeason);
    const totalPoints = calculateUserTotalPoints(seasonPredictions);
    const card = document.createElement('div');
    card.className = 'overview-card';

    const title = document.createElement('div');
    title.className = 'overview-card__header';
    title.innerHTML = `
      <div>
        <h3>${user.name}</h3>
        <p class="stat-meta">${user.email}${user.favorite ? ` • ${user.favorite}` : ''}</p>
        ${typeof totalPoints === 'number' ? `<p class="stat-meta">Gesamtpunkte: ${totalPoints}</p>` : ''}
      </div>
    `;

    const grid = document.createElement('div');
    grid.className = 'overview-grid';

    CONFERENCE_ORDER.forEach(conf => {
      const column = document.createElement('div');
      column.className = 'overview-column';
      column.innerHTML = `<h4>${conf}</h4>`;

      STAT_DIVISION_ORDER.forEach(div => {
        const division = document.createElement('div');
        division.className = 'overview-division';
        division.innerHTML = `<h5>${div}</h5>`;

        const list = document.createElement('ol');
        list.className = 'overview-list';

        const divisionTeams = teams
          .filter(t => t.conference === conf && t.division === div)
          .map(team => ({ team, prediction: normalizePrediction(seasonPredictions?.[team.name]) }))
          .sort((a, b) => a.prediction.divisionRank - b.prediction.divisionRank);

        const divisionBonus = standingsAvailable ? calculateDivisionBonus(divisionTeams) : null;

        divisionTeams.forEach(entry => {
          const item = document.createElement('li');
          const teamPoints = calculateTeamPoints(entry.team.name, entry.prediction);
          const pointsLabel =
            typeof teamPoints === 'number' ? `${teamPoints} Punkt${teamPoints === 1 ? '' : 'e'}` : '–';
          item.innerHTML = `
            <div class="overview-team">
              <span class="stat-rank">${entry.prediction.divisionRank}.</span>
              <img src="${getTeamLogo(entry.team.name)}" alt="${entry.team.name} Logo" class="team-logo" loading="lazy" />
              <span class="team-name">${entry.team.name}</span>
            </div>
            <div class="overview-meta">
              <span class="stat-pct">${entry.prediction.wins}-${entry.prediction.losses}</span>
              <span class="points-badge">${pointsLabel}</span>
            </div>
          `;
          list.appendChild(item);
        });

        division.appendChild(list);
        if (standingsAvailable) {
          const bonusRow = document.createElement('div');
          bonusRow.className = `division-bonus ${divisionBonus ? 'division-bonus--earned' : ''}`;
          bonusRow.textContent = divisionBonus
            ? 'Bonus: +1 Punkt für perfekte Platzierungen'
            : 'Bonus: 0 Punkte (Platzierungen weichen ab)';
          division.appendChild(bonusRow);
        }
        column.appendChild(division);
      });

      grid.appendChild(column);
    });

    card.appendChild(title);
    card.appendChild(grid);
    elements.overviewContent.appendChild(card);
  });
}

function buildOverviewScoreboard(users) {
  if (!standingsSnapshot) return null;

  const wrapper = document.createElement('div');
  wrapper.className = 'overview-scoreboard';

  const header = document.createElement('div');
  header.className = 'overview-scoreboard__header';
  header.innerHTML = `
    <div>
      <h3 style="margin: 0;">Scoreboard</h3>
      <p class="stat-meta" style="margin: 4px 0 0;">Vergleich der tatsächlichen Standings mit allen Tipps.</p>
    </div>
    <div class="hint">Punkte werden nur berechnet, wenn aktuelle Standings vorhanden sind.</div>
  `;

  const grid = document.createElement('div');
  grid.className = 'scoreboard-grid';

  CONFERENCE_ORDER.forEach(conf => {
    STAT_DIVISION_ORDER.forEach(div => {
      const divisionStandings = standingsSnapshot?.divisions?.[conf]?.[div] || [];
      const scoreboard = document.createElement('div');
      scoreboard.className = 'scoreboard';
      scoreboard.innerHTML = `<div class="scoreboard__title">${conf} ${div}</div>`;

      const headerRow = document.createElement('div');
      headerRow.className = 'scoreboard__header-row';

      const standingsHeader = document.createElement('div');
      standingsHeader.className = 'scoreboard__cell scoreboard__cell--header';
      standingsHeader.innerHTML = '<div class="scoreboard__player-name">Standings</div>';
      headerRow.appendChild(standingsHeader);

      users.forEach(user => {
        const totalPoints = calculateUserTotalPoints(migratePredictions(user, predictionSeason));
        const cell = document.createElement('div');
        cell.className = 'scoreboard__cell scoreboard__cell--header';
        cell.innerHTML = `
          <div class="scoreboard__player-name">${user.name}</div>
          <div class="scoreboard__player-points">${
            typeof totalPoints === 'number' ? `${totalPoints} Punkte` : '–'
          }</div>
        `;
        headerRow.appendChild(cell);
      });

      scoreboard.appendChild(headerRow);

      const divisionTeams = teams.filter(team => team.conference === conf && team.division === div);

      const userDivisionPredictions = users.map(user => {
        const predictions = migratePredictions(user, predictionSeason);
        return {
          user,
          entries: divisionTeams
            .map(team => ({ team, prediction: normalizePrediction(predictions?.[team.name]) }))
            .sort((a, b) => a.prediction.divisionRank - b.prediction.divisionRank),
        };
      });

      const maxRows = Math.max(divisionStandings.length, divisionTeams.length);

      for (let i = 0; i < maxRows; i++) {
        const row = document.createElement('div');
        row.className = 'scoreboard__row';

        const actualEntry = divisionStandings[i];
        const actualCell = document.createElement('div');
        actualCell.className = 'scoreboard__cell';
        if (actualEntry) {
          actualCell.innerHTML = `
            <div class="scoreboard__team-row">
              <span class="scoreboard__rank">${i + 1}.</span>
              <img src="${actualEntry.stats.logo}" alt="${actualEntry.team.name} Logo" class="team-logo" loading="lazy" />
              <span class="team-name">${actualEntry.team.name}</span>
            </div>
            <div class="scoreboard__record">${actualEntry.stats.wins}-${actualEntry.stats.losses}</div>
          `;
        } else {
          actualCell.textContent = '–';
        }
        row.appendChild(actualCell);

        userDivisionPredictions.forEach(({ entries }) => {
          const predicted = entries[i];
          const cell = document.createElement('div');
          cell.className = 'scoreboard__cell';

          if (predicted) {
            const teamPoints = calculateTeamPoints(predicted.team.name, predicted.prediction);
            const pointsLabel =
              typeof teamPoints === 'number' ? `${teamPoints} Punkt${teamPoints === 1 ? '' : 'e'}` : '–';

            cell.innerHTML = `
              <div class="scoreboard__team-row">
                <span class="scoreboard__rank">${predicted.prediction.divisionRank}.</span>
                <img src="${getTeamLogo(predicted.team.name)}" alt="${predicted.team.name} Logo" class="team-logo" loading="lazy" />
                <span class="team-name">${predicted.team.name}</span>
              </div>
              <div class="scoreboard__team-points">${pointsLabel}</div>
            `;
          } else {
            cell.textContent = '–';
          }

          row.appendChild(cell);
        });

        scoreboard.appendChild(row);
      }

      grid.appendChild(scoreboard);
    });
  });

  wrapper.appendChild(header);
  wrapper.appendChild(grid);

  return wrapper;
}

function updateOverviewAccess() {
  const locked = isLocked();
  const overviewBtn = Array.from(elements.tabButtons).find(btn => btn.dataset.tab === 'overviewTab');
  if (overviewBtn) {
    overviewBtn.disabled = !locked;
    overviewBtn.classList.toggle('tab-button--disabled', !locked);
    if (!locked && overviewBtn.classList.contains('active')) {
      switchTab('profileTab');
    }
  }

  elements.overviewStatus.textContent = locked
    ? 'Stichtag erreicht – alle Tipps werden angezeigt.'
    : 'Die Übersicht wird am Stichtag automatisch freigeschaltet.';

  renderPredictionsOverview();
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
  elements.lockSeasonSelect?.addEventListener('change', updateLockDateForm);
  elements.saveLockDate?.addEventListener('click', handleLockDateSave);
  elements.tabButtons.forEach(btn =>
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      switchTab(btn.dataset.tab);
    })
  );
  elements.refreshStats.addEventListener('click', loadStats);
  elements.seasonPicker?.addEventListener('change', handleSeasonChange);
  elements.githubSaveConfig?.addEventListener('click', () => {
    githubSync.save(collectGithubConfig());
    githubSync.setStatus('GitHub-Konfiguration gespeichert.', 'success');
  });
  elements.githubPull?.addEventListener('click', pullFromGithub);
  elements.githubPush?.addEventListener('click', pushToGithub);
}

function init() {
  populateTeamSelect();
  populateSeasonPicker();
  populateLockSeasonSelect();
  githubSync.applyConfigToForm();
  showAuth('login');
  setupEvents();
  if (auth.currentUser) {
    updateAuthUI();
  }
  updateOverviewAccess();
  loadStats();
}

document.addEventListener('DOMContentLoaded', init);
