// features/auth.js
import { apiClient } from '../api/apiClient.js';
import { validator } from '../core/validator.js';
import { safeStorage } from '../core/storage.js';
import { defaultPredictions } from './predictions.js';

export const auth = {
  currentUserEmail: '',
  profiles: {},

  async init() {
    try {
      const { user } = await apiClient.me();
      this.mergeUser(user);
      await this.syncTips();
    } catch {
      this.currentUserEmail = '';
    }
  },

  mergeUser(user, tips = []) {
    if (!user?.email) return;

    const existing = this.profiles[user.email] || { predictionsBySeason: {} };
    const predictionsBySeason = { ...(existing.predictionsBySeason || {}) };

    tips.forEach(tip => {
      if (tip.payload) predictionsBySeason[tip.season] = tip.payload;
    });

    if (!predictionsBySeason[this.season]) {
      predictionsBySeason[this.season] = defaultPredictions();
    }

    this.profiles[user.email] = {
      ...existing,
      ...user,
      favorite: user.favorite_team || user.favorite || '',
      predictionsBySeason,
    };

    this.currentUserEmail = user.email;
  },

  get users() {
    return Object.values(this.profiles);
  },

  get currentUser() {
    return this.currentUserEmail;
  },

  getUser(email) {
    return this.profiles[email] || null;
  },

  async register({ name, email, password }) {
    if (!validator.email(email)) throw new Error('Ungültige E-Mail');
    if (!validator.password(password)) throw new Error('Passwort zu kurz');
    const { user } = await apiClient.register({ name, email, password });
    this.mergeUser(user);
    await this.syncTips();
    return user;
  },

  async login(email, password) {
    const { user } = await apiClient.login({ email, password });
    this.mergeUser(user);
    await this.syncTips();
    return user;
  },

  async logout() {
    try { await apiClient.logout(); } catch {}
    this.currentUserEmail = '';
    this.profiles = {};
  },

  async syncTips() {
    if (!this.currentUserEmail) return;
    try {
      const { tips } = await apiClient.listTips();
      const bySeason = tips.reduce((acc, t) => {
        if (t.payload) acc[t.season] = t.payload;
        return acc;
      }, {});
      const cur = this.profiles[this.currentUserEmail] || {};
      this.profiles[this.currentUserEmail] = {
        ...cur,
        predictionsBySeason: { ...(cur.predictionsBySeason || {}), ...bySeason },
      };
    } catch {}
  },
};