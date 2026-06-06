const { Router }  = require('express');
const Anthropic   = require('@anthropic-ai/sdk');
const requireAuth = require('../middleware/auth');

const router = Router();
router.use(requireAuth);

const SYSTEM_PROMPT = `Sos un coach de tenis y nutrición experto llamado MIRA Coach.
El atleta es Mira, nivel Competitivo-Amateur, juega 2 días de tenis y 2 días de gym por semana.
Respondé siempre en español rioplatense, de manera directa, motivadora y precisa.
Máximo 3 oraciones por respuesta. No uses markdown, solo texto plano.`;

// POST /api/ai-coach/chat
router.post('/chat', async (req, res) => {
  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const client = new Anthropic({ apiKey });

  const userContent = context
    ? `Contexto del atleta: ${context}\n\nPregunta: ${message}`
    : message;

  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    });
    return res.json({ reply: msg.content[0]?.text || '' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
