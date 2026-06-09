import { Router } from 'express';
import pool from '../db';

const router = Router();

// Get active contest + leaderboard
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

// Submit artwork to contest
router.post('/submit', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });
  const user = req.user as any;
  const { contest_id, artwork_id } = req.body;

  try {
    await pool.query(
      `INSERT INTO contest_submissions (contest_id, user_id, artwork_id) 
       VALUES ($1, $2, $3)`,
      [contest_id, user.id, artwork_id]
    );

    await pool.query(
      `UPDATE users SET rating = rating + 15 WHERE id = $1`,
      [user.id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Already submitted or failed' });
  }
});

// Check if user already submitted
router.get('/my-submission/:contestId', async (req, res) => {
  if (!req.user) return res.json({ submitted: false });
  const user = req.user as any;

  try {
    const result = await pool.query(
      `SELECT * FROM contest_submissions 
       WHERE contest_id = $1 AND user_id = $2`,
      [req.params.contestId, user.id]
    );
    res.json({ submitted: result.rows.length > 0 });
  } catch {
    res.json({ submitted: false });
  }
});

// Admin only — create new contest
router.post('/', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });
  const user = req.user as any;

  if (user.id !== parseInt(process.env.ADMIN_USER_ID!)) {
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
// Admin only — announce winner + reveal submissions
router.post('/announce/:contestId', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });
  const user = req.user as any;

  if (user.id !== parseInt(process.env.ADMIN_USER_ID!)) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const { winner_user_id } = req.body;

  try {
    // End the contest
    await pool.query(
      `UPDATE contests SET status = 'ended' WHERE id = $1`,
      [req.params.contestId]
    );

    // +50 rating for winner
    await pool.query(
      `UPDATE users SET rating = rating + 50 WHERE id = $1`,
      [winner_user_id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to announce winner' });
  }
});

// Get ended contest results
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
export default router;