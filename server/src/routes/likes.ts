import { Router } from 'express';
import pool from '../db';

const router = Router();

router.post('/:artworkId', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });
  const user = req.user as any;
  try {
    await pool.query(
      'INSERT INTO likes (user_id, artwork_id) VALUES ($1, $2)',
      [user.id, req.params.artworkId]
    );

    // +5 rating to artwork owner
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

router.delete('/:artworkId', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });
  const user = req.user as any;
  try {
    await pool.query(
      'DELETE FROM likes WHERE user_id = $1 AND artwork_id = $2',
      [user.id, req.params.artworkId]
    );

    // -5 rating from artwork owner
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