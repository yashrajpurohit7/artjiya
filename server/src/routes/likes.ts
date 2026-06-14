import { Router } from 'express';
import pool from '../db';
import { authenticateToken } from '../index';

const router = Router();

router.get('/:artworkId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT users.id, users.username, users.avatar_url
       FROM likes
       JOIN users ON users.id = likes.user_id
       WHERE likes.artwork_id = $1`,
      [req.params.artworkId]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed' });
  }
});

router.post('/:artworkId', authenticateToken, async (req: any, res) => {
  try {
    await pool.query(
      'INSERT INTO likes (user_id, artwork_id) VALUES ($1, $2)',
      [req.user.id, req.params.artworkId]
    );
    await pool.query(
      `UPDATE users SET rating = rating + 5 
       WHERE id = (SELECT user_id FROM artworks WHERE id = $1)`,
      [req.params.artworkId]
    );
    res.json({ liked: true });
  } catch {
    res.json({ liked: false });
  }
});

router.delete('/:artworkId', authenticateToken, async (req: any, res) => {
  try {
    await pool.query(
      'DELETE FROM likes WHERE user_id = $1 AND artwork_id = $2',
      [req.user.id, req.params.artworkId]
    );
    await pool.query(
      `UPDATE users SET rating = GREATEST(rating - 5, 0)
       WHERE id = (SELECT user_id FROM artworks WHERE id = $1)`,
      [req.params.artworkId]
    );
    res.json({ liked: false });
  } catch {
    res.status(500).json({ error: 'Failed' });
  }
});

export default router;