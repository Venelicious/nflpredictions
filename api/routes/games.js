const express = require('express');
const { getPool } = require('../db');
const { requireAuth } = require('../lib/authMiddleware');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT id, home_team, away_team, game_time, season FROM games ORDER BY game_time ASC');
  res.json({ games: rows });
});

module.exports = router;
