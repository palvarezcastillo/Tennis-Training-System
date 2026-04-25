const { Router } = require('express');
const supabase   = require('../middleware/supabase');

const router = Router();

// GET /api/meals/today
router.get('/today', async (_req, res) => {
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
  const { name, time, items, cal, protein, carbs, fat } = req.body;

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
      cal:     cal     ?? 0,
      protein: protein ?? 0,
      carbs:   carbs   ?? 0,
      fat:     fat     ?? 0,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
});

module.exports = router;
