// api/apiClient.js
import { CONFIG } from '../core/config.js';

export const apiClient = {
  async safeFetch(url, options = {}) {
    for (let i = 0; i < CONFIG.MAX_RETRIES; i++) {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), CONFIG.FETCH_TIMEOUT);

        const res = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || res.statusText);
        return data;
      } catch (err) {
        if (i === CONFIG.MAX_RETRIES - 1) throw err;
        await new Promise(r => setTimeout(r, CONFIG.RETRY_DELAY * (i + 1)));
      }
    }
  },

  request(path, options = {}) {
    return this.safeFetch(`${CONFIG.API_BASE_URL}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  },

  register(payload) { return this.request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }); },
  login(payload)    { return this.request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }); },
  logout()          { return this.request('/auth/logout', { method: 'POST' }); },
  me()              { return this.request('/auth/me'); },
  listTips()        { return this.request('/tips'); },
  saveTip(payload)  { return this.request('/tips', { method: 'POST', body: JSON.stringify(payload) }); },
};