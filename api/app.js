const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const tipRoutes = require('./routes/tips');
const gameRoutes = require('./routes/games');
const { findSession } = require('./lib/authMiddleware');

function buildApp() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
      credentials: true,
    })
  );

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/tips', tipRoutes);
  app.use('/api/games', gameRoutes);

  app.get('/api/session', async (req, res) => {
    const token = req.cookies?.session_token;
    const session = await findSession(token);
    if (!session) return res.status(401).json({ error: 'Nicht authentifiziert' });
    res.json({ user: { id: session.user_id, email: session.email, name: session.name, favorite_team: session.favorite_team } });
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  });

  return app;
}

module.exports = { buildApp };
