const { Router } = require('express');
const supabase   = require('../middleware/supabase');
const requireAuth = require('../middleware/auth');
const { today } = require('../lib/appDate');

const router = Router();
router.use(requireAuth);

const dbCheck = (res) => { if (!supabase) { res.status(503).json({ error: 'Database not configured.' }); return false; } return true; };

// GET /api/metrics/today
router.get('/today', async (req, res) => {
  if (!dbCheck(res)) return;
  const todayStr = today();

  const { data, error } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('user_id', req.userId)
    .eq('date', todayStr)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || {});
});

// PUT /api/metrics/today
router.put('/today', async (req, res) => {
  if (!dbCheck(res)) return;
  const todayStr = today();
  const updates = { ...req.body, date: todayStr, user_id: req.userId };

  const { data: existing } = await supabase
    .from('daily_metrics')
    .select('id')
    .eq('user_id', req.userId)
    .eq('date', todayStr)
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
