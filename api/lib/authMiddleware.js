const { hashToken } = require('./security');
const { getPool } = require('../db');

async function findSession(token) {
  if (!token) return null;
  const pool = getPool();
  const tokenHash = hashToken(token);
  const [sessions] = await pool.execute(
    `SELECT s.id, s.user_id, s.expires_at, u.email, u.name, u.favorite_team
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > NOW()` ,
    [tokenHash]
  );
  return sessions[0] || null;
}

async function requireAuth(req, res, next) {
  const token = req.cookies?.session_token;
  const session = await findSession(token);
  if (!session) {
    return res.status(401).json({ error: 'Nicht authentifiziert' });
  }
  req.user = {
    id: session.user_id,
    email: session.email,
    name: session.name,
    favorite_team: session.favorite_team,
  };
  req.sessionId = session.id;
  next();
}

module.exports = { requireAuth, findSession };
