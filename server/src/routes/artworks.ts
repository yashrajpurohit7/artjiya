import { Router, Request, Response } from 'express';
import pool from '../db';
import { upload, uploadToCloudinary } from '../upload';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const currentUserId = (req.user as any)?.id || null;

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

router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not logged in' });
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    const { title } = req.body;
    const user = req.user as any;

    const imageUrl = await uploadToCloudinary(req.file.buffer);

    const result = await pool.query(
      'INSERT INTO artworks (user_id, title, image_url) VALUES ($1, $2, $3) RETURNING *',
      [user.id, title, imageUrl]
    );
// +10 rating for uploading artwork
await pool.query(
  'UPDATE users SET rating = rating + 10 WHERE id = $1',
  [user.id]
);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload artwork' });
  }
});

export default router;