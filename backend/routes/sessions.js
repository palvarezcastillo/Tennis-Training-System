const { Router } = require('express');
const supabase   = require('../middleware/supabase');

const router = Router();

const dbCheck = (res) => { if (!supabase) { res.status(503).json({ error: 'Database not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env' }); return false; } return true; };

// GET /api/sessions/week?offset=0   (0=current, -1=prev, +1=next)
router.get('/week', async (req, res) => {
  if (!dbCheck(res)) return;
  const offset = parseInt(req.query.offset || '0', 10);

  const today = new Date();
  const dow = today.getDay();
  const mondayShift = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayShift + offset * 7);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .gte('date', monday.toISOString().slice(0, 10))
    .lte('date', sunday.toISOString().slice(0, 10))
    .order('date', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || []);
});

// POST /api/sessions
router.post('/', async (req, res) => {
  if (!dbCheck(res)) return;
  const { date, type, label, intensity, done } = req.body;

  if (!date || !type) {
    return res.status(400).json({ error: 'date and type are required' });
  }

  const { data, error } = await supabase
    .from('sessions')
    .insert({ date, type, label, intensity: intensity ?? 0, done: done ?? false })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
});

// PUT /api/sessions/:id
router.put('/:id', async (req, res) => {
  if (!dbCheck(res)) return;
  const { id } = req.params;
  const { done, rpe } = req.body;

  const updates = {};
  if (done !== undefined) updates.done = done;
  if (rpe  !== undefined) updates.rpe  = rpe;

  const { data, error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data)  return res.status(404).json({ error: 'Session not found' });
  return res.json(data);
});

module.exports = router;
