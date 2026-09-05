const { Router }  = require('express');
const Anthropic   = require('@anthropic-ai/sdk');
const requireAuth = require('../middleware/auth');
const supabase    = require('../middleware/supabase');

const router = Router();
router.use(requireAuth);

// Modelo configurable por env (Vercel) para poder cambiar Sonnet <-> Haiku sin tocar código.
// Ojo: los IDs de los modelos nuevos NO llevan fecha al final.
//   claude-sonnet-5  -> mejor calidad, ~2x el costo de Haiku
//   claude-haiku-4-5 -> más barato y rápido
const MODEL = process.env.AI_COACH_MODEL || 'claude-sonnet-5';

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

  // Rate limiting por usuario (conteo diario en Supabase).
  // Degradación elegante: si no hay DB configurada, no bloqueamos el chat.
  if (supabase) {
    // Límite diario configurable por env; si es inválido, usamos 30.
    const parsedLimit = parseInt(process.env.AI_COACH_DAILY_LIMIT, 10);
    const limit = Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : 30;

    // Incremento atómico ANTES de llamar al modelo: contamos intentos.
    // La RPC hace upsert del día de hoy y devuelve el total ya incrementado.
    const { data: usedToday, error } = await supabase.rpc('increment_ai_coach_usage', { p_user_id: req.userId });

    if (error) {
      // Si falla el conteo, no dejamos al usuario sin coach: solo logueamos.
      console.error('increment_ai_coach_usage error:', error.message);
    } else if (usedToday > limit) {
      // Con limit=30: mensaje 30 permitido, mensaje 31 (usedToday=31) bloqueado.
      return res.status(429).json({
        error: 'rate_limit_exceeded',
        message: 'Llegaste al límite de mensajes del coach por hoy. Volvé a intentarlo mañana.',
        limit,
        used: usedToday,
      });
    }
  }

  const client = new Anthropic({ apiKey });

  const userContent = context
    ? `Contexto del atleta: ${context}\n\nPregunta: ${message}`
    : message;

  try {
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 512,
      thinking: { type: 'disabled' },
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    });
    return res.json({ reply: msg.content[0]?.text || '' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
