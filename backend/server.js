require('dotenv').config();
const express = require('express');
const cors = require('cors');

const metricsRouter  = require('./routes/metrics');
const sessionsRouter = require('./routes/sessions');
const mealsRouter    = require('./routes/meals');
const aiCoachRouter  = require('./routes/ai-coach');

const app = express();

app.use(cors({ origin: ['http://localhost', 'http://localhost:3000', 'http://localhost:5173'] }));
app.use(express.json());

app.use('/api/metrics',  metricsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/meals',    mealsRouter);
app.use('/api/ai-coach', aiCoachRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`MIRA backend running on port ${PORT}`));
