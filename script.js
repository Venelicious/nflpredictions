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
const CO_PLAYER_STORAGE_KEY = 'nflp_co_players';
const ACTIVE_PREDICTOR_KEY = 'nflp_active_predictor';
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

function splitTeamName(teamName) {
  const parts = teamName.split(' ');
  if (parts.length === 1) return { city: teamName, alias: '' };
  const alias = parts.pop();
  return { city: parts.join(' '), alias };
}

function normalizeTeamKey(label = '') {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9 ]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const teamNameLookup = teams.reduce((acc, team) => {
  acc[normalizeTeamKey(team.name)] = team.name;
  return acc;
}, {});

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
  coPlayerSelect: document.getElementById('coPlayerSelect'),
  addCoPlayer: document.getElementById('addCoPlayer'),
  statsContent: document.getElementById('statsContent'),
  refreshStats: document.getElementById('refreshStats'),
  overviewContent: document.getElementById('overviewContent'),
  overviewStatus: document.getElementById('overviewStatus'),
  tableImport: document.getElementById('tableImport'),
  importStatus: document.getElementById('importStatus'),
  importTableBtn: document.getElementById('importTableBtn'),
  lockSeasonSelect: document.getElementById('lockSeasonSelect'),
  lockDateInput: document.getElementById('lockDateInput'),
  lockDateStatus: document.getElementById('lockDateStatus'),
  saveLockDate: document.getElementById('saveLockDate'),
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

function readCoPlayers() {
  return JSON.parse(localStorage.getItem(CO_PLAYER_STORAGE_KEY) || '[]');
}

function saveCoPlayers(list) {
  localStorage.setItem(CO_PLAYER_STORAGE_KEY, JSON.stringify(list));
}

function getActivePredictor() {
  const fallback = { type: 'user', id: auth.currentUser || '' };
  try {
    return JSON.parse(localStorage.getItem(ACTIVE_PREDICTOR_KEY)) || fallback;
  } catch (err) {
    console.error('Aktiver Mitspieler konnte nicht geladen werden.', err);
    return fallback;
  }
}

function setActivePredictor({ type = 'user', id = '' }) {
  const normalized = { type: type === 'co' ? 'co' : 'user', id: id || '' };
  localStorage.setItem(ACTIVE_PREDICTOR_KEY, JSON.stringify(normalized));
  return normalized;
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

function migrateCoPlayerPredictions(player, season = predictionSeason) {
  if (!player) return defaultPredictions();

  const predictionsBySeason = { ...(player.predictionsBySeason || {}) };
  if (!Object.keys(predictionsBySeason).length && player.predictions) {
    predictionsBySeason[AVAILABLE_SEASONS[0].value] = player.predictions;
  }

  if (!predictionsBySeason[season]) {
    predictionsBySeason[season] = defaultPredictions();
  }

  const coPlayers = readCoPlayers();
  const updated = coPlayers.map(p => (p.id === player.id ? { ...p, predictionsBySeason } : p));
  saveCoPlayers(updated);

  return predictionsBySeason[season];
}

function normalizePrediction(prediction = {}) {
  return {
    divisionRank: clamp(Number(prediction.divisionRank) || 1, 1, 4),
    wins: clamp(Number(prediction.wins) || 0, 0, 17),
    losses: clamp(Number(prediction.losses) || 0, 0, 17),
  };
}

function detectDelimiter(line) {
  if (line.includes(';')) return ';';
  if (line.includes('\t')) return '\t';
  return ',';
}

function parsePredictionCell(cell) {
  const normalized = cell || '';
  const match = normalized.match(/(\d+)\D+(\d+)\s*-\s*(\d+)/);
  if (!match) return null;
  return normalizePrediction({
    divisionRank: Number(match[1]),
    wins: Number(match[2]),
    losses: Number(match[3]),
  });
}

function findTeamByLabel(label = '') {
  const key = normalizeTeamKey(label);
  return teamNameLookup[key] || null;
}

function parseTableInput(text) {
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error('Mindestens Kopfzeile und eine Datenzeile einfügen.');
  }

  const delimiter = detectDelimiter(lines[0]);
  const header = lines[0].split(delimiter).map(cell => cell.trim());

  if (header.length < 2) {
    throw new Error('Die Kopfzeile benötigt mindestens einen Spielernamen.');
  }

  const playerNames = header.slice(1).map(name => name || 'Mitspieler');
  const rows = lines.slice(1).map(line => line.split(delimiter).map(cell => cell.trim()));

  return { playerNames, rows };
}

function importTableData(raw) {
  const { playerNames, rows } = parseTableInput(raw);
  const existing = readCoPlayers();
  const playerMap = new Map();

  playerNames.forEach(name => {
    const current = existing.find(p => p.name === name);
    const fallbackPredictions = current
      ? migrateCoPlayerPredictions(current, predictionSeason)
      : defaultPredictions();
    const predictionsBySeason = {
      ...(current?.predictionsBySeason || {}),
      [predictionSeason]: { ...fallbackPredictions },
    };

    playerMap.set(name, {
      id:
        current?.id ||
        (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `co-${Date.now()}-${Math.random()}`),
      name,
      predictionsBySeason,
    });
  });

  const skippedTeams = [];

  rows.forEach(cells => {
    const [teamCell, ...values] = cells;
    const teamName = findTeamByLabel(teamCell);
    if (!teamName) {
      skippedTeams.push(teamCell || '');
      return;
    }

    playerNames.forEach((playerName, idx) => {
      const cell = values[idx] || '';
      const parsed = parsePredictionCell(cell);
      if (!parsed) return;

      const entry = playerMap.get(playerName);
      const seasonPredictions = entry.predictionsBySeason[predictionSeason] || defaultPredictions();
      entry.predictionsBySeason[predictionSeason] = { ...seasonPredictions, [teamName]: parsed };
      playerMap.set(playerName, entry);
    });
  });

  const updatedPlayers = existing
    .filter(player => !playerMap.has(player.name))
    .concat(Array.from(playerMap.values()));

  saveCoPlayers(updatedPlayers);
  refreshCoPlayerSelect();
  renderPredictionsOverview();

  return { playerNames, skippedTeams, newPlayers: Array.from(playerMap.values()) };
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

function refreshCoPlayerSelect() {
  if (!elements.coPlayerSelect) return;
  const coPlayers = readCoPlayers();
  const active = getActivePredictor();

  elements.coPlayerSelect.innerHTML = '';

  if (auth.currentUser) {
    const currentUser = auth.getUser(auth.currentUser);
    const userOption = document.createElement('option');
    userOption.value = `user:${auth.currentUser}`;
    userOption.textContent = currentUser ? `Du (${currentUser.name || currentUser.email})` : 'Eigenes Profil';
    elements.coPlayerSelect.appendChild(userOption);
  }

  coPlayers.forEach(player => {
    const option = document.createElement('option');
    option.value = `co:${player.id}`;
    option.textContent = player.name || 'Mitspieler';
    elements.coPlayerSelect.appendChild(option);
  });

  const preferredValue = `${active.type}:${active.id}`;
  const hasPreferred = Array.from(elements.coPlayerSelect.options).some(opt => opt.value === preferredValue);
  elements.coPlayerSelect.value = hasPreferred
    ? preferredValue
    : elements.coPlayerSelect.options[0]?.value || '';
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
    setActivePredictor({ type: 'user', id: current });
    refreshCoPlayerSelect();
    loadPredictionsForActive();
  } else {
    refreshCoPlayerSelect();
    updateOverviewAccess();
  }
}

function switchTab(targetId) {
  const targetButton = Array.from(elements.tabButtons).find(btn => btn.dataset.tab === targetId);
  if (targetButton?.disabled) return;
  elements.tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === targetId));
  elements.tabPanes.forEach(pane => pane.classList.toggle('active', pane.id === targetId));
}

function getActivePredictionOwner() {
  const active = getActivePredictor();
  if (active.type === 'co') {
    const player = readCoPlayers().find(p => p.id === active.id);
    return {
      type: 'co',
      name: player?.name || 'Mitspieler',
      predictions: migrateCoPlayerPredictions(player, predictionSeason),
      identifier: player?.id,
    };
  }

  const user = auth.getUser(auth.currentUser);
  return {
    type: 'user',
    name: user?.name || user?.email || 'Eigenes Profil',
    predictions: migratePredictions(user, predictionSeason),
    identifier: user?.email,
  };
}

function handlePredictorChange(event) {
  const value = event.target.value || '';
  const [type, id] = value.split(':');
  setActivePredictor({ type: type === 'co' ? 'co' : 'user', id });
  loadPredictionsForActive();
}

function handleAddCoPlayer() {
  const name = prompt('Wie heißt der Mitspieler?');
  if (!name) return;
  const coPlayers = readCoPlayers();
  const newPlayer = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `co-${Date.now()}`,
    name: name.trim(),
    predictionsBySeason: { [predictionSeason]: defaultPredictions() },
  };
  saveCoPlayers([...coPlayers, newPlayer]);
  setActivePredictor({ type: 'co', id: newPlayer.id });
  refreshCoPlayerSelect();
  loadPredictionsForActive();
  elements.predictionStatus.textContent = `${newPlayer.name} wurde angelegt. Du bearbeitest jetzt seine Tipps.`;
}

function loadPredictionsForActive() {
  const owner = getActivePredictionOwner();
  renderPredictions(owner.predictions);
  elements.predictionStatus.textContent = `Tipps für ${owner.name}`;
  updateLockInfo();
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
        teamName.className = 'team-name team-name--stacked';
        const { city, alias } = splitTeamName(team.name);
        teamName.innerHTML = `<span class="team-name__city">${city}</span><span class="team-name__alias">${alias}</span>`;

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
  const owner = getActivePredictionOwner();
  if (!owner) return;
  const team = event.target.dataset.team;
  const field = event.target.dataset.field;
  const rawValue = parseInt(event.target.value, 10);
  const predictions = owner.predictions;
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
  if (owner.type === 'co') {
    const updated = readCoPlayers().map(player => {
      if (player.id !== owner.identifier) return player;
      const predictionsBySeason = { ...(player.predictionsBySeason || {}), [predictionSeason]: predictions };
      return { ...player, predictionsBySeason };
    });
    saveCoPlayers(updated);
  } else if (owner.identifier) {
    auth.updatePredictions(owner.identifier, predictions, predictionSeason);
  }
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

  loadPredictionsForActive();
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
  const owner = getActivePredictionOwner();
  if (!owner) return;
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

  if (owner.type === 'co') {
    const updated = readCoPlayers().map(player => {
      if (player.id !== owner.identifier) return player;
      const predictionsBySeason = { ...(player.predictionsBySeason || {}), [predictionSeason]: predictions };
      return { ...player, predictionsBySeason };
    });
    saveCoPlayers(updated);
    elements.predictionStatus.textContent = 'Tipps des Mitspielers gespeichert!';
  } else {
    auth.updatePredictions(owner.identifier, predictions, predictionSeason);
    elements.predictionStatus.textContent = 'Tipps gespeichert!';
  }
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

function getParticipantPredictions(participant) {
  if (participant?.email) {
    return migratePredictions(participant, predictionSeason);
  }
  return migrateCoPlayerPredictions(participant, predictionSeason);
}

function listParticipants() {
  const users = auth.users || [];
  const coPlayers = readCoPlayers();
  return [...users, ...coPlayers];
}

function renderPredictionsOverview() {
  const locked = isLocked();
  elements.overviewContent.innerHTML = '';
  const standingsAvailable = Boolean(standingsSnapshot);

  if (!locked) {
    elements.overviewContent.textContent = 'Die Übersicht wird nach dem Stichtag freigeschaltet.';
    return;
  }

  const participants = listParticipants();
  if (!participants.length) {
    elements.overviewContent.textContent = 'Noch keine Benutzer vorhanden.';
    return;
  }

  const scoreboard = buildOverviewScoreboard(participants);
  if (scoreboard) {
    elements.overviewContent.appendChild(scoreboard);
    return;
  }

  elements.overviewContent.textContent = 'Aktuelle Standings fehlen für den Scoreboard-Vergleich.';
}

function buildOverviewScoreboard(participants) {
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

  const columnTemplate = `repeat(${participants.length + 1}, minmax(150px, 1fr))`;

  wrapper.appendChild(header);

  const headerRow = document.createElement('div');
  headerRow.className = 'scoreboard__header-row scoreboard__header-row--global';
  headerRow.style.gridTemplateColumns = columnTemplate;

  const standingsHeader = document.createElement('div');
  standingsHeader.className = 'scoreboard__cell scoreboard__cell--header';
  standingsHeader.innerHTML = '<div class="scoreboard__player-name">Standings</div>';
  headerRow.appendChild(standingsHeader);

  participants.forEach(player => {
    const totalPoints = calculateUserTotalPoints(getParticipantPredictions(player));
    const cell = document.createElement('div');
    cell.className = 'scoreboard__cell scoreboard__cell--header';
    cell.innerHTML = `
      <div class="scoreboard__player-name">${player.name}</div>
      <div class="scoreboard__player-points">${
        typeof totalPoints === 'number' ? `${totalPoints} Punkte` : '–'
      }</div>
    `;
    headerRow.appendChild(cell);
  });

  wrapper.appendChild(headerRow);

  const grid = document.createElement('div');
  grid.className = 'scoreboard-grid';

  CONFERENCE_ORDER.forEach(conf => {
    STAT_DIVISION_ORDER.forEach(div => {
      const divisionStandings = standingsSnapshot?.divisions?.[conf]?.[div] || [];
      const scoreboard = document.createElement('div');
      scoreboard.className = 'scoreboard';
      scoreboard.innerHTML = `<div class="scoreboard__title">${conf} ${div}</div>`;

      const divisionTeams = teams.filter(team => team.conference === conf && team.division === div);

      const userDivisionPredictions = participants.map(user => {
        const predictions = getParticipantPredictions(user);
        return {
          user,
          entries: divisionTeams
            .map(team => ({ team, prediction: normalizePrediction(predictions?.[team.name]) }))
            .sort((a, b) => a.prediction.divisionRank - b.prediction.divisionRank),
        };
      });

      const maxRows = Math.max(divisionStandings.length, divisionTeams.length);

      const bonusRow = document.createElement('div');
      bonusRow.className = 'scoreboard__row scoreboard__bonus-row';
      bonusRow.style.gridTemplateColumns = columnTemplate;

      const bonusLabel = document.createElement('div');
      bonusLabel.className = 'scoreboard__cell scoreboard__cell--info';
      bonusLabel.innerHTML = `
        <div class="scoreboard__bonus-label">Perfektes Ranking</div>
        <div class="scoreboard__bonus-hint">+1 Punkt pro Division</div>
      `;
      bonusRow.appendChild(bonusLabel);

      userDivisionPredictions.forEach(({ entries }) => {
        const bonus = calculateDivisionBonus(entries);
        const cell = document.createElement('div');
        cell.className = 'scoreboard__cell scoreboard__cell--bonus';
        cell.innerHTML = `
          <div class="bonus-chip ${bonus ? 'bonus-chip--active' : ''}">
            ${bonus ? '⭐️ +1' : '–'}
          </div>
          <div class="bonus-chip__caption">${bonus ? 'Perfekt getippt' : 'Noch offen'}</div>
        `;
        bonusRow.appendChild(cell);
      });

      scoreboard.appendChild(bonusRow);

      for (let i = 0; i < maxRows; i++) {
        const row = document.createElement('div');
        row.className = 'scoreboard__row';
        row.style.gridTemplateColumns = columnTemplate;

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
              <div class="scoreboard__record">Tipp: ${predicted.prediction.wins}-${predicted.prediction.losses}</div>
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

function handleTableImport() {
  if (!elements.tableImport || !elements.importStatus) return;
  const raw = elements.tableImport.value.trim();
  if (!raw) {
    elements.importStatus.textContent = 'Bitte füge die Tabelle ein.';
    return;
  }

  try {
    const { playerNames, skippedTeams, newPlayers } = importTableData(raw);
    elements.importStatus.textContent = `Import abgeschlossen. ${playerNames.length} Spieler übernommen.`;
    if (skippedTeams.length) {
      elements.importStatus.textContent += ` Übersprungene Teams: ${[...new Set(skippedTeams)].join(', ')}.`;
    }

    if (newPlayers.length) {
      setActivePredictor({ type: 'co', id: newPlayers[0].id });
      loadPredictionsForActive();
    }
  } catch (err) {
    elements.importStatus.textContent = err.message || 'Import fehlgeschlagen.';
  }
}

function setupEvents() {
  elements.showRegister.addEventListener('click', () => showAuth('register'));
  elements.showLogin.addEventListener('click', () => showAuth('login'));
  elements.startNow.addEventListener('click', () => showAuth('register'));
  elements.registerForm.addEventListener('submit', handleRegister);
  elements.loginForm.addEventListener('submit', handleLogin);
  elements.logoutBtn.addEventListener('click', () => {
    auth.logout();
    setActivePredictor({ type: 'user', id: '' });
    updateAuthUI();
    showAuth('login');
  });
  elements.profileForm.addEventListener('submit', handleProfileSubmit);
  elements.savePredictions.addEventListener('click', savePredictions);
  elements.lockSeasonSelect?.addEventListener('change', updateLockDateForm);
  elements.saveLockDate?.addEventListener('click', handleLockDateSave);
  elements.coPlayerSelect?.addEventListener('change', handlePredictorChange);
  elements.addCoPlayer?.addEventListener('click', handleAddCoPlayer);
  elements.tabButtons.forEach(btn =>
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      switchTab(btn.dataset.tab);
    })
  );
  elements.refreshStats.addEventListener('click', loadStats);
  elements.seasonPicker?.addEventListener('change', handleSeasonChange);
  elements.importTableBtn?.addEventListener('click', handleTableImport);
}

function init() {
  populateTeamSelect();
  populateSeasonPicker();
  populateLockSeasonSelect();
  showAuth('login');
  setupEvents();
  if (auth.currentUser) {
    updateAuthUI();
  }
  updateOverviewAccess();
  loadStats();
}

document.addEventListener('DOMContentLoaded', init);
