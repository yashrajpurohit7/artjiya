import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pool from './db';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const googleId = profile.id;
    const username = profile.displayName;
    const avatarUrl = profile.photos?.[0]?.value || '';

    // Check if user exists
    const existing = await pool.query(
      'SELECT * FROM users WHERE google_id = $1',
      [googleId]
    );

    if (existing.rows.length > 0) {
      return done(null, existing.rows[0]);
    }

    // Create new user
    const newUser = await pool.query(
      'INSERT INTO users (google_id, username, avatar_url) VALUES ($1, $2, $3) RETURNING *',
      [googleId, username, avatarUrl]
    );

    return done(null, newUser.rows[0]);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

export default passport;