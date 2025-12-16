// core/validator.js
export const validator = {
  prediction(p = {}) {
    const errors = [];
    if (p.divisionRank < 1 || p.divisionRank > 4) errors.push('Ungültiger Rang');
    if (p.wins < 0 || p.wins > 17) errors.push('Ungültige Siege');
    if (p.losses < 0 || p.losses > 17) errors.push('Ungültige Niederlagen');
    if (p.wins + p.losses > 17) errors.push('Mehr als 17 Spiele');
    return { valid: errors.length === 0, errors };
  },

  email(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  password(pw) {
    return pw && pw.length >= 6;
  },
};