// core/storage.js
export const safeStorage = {
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (err) {
      console.error(`Storage read error for key "${key}"`, err);
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      if (err.name === 'QuotaExceededError') {
        this.cleanup();
      }
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  cleanup() {
    const keys = Object.keys(localStorage);
    const sizes = keys.map(key => ({
      key,
      size: (localStorage.getItem(key) || '').length,
    })).sort((a, b) => b.size - a.size);

    const totalSize = sizes.reduce((s, i) => s + i.size, 0);
    let freed = 0;
    const target = totalSize * 0.2;

    for (const item of sizes) {
      if (freed >= target) break;
      localStorage.removeItem(item.key);
      freed += item.size;
    }
  },
};