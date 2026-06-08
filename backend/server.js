require('dotenv').config();
const express = require('express');
const cors = require('cors');

const metricsRouter     = require('./routes/metrics');
const sessionsRouter    = require('./routes/sessions');
const mealsRouter       = require('./routes/meals');
const aiCoachRouter     = require('./routes/ai-coach');
const tournamentsRouter     = require('./routes/tournaments');
const sessionDetailsRouter  = require('./routes/session-details');
const nutritionRouter       = require('./routes/nutrition');
const profileRouter         = require('./routes/profile');

const app = express();

// Orígenes permitidos: localhost, una URL configurable (FRONTEND_URL) y
// cualquier deploy de Vercel (*.vercel.app). La API está protegida por el
// token Bearer, así que permitir los subdominios de Vercel es seguro.
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // sin origin = server-to-server / curl / health checks
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      return cb(null, true);
    }
    return cb(new Error(`Origin no permitido por CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/metrics',         metricsRouter);
app.use('/api/sessions',        sessionsRouter);
app.use('/api/meals',           mealsRouter);
app.use('/api/ai-coach',        aiCoachRouter);
app.use('/api/tournaments',     tournamentsRouter);
app.use('/api/session-details', sessionDetailsRouter);
app.use('/api/nutrition',       nutritionRouter);
app.use('/api/profile',         profileRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`MIRA backend running on port ${PORT}`));
}

module.exports = app;
