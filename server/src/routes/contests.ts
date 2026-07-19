import { Router } from 'express';
import pool from '../db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const contestResult = await pool.query(
      `SELECT * FROM contests WHERE status = 'active' ORDER BY id DESC LIMIT 1`
    );

    const leaderboard = await pool.query(
      `SELECT 
        users.id,
        users.username,
        users.avatar_url,
        users.rating,
        COUNT(DISTINCT artworks.id) as artwork_count,
        COUNT(DISTINCT contest_submissions.id) as wins
      FROM users
      LEFT JOIN artworks ON artworks.user_id = users.id
      LEFT JOIN contest_submissions ON contest_submissions.user_id = users.id
      GROUP BY users.id, users.username, users.avatar_url, users.rating
      ORDER BY users.rating DESC
      LIMIT 20`
    );

    res.json({
      contest: contestResult.rows[0] || null,
      leaderboard: leaderboard.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch contest' });
  }
});

router.post('/submit', authenticateToken, async (req: any, res) => {
  const { contest_id, artwork_id } = req.body;
  try {
    await pool.query(
      `INSERT INTO contest_submissions (contest_id, user_id, artwork_id) 
       VALUES ($1, $2, $3)`,
      [contest_id, req.user.id, artwork_id]
    );
    await pool.query(
      `UPDATE users SET rating = rating + 15 WHERE id = $1`,
      [req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Already submitted or failed' });
  }
});

router.get('/my-submission/:contestId', authenticateToken, async (req: any, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM contest_submissions 
       WHERE contest_id = $1 AND user_id = $2`,
      [req.params.contestId, req.user.id]
    );
    res.json({ submitted: result.rows.length > 0 });
  } catch {
    res.json({ submitted: false });
  }
});

router.post('/announce/:contestId', authenticateToken, async (req: any, res) => {
  if (req.user.id !== parseInt(process.env.ADMIN_USER_ID!)) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  const { winner_user_id } = req.body;
  try {
    await pool.query(
      `UPDATE contests SET status = 'ended' WHERE id = $1`,
      [req.params.contestId]
    );
    await pool.query(
      `UPDATE users SET rating = rating + 50 WHERE id = $1`,
      [winner_user_id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to announce winner' });
  }
});

router.get('/results/:contestId', async (req, res) => {
  try {
    const contestResult = await pool.query(
      `SELECT * FROM contests WHERE id = $1 AND status = 'ended'`,
      [req.params.contestId]
    );

    if (contestResult.rows.length === 0) {
      return res.json({ revealed: false });
    }

    const submissions = await pool.query(
      `SELECT 
        contest_submissions.*,
        artworks.title,
        artworks.image_url,
        users.username,
        users.avatar_url,
        users.rating,
        COUNT(likes.id) as like_count
      FROM contest_submissions
      JOIN artworks ON artworks.id = contest_submissions.artwork_id
      JOIN users ON users.id = contest_submissions.user_id
      LEFT JOIN likes ON likes.artwork_id = artworks.id
      WHERE contest_submissions.contest_id = $1
      GROUP BY contest_submissions.id, artworks.title, artworks.image_url,
               users.username, users.avatar_url, users.rating
      ORDER BY like_count DESC`,
      [req.params.contestId]
    );

    res.json({
      revealed: true,
      contest: contestResult.rows[0],
      submissions: submissions.rows,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

router.post('/', authenticateToken, async (req: any, res) => {
  if (req.user.id !== parseInt(process.env.ADMIN_USER_ID!)) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  const { title, theme, start_date, end_date, result_date } = req.body;
  try {
    await pool.query(
      `UPDATE contests SET status = 'ended' WHERE status = 'active'`
    );
    const result = await pool.query(
      `INSERT INTO contests (title, theme, start_date, end_date, result_date, status)
       VALUES ($1, $2, $3, $4, $5, 'active') RETURNING *`,
      [title, theme, start_date, end_date, result_date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create contest' });
  }
});

export default router;