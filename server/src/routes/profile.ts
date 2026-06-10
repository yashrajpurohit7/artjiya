import { Router } from 'express';
import pool from '../db';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = (req.user as any)?.id;

    const userResult = await pool.query(
      'SELECT id, username, avatar_url, bio, created_at FROM users WHERE id = $1',
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
// Update profile
router.put('/edit', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });
  const user = req.user as any;
  const { username, bio } = req.body;

  if (!username || username.trim().length < 2) {
    return res.status(400).json({ error: 'Username too short' });
  }

  try {
    const result = await pool.query(
      `UPDATE users SET username = $1, bio = $2 WHERE id = $3 RETURNING *`,
      [username.trim(), bio?.trim() || '', user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});
// Get followers list
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

// Get following list
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
export default router;