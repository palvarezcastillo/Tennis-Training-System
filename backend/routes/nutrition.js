const { Router } = require('express');
const supabase   = require('../middleware/supabase');

const router = Router();

const dbCheck = (res) => {
  if (!supabase) {
    res.status(503).json({ error: 'Database not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env' });
    return false;
  }
  return true;
};

// GET /api/nutrition?date=YYYY-MM-DD
// GET /api/nutrition?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/', async (req, res) => {
  if (!dbCheck(res)) return;
  const { date, from, to } = req.query;

  let query = supabase.from('nutrition').select('*').order('created_at', { ascending: true });
  if (date)        query = query.eq('date', date);
  else if (from)   query = query.gte('date', from);
  if (to)          query = query.lte('date', to);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || []);
});

// POST /api/nutrition — replace all pillars for a date
// Body: { date: 'YYYY-MM-DD', pillars: [{ key, name, done }] }
router.post('/', async (req, res) => {
  if (!dbCheck(res)) return;
  const { date, pillars } = req.body;

  if (!date || !Array.isArray(pillars)) {
    return res.status(400).json({ error: 'date and pillars[] are required' });
  }

  const { error: delError } = await supabase
    .from('nutrition')
    .delete()
    .eq('date', date);

  if (delError) return res.status(500).json({ error: delError.message });

  const rows = pillars.map(p => ({
    date,
    pillar:      p.key,
    pillar_name: p.name,
    done:        p.done ?? false,
  }));

  const { data, error } = await supabase
    .from('nutrition')
    .insert(rows)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
});

module.exports = router;
