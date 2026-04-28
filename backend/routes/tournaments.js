const { Router } = require('express');
const supabase   = require('../middleware/supabase');

const router = Router();

const dbCheck = (res) => { if (!supabase) { res.status(503).json({ error: 'Database not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env' }); return false; } return true; };

// GET /api/tournaments?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/', async (req, res) => {
  if (!dbCheck(res)) return;
  const { from, to } = req.query;

  let query = supabase.from('tournaments').select('*').order('date', { ascending: true });
  if (from) query = query.gte('date', from);
  if (to)   query = query.lte('date', to);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || []);
});

// POST /api/tournaments
router.post('/', async (req, res) => {
  if (!dbCheck(res)) return;
  const { name, date, location, category, notes } = req.body;

  if (!name || !date) {
    return res.status(400).json({ error: 'name and date are required' });
  }

  const { data, error } = await supabase
    .from('tournaments')
    .insert({ name, date, location, category, notes })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
});

// DELETE /api/tournaments/:id
router.delete('/:id', async (req, res) => {
  if (!dbCheck(res)) return;
  const { id } = req.params;

  const { error } = await supabase
    .from('tournaments')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(204).send();
});

module.exports = router;
