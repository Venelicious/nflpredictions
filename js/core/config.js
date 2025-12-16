// core/config.js
export const CONFIG = {
  API_BASE_URL: '/api.php',
  API_ENABLED: true,
  DEBOUNCE_MS: 500,
  FETCH_TIMEOUT: 10000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};

export const DEFAULT_LOCK_DATES = {
  '2024': '2024-09-01T12:00:00Z',
  '2025': '2025-09-01T12:00:00Z',
};

export const CONFERENCE_ORDER = ['AFC', 'NFC'];
export const DIVISION_ORDER = ['East', 'North', 'South', 'West'];
export const STAT_DIVISION_ORDER = ['North', 'East', 'South', 'West'];

export const AVAILABLE_SEASONS = [
  { value: '2024', label: 'Saison 2024/2025' },
  { value: '2025', label: 'Saison 2025/2026' },
];

export const STORAGE_KEYS = {
  PREDICTION_SEASON: 'nflp_prediction_season',
  LOCK_DATES: 'nflp_lock_dates',
  CO_PLAYERS: 'nflp_co_players',
  ACTIVE_PREDICTOR: 'nflp_active_predictor',
};