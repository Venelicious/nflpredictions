const LOCK_DATE = new Date('2025-09-01T12:00:00Z');
const CONFERENCE_ORDER = ['AFC', 'NFC'];
const DIVISION_ORDER = ['East', 'North', 'South', 'West'];
const STAT_DIVISION_ORDER = ['North', 'East', 'South', 'West'];

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
  overviewContent: document.getElementById('overviewContent'),
  overviewStatus: document.getElementById('overviewStatus'),
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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

function createGroupRow(label, level) {
  const row = document.createElement('tr');
  row.className = `group-row group-row--${level}`;
  const cell = document.createElement('td');
  cell.colSpan = 5;
  cell.textContent = label;
  row.appendChild(cell);
  return row;
}

function renderPredictions(predictions) {
  elements.predictionsTable.innerHTML = '';
  const lockExpired = isLocked();
  const sorted = sortTeams();
  let currentConference = '';
  let currentDivision = '';

  sorted.forEach(team => {
    const prediction = normalizePrediction(predictions[team.name]);

    if (team.conference !== currentConference) {
      currentConference = team.conference;
      elements.predictionsTable.appendChild(createGroupRow(`${team.league} – ${currentConference}`, 'conference'));
      currentDivision = '';
    }

    if (team.division !== currentDivision) {
      currentDivision = team.division;
      elements.predictionsTable.appendChild(createGroupRow(`${currentConference} ${currentDivision}`, 'division'));
    }

    const row = document.createElement('tr');
    row.dataset.team = team.name;
    row.dataset.divisionKey = `${team.conference}-${team.division}`;

    const teamCell = document.createElement('td');
    teamCell.appendChild(renderTeamLabel(team.name));

    const conferenceCell = document.createElement('td');
    conferenceCell.textContent = team.conference;

    const divisionCell = document.createElement('td');
    divisionCell.textContent = team.division;

    const rankCell = document.createElement('td');
    const rankInput = document.createElement('input');
    rankInput.type = 'number';
    rankInput.min = '1';
    rankInput.max = '4';
    rankInput.value = prediction.divisionRank;
    rankInput.dataset.team = team.name;
    rankInput.dataset.field = 'divisionRank';
    rankInput.disabled = lockExpired;
    rankInput.addEventListener('input', handlePredictionChange);
    rankCell.appendChild(rankInput);

    const recordCell = document.createElement('td');
    recordCell.className = 'record-inputs';

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

    recordCell.appendChild(winsInput);
    recordCell.appendChild(separator);
    recordCell.appendChild(lossesInput);

    row.appendChild(teamCell);
    row.appendChild(conferenceCell);
    row.appendChild(divisionCell);
    row.appendChild(rankCell);
    row.appendChild(recordCell);

    elements.predictionsTable.appendChild(row);
  });

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
  const prediction = normalizePrediction(current.predictions[team]);

  if (field === 'divisionRank') {
    prediction.divisionRank = clamp(rawValue || 1, 1, 4);
  } else if (field === 'wins') {
    prediction.wins = clamp(rawValue || 0, 0, 17);
  } else if (field === 'losses') {
    prediction.losses = clamp(rawValue || 0, 0, 17);
  }

  current.predictions[team] = prediction;
  event.target.value = prediction[field];
  highlightConflicts(current.predictions);
  auth.updatePredictions(current.email, current.predictions);
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

  elements.predictionsTable.querySelectorAll('input[data-field="divisionRank"]').forEach(input => {
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
  const locked = isLocked();
  const readable = LOCK_DATE.toLocaleString('de-DE', { dateStyle: 'long', timeStyle: 'short' });
  elements.lockInfo.textContent = locked
    ? `Tipps sind seit ${readable} gesperrt.`
    : `Tipps können bis ${readable} bearbeitet werden.`;
  elements.savePredictions.disabled = locked;
  elements.predictionsTable.querySelectorAll('input').forEach(input => {
    input.disabled = locked;
  });
  updateOverviewAccess();
}

function isLocked() {
  return new Date() > LOCK_DATE;
}

function savePredictions() {
  const user = auth.getUser(auth.currentUser);
  if (!user) return;
  const predictions = {};
  const divisionCounts = {};
  let hasConflict = false;
  let invalidRecord = false;

  elements.predictionsTable.querySelectorAll('tr[data-team]').forEach(row => {
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

  users.forEach(user => {
    const totalPoints = calculateUserTotalPoints(user.predictions);
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
          .map(team => ({ team, prediction: normalizePrediction(user.predictions?.[team.name]) }))
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
              <span>${entry.team.name}</span>
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
  elements.tabButtons.forEach(btn =>
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      switchTab(btn.dataset.tab);
    })
  );
  elements.refreshStats.addEventListener('click', loadStats);
}

function init() {
  populateTeamSelect();
  showAuth('login');
  setupEvents();
  if (auth.currentUser) {
    updateAuthUI();
  }
  updateOverviewAccess();
  loadStats();
}

document.addEventListener('DOMContentLoaded', init);
