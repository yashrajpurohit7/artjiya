import { Router } from 'express';
import pool from '../db';
import { authenticateToken } from '../middleware/auth';
const router = Router();

router.post('/:userId', authenticateToken, async (req: any, res) => {
  if (req.user.id === parseInt(req.params.userId)) {
    return res.status(400).json({ error: 'Cannot follow yourself' });
  }
  try {
    await pool.query(
      'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)',
      [req.user.id, req.params.userId]
    );
    await pool.query(
      'UPDATE users SET rating = rating + 8 WHERE id = $1',
      [req.params.userId]
    );
    res.json({ following: true });
  } catch {
    res.json({ following: false });
  }
});

router.delete('/:userId', authenticateToken, async (req: any, res) => {
  try {
    await pool.query(
      'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
      [req.user.id, req.params.userId]
    );
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