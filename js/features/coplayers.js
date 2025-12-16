// features/coplayers.js
import { safeStorage } from '../core/storage.js';
import { STORAGE_KEYS } from '../core/config.js';

export function readCoPlayers() {
  return safeStorage.get(STORAGE_KEYS.CO_PLAYERS, []);
}

export function saveCoPlayers(list) {
  safeStorage.set(STORAGE_KEYS.CO_PLAYERS, list);
}

export function getActivePredictor() {
  return safeStorage.get(STORAGE_KEYS.ACTIVE_PREDICTOR, { type: 'user', id: '' });
}

export function setActivePredictor(payload) {
  safeStorage.set(STORAGE_KEYS.ACTIVE_PREDICTOR, payload);
  return payload;
}