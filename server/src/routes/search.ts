import { Router } from 'express';
import pool from '../db';

const router = Router();

router.get('/', async (req, res) => {
  const query = req.query.q as string;
  if (!query) return res.json([]);

  try {
    const result = await pool.query(
      'SELECT id, username, avatar_url FROM users WHERE username ILIKE $1 LIMIT 10',
      [`%${query}%`]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;