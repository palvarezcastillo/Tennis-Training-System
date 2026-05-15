const { Router } = require('express');
const supabase   = require('../middleware/supabase');

const router = Router();

const dbCheck = (res) => {
  if (!supabase) { res.status(503).json({ error: 'Database not configured.' }); return false; }
  return true;
};

// GET /api/profile
router.get('/', async (_req, res) => {
  if (!dbCheck(res)) return;
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || {});
});

// PUT /api/profile
router.put('/', async (req, res) => {
  if (!dbCheck(res)) return;
  const { name, height_cm, weight_kg, birth_date } = req.body;

  const updates = {};
  if (name       !== undefined) updates.name       = name;
  if (height_cm  !== undefined) updates.height_cm  = height_cm;
  if (weight_kg  !== undefined) updates.weight_kg  = weight_kg;
  if (birth_date !== undefined) updates.birth_date = birth_date;
  updates.updated_at = new Date().toISOString();

  const { data: existing } = await supabase.from('profile').select('id').limit(1).maybeSingle();

  let result;
  if (existing) {
    result = await supabase.from('profile').update(updates).eq('id', existing.id).select().single();
  } else {
    result = await supabase.from('profile').insert(updates).select().single();
  }

  if (result.error) return res.status(500).json({ error: result.error.message });
  return res.json(result.data);
});

module.exports = router;
