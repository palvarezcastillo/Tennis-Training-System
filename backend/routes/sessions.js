const { Router } = require('express');
const supabase   = require('../middleware/supabase');
const requireAuth = require('../middleware/auth');
const { today, addDays, mondayOf } = require('../lib/appDate');

const router = Router();
router.use(requireAuth);

const dbCheck = (res) => { if (!supabase) { res.status(503).json({ error: 'Database not configured.' }); return false; } return true; };

// GET /api/sessions?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/', async (req, res) => {
  if (!dbCheck(res)) return;
  const { from, to } = req.query;
  let query = supabase.from('sessions').select('*').eq('user_id', req.userId).order('date', { ascending: true });
  if (from) query = query.gte('date', from);
  if (to)   query = query.lte('date', to);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || []);
});

// GET /api/sessions/week?offset=0
router.get('/week', async (req, res) => {
  if (!dbCheck(res)) return;
  const offset = parseInt(req.query.offset || '0', 10);

  // Semana lunes-domingo en el calendario del usuario, no en el del servidor.
  const monStr = mondayOf(today(), offset);
  const sunStr = addDays(monStr, 6);

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', req.userId)
    .gte('date', monStr)
    .lte('date', sunStr)
    .order('date', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || []);
});

// POST /api/sessions
router.post('/', async (req, res) => {
  if (!dbCheck(res)) return;
  const { date, type, label, intensity, done, duration_min, rpe, notes } = req.body;

  if (!date || !type) {
    return res.status(400).json({ error: 'date and type are required' });
  }

  const { data, error } = await supabase
    .from('sessions')
    .insert({ user_id: req.userId, date, type, label, intensity: intensity ?? 0, done: done ?? false, duration_min, rpe, notes })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
});

// PUT /api/sessions/:id
router.put('/:id', async (req, res) => {
  if (!dbCheck(res)) return;
  const { id } = req.params;
  const { done, rpe, skipped, type, label } = req.body;

  const updates = {};
  if (done    !== undefined) updates.done    = done;
  if (rpe     !== undefined) updates.rpe     = rpe;
  if (skipped !== undefined) updates.skipped = skipped;
  if (type    !== undefined) updates.type    = type;
  if (label   !== undefined) updates.label   = label;

  const { data, error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.userId)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data)  return res.status(404).json({ error: 'Session not found' });
  return res.json(data);
});

// DELETE /api/sessions/:id
router.delete('/:id', async (req, res) => {
  if (!dbCheck(res)) return;
  const { id } = req.params;

  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', id)
    .eq('user_id', req.userId);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(204).send();
});

module.exports = router;
