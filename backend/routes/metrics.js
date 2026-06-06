const { Router } = require('express');
const supabase   = require('../middleware/supabase');
const requireAuth = require('../middleware/auth');

const router = Router();
router.use(requireAuth);

const dbCheck = (res) => { if (!supabase) { res.status(503).json({ error: 'Database not configured.' }); return false; } return true; };

// GET /api/metrics/today
router.get('/today', async (req, res) => {
  if (!dbCheck(res)) return;
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('user_id', req.userId)
    .eq('date', today)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || {});
});

// PUT /api/metrics/today
router.put('/today', async (req, res) => {
  if (!dbCheck(res)) return;
  const today = new Date().toISOString().slice(0, 10);
  const updates = { ...req.body, date: today, user_id: req.userId };

  const { data: existing } = await supabase
    .from('daily_metrics')
    .select('id')
    .eq('user_id', req.userId)
    .eq('date', today)
    .maybeSingle();

  let result;
  if (existing) {
    result = await supabase
      .from('daily_metrics')
      .update(updates)
      .eq('id', existing.id)
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
