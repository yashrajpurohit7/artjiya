import { Router } from 'express';
import pool from '../db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;
    let currentUserId = null;
    if (authHeader) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded: any = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET!);
        currentUserId = decoded.id;
      } catch {}
    }

    const userResult = await pool.query(
      'SELECT id, username, avatar_url, bio, rating, created_at FROM users WHERE id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const artworksResult = await pool.query(
      'SELECT * FROM artworks WHERE user_id = $1 ORDER BY created_at DESC',
      [id]
    );

    const followerResult = await pool.query(
      'SELECT COUNT(*) FROM follows WHERE following_id = $1',
      [id]
    );

    let isFollowing = false;
    if (currentUserId) {
      const followCheck = await pool.query(
        'SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2',
        [currentUserId, id]
      );
      isFollowing = followCheck.rows.length > 0;
    }

    res.json({
      user: userResult.rows[0],
      artworks: artworksResult.rows,
      followerCount: parseInt(followerResult.rows[0].count),
      isFollowing,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.get('/:id/followers', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT users.id, users.username, users.avatar_url 
       FROM follows 
       JOIN users ON users.id = follows.follower_id
       WHERE follows.following_id = $1`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed' });
  }
});

router.get('/:id/following', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT users.id, users.username, users.avatar_url 
       FROM follows 
       JOIN users ON users.id = follows.following_id
       WHERE follows.follower_id = $1`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed' });
  }
});

router.put('/edit', authenticateToken, async (req: any, res) => {
  const { username, bio } = req.body;
  if (!username || username.trim().length < 2) {
    return res.status(400).json({ error: 'Username too short' });
  }
  try {
    const result = await pool.query(
      `UPDATE users SET username = $1, bio = $2 WHERE id = $3 RETURNING *`,
      [username.trim(), bio?.trim() || '', req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;