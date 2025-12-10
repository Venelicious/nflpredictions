const express = require('express');
const { getPool } = require('../db');
const { hashPassword, verifyPassword, createSessionToken, hashToken, calculateExpiry } = require('../lib/security');
const { requireAuth } = require('../lib/authMiddleware');

const router = express.Router();

async function persistSession(res, userId) {
  const pool = getPool();
  const token = createSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = calculateExpiry(process.env.SESSION_TTL_DAYS);

  await pool.execute(
    'INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
    [userId, tokenHash, expiresAt]
  );

  res.cookie('session_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.SESSION_COOKIE_SECURE === 'true',
    expires: expiresAt,
  });
}

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, E-Mail und Passwort sind erforderlich.' });
  }

  const pool = getPool();
  const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length) {
    return res.status(409).json({ error: 'E-Mail ist bereits registriert.' });
  }

  const passwordHash = hashPassword(password);
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );

  await persistSession(res, result.insertId);
  res.status(201).json({ user: { id: result.insertId, email, name } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'E-Mail und Passwort sind erforderlich.' });
  }

  const pool = getPool();
  const [rows] = await pool.execute('SELECT id, email, name, password_hash, favorite_team FROM users WHERE email = ?', [email]);
  const user = rows[0];
  if (!user || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: 'Anmeldung fehlgeschlagen.' });
  }

  await persistSession(res, user.id);
  res.json({ user: { id: user.id, email: user.email, name: user.name, favorite_team: user.favorite_team } });
});

router.post('/logout', requireAuth, async (req, res) => {
  const pool = getPool();
  const token = req.cookies?.session_token;
  if (token) {
    await pool.execute('DELETE FROM sessions WHERE token_hash = ?', [hashToken(token)]);
    res.clearCookie('session_token');
  }
  res.json({ success: true });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.put('/profile', requireAuth, async (req, res) => {
  const { name, favorite_team } = req.body || {};
  const pool = getPool();
  await pool.execute('UPDATE users SET name = ?, favorite_team = ? WHERE id = ?', [name || '', favorite_team || '', req.user.id]);
  res.json({ user: { ...req.user, name: name || req.user.name, favorite_team: favorite_team || '' } });
});

module.exports = router;
