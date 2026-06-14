import { Router, Request, Response } from 'express';
import pool from '../db';
import { upload, uploadToCloudinary } from '../upload';
import { authenticateToken } from '../index';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    let currentUserId = null;
    if (authHeader) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded: any = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET!);
        currentUserId = decoded.id;
      } catch {}
    }

    const result = await pool.query(
      `SELECT 
        artworks.*, 
        users.username, 
        users.avatar_url,
        COUNT(DISTINCT likes.id) as like_count,
        ${currentUserId ? `BOOL_OR(likes.user_id = $1) as liked_by_me` : `false as liked_by_me`}
      FROM artworks 
      JOIN users ON artworks.user_id = users.id
      LEFT JOIN likes ON artworks.id = likes.artwork_id
      GROUP BY artworks.id, users.username, users.avatar_url
      ORDER BY artworks.created_at DESC`,
      currentUserId ? [currentUserId] : []
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch artworks' });
  }
});

router.post('/', authenticateToken, upload.single('image'), async (req: any, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });
    const { title } = req.body;

    const imageUrl = await uploadToCloudinary(req.file.buffer);

    const result = await pool.query(
      'INSERT INTO artworks (user_id, title, image_url) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, title, imageUrl]
    );

    await pool.query(
      'UPDATE users SET rating = rating + 10 WHERE id = $1',
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload artwork' });
  }
});

router.delete('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const artwork = await pool.query(
      'SELECT * FROM artworks WHERE id = $1',
      [req.params.id]
    );

    if (artwork.rows.length === 0) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    if (artwork.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not your artwork' });
    }

    await pool.query('DELETE FROM likes WHERE artwork_id = $1', [req.params.id]);
    await pool.query('DELETE FROM contest_submissions WHERE artwork_id = $1', [req.params.id]);
    await pool.query('DELETE FROM artworks WHERE id = $1', [req.params.id]);

    await pool.query(
      'UPDATE users SET rating = GREATEST(rating - 10, 0) WHERE id = $1',
      [req.user.id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete artwork' });
  }
});

export default router;