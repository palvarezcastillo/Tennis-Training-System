const { Router } = require('express');
const supabase   = require('../middleware/supabase');

const router = Router();

// GET /api/metrics/today
router.get('/today', async (_req, res) => {
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('date', today)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || {});
});

// PUT /api/metrics/today
router.put('/today', async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const updates = { ...req.body, date: today };

  const { data: existing } = await supabase
    .from('daily_metrics')
    .select('id')
    .eq('date', today)
    .maybeSingle();

  let result;
  if (existing) {
    result = await supabase
      .from('daily_metrics')
      .update(updates)
      .eq('date', today)
      .select()
      .single();
  } else {
    result = await supabase
      .from('daily_metrics')
      .insert(updates)
      .select()
      .single();
  }

  if (result.error) return res.status(500).json({ error: result.error.message });
  return res.json(result.data);
});

module.exports = router;
