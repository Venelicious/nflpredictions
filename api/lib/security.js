const bcrypt = require('bcryptjs');
const crypto = require('crypto');

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function createSessionToken() {
  return crypto.randomBytes(40).toString('hex');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function calculateExpiry(days = 7) {
  const expiresAt = new Date();
  expiresAt.setUTCDate(expiresAt.getUTCDate() + Number(days || 7));
  return expiresAt;
}

module.exports = {
  hashPassword,
  verifyPassword,
  createSessionToken,
  hashToken,
  calculateExpiry,
};
