import { Router } from 'express';
import pool from '../db';

const router = Router();

router.post('/:userId', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });
  const user = req.user as any;
  if (user.id === parseInt(req.params.userId)) {
    return res.status(400).json({ error: 'Cannot follow yourself' });
  }
  try {
    await pool.query(
      'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)',
      [user.id, req.params.userId]
    );

    // +8 rating to followed user
    await pool.query(
      'UPDATE users SET rating = rating + 8 WHERE id = $1',
      [req.params.userId]
    );

    res.json({ following: true });
  } catch {
    res.json({ following: false });
  }
});

router.delete('/:userId', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });
  const user = req.user as any;
  try {
    await pool.query(
      'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
      [user.id, req.params.userId]
    );

    // -8 rating from unfollowed user
    await pool.query(
      'UPDATE users SET rating = GREATEST(rating - 8, 0) WHERE id = $1',
      [req.params.userId]
    );

    res.json({ following: false });
  } catch {
    res.status(500).json({ error: 'Failed' });
  }
});

export default router;