const express = require('express');
const { getPool } = require('../db');
const { requireAuth } = require('../lib/authMiddleware');
const { normalizeTipPayload } = require('../lib/tipPayload');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, user_id, season, game_id, predicted_winner, payload, created_at, updated_at FROM tips WHERE user_id = ? ORDER BY updated_at DESC',
    [req.user.id]
  );
  res.json({ tips: rows.map(row => ({ ...row, payload: row.payload ? JSON.parse(row.payload) : null })) });
});

router.post('/', async (req, res) => {
  const { season, gameId = null, predictedWinner = null, payload = null } = req.body || {};
  const normalized = normalizeTipPayload({ season, predictions: payload });
  const targetSeason = season || normalized.season;
  if (!targetSeason) {
    return res.status(400).json({ error: 'Season ist erforderlich.' });
  }
  const pool = getPool();
  const payloadString = normalized.predictions ? JSON.stringify(normalized.predictions) : null;

  const [existing] = await pool.execute(
    'SELECT id FROM tips WHERE user_id = ? AND season = ? AND game_id <=> ?',
    [req.user.id, targetSeason, gameId]
  );

  if (existing.length) {
    await pool.execute(
      'UPDATE tips SET predicted_winner = ?, payload = ?, updated_at = NOW() WHERE id = ?',
      [predictedWinner, payloadString, existing[0].id]
    );
    return res.json({ id: existing[0].id, season: targetSeason, gameId, predictedWinner, payload: normalized.predictions });
  }

  const [result] = await pool.execute(
    'INSERT INTO tips (user_id, season, game_id, predicted_winner, payload) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, targetSeason, gameId, predictedWinner, payloadString]
  );
  res.status(201).json({ id: result.insertId, season: targetSeason, gameId, predictedWinner, payload: normalized.predictions });
});

router.put('/:id', async (req, res) => {
  const { predictedWinner = null, payload = null } = req.body || {};
  const pool = getPool();
  const [rows] = await pool.execute('SELECT id FROM tips WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  if (!rows.length) {
    return res.status(404).json({ error: 'Tipp nicht gefunden.' });
  }
  await pool.execute('UPDATE tips SET predicted_winner = ?, payload = ?, updated_at = NOW() WHERE id = ?', [predictedWinner, payload ? JSON.stringify(payload) : null, req.params.id]);
  res.json({ success: true });
});

module.exports = router;
