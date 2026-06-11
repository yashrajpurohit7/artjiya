import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from './auth';
import artworksRouter from './routes/artworks';
import likesRouter from './routes/likes';
import followsRouter from './routes/follows';
import profileRouter from './routes/profile';
import searchRouter from './routes/search';
import contestsRouter from './routes/contests';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Security middleware first
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// 2. Session + auth 
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
})); 

app.use(passport.initialize());
app.use(passport.session());

// 3. Auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failed' }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL as string);
  }
);

app.get('/auth/me', (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.json({ success: true });
  });
});

app.get('/auth/failed', (req, res) => {
  res.json({ error: 'Login failed' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 4. API routes last
app.use('/api/artworks', artworksRouter);
app.use('/api/likes', likesRouter);
app.use('/api/follows', followsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/search', searchRouter);
app.use('/api/contests', contestsRouter);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));