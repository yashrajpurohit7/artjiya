import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import passport from './auth';
import artworksRouter from './routes/artworks';
import likesRouter from './routes/likes';
import followsRouter from './routes/follows';
import profileRouter from './routes/profile';
import contestsRouter from './routes/contests';
import searchRouter from './routes/search';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const JWT_SECRET = process.env.JWT_SECRET!;

app.use(helmet());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(express.json());

app.use(passport.initialize());

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'], session: false })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failed', session: false }),
  (req: any, res) => {
    try {
      const token = jwt.sign(
        { id: req.user.id, username: req.user.username, avatar_url: req.user.avatar_url },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.send(`
        <html>
          <body>
            <script>
              localStorage.setItem('artjiya_token', '${token}');
              window.location.href = '${CLIENT_URL}';
            </script>
          </body>
        </html>
      `);
    } catch (err) {
      console.error('Callback error:', err);
      res.status(500).send('Auth failed: ' + String(err));
    }
  }
);

app.get('/auth/me', (req: any, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json({ user: null });
  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, JWT_SECRET);
    res.json({ user });
  } catch {
    res.json({ user: null });
  }
});

app.get('/auth/failed', (req, res) => {
  res.json({ error: 'Login failed' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/artworks', artworksRouter);
app.use('/api/likes', likesRouter);
app.use('/api/follows', followsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/contests', contestsRouter);
app.use('/api/search', searchRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));