const { Router } = require('express');
const supabase   = require('../middleware/supabase');

const router = Router();

const dbCheck = (res) => { if (!supabase) { res.status(503).json({ error: 'Database not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env' }); return false; } return true; };

// GET /api/meals?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/', async (req, res) => {
  if (!dbCheck(res)) return;
  const { from, to } = req.query;
  let query = supabase.from('meals').select('*').order('date', { ascending: true }).order('created_at', { ascending: true });
  if (from) query = query.gte('date', from);
  if (to)   query = query.lte('date', to);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || []);
});

// GET /api/meals/today
router.get('/today', async (_req, res) => {
  if (!dbCheck(res)) return;
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('date', today)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || []);
});

// POST /api/meals
router.post('/', async (req, res) => {
  if (!dbCheck(res)) return;
  const { name, time, items, cal, protein, carbs, fat, sleep_hours } = req.body;

  if (!name || !items) {
    return res.status(400).json({ error: 'name and items are required' });
  }

  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('meals')
    .insert({
      date: today,
      name,
      time: time || new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
      items,
      cal:         cal         ?? 0,
      protein:     protein     ?? 0,
      carbs:       carbs       ?? 0,
      fat:         fat         ?? 0,
      sleep_hours: sleep_hours ?? null,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
});

module.exports = router;
