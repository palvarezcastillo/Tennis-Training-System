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

// GET /api/session-details/:session_id
router.get('/:session_id', async (req, res) => {
  if (!dbCheck(res)) return;
  const { session_id } = req.params;

  const { data, error } = await supabase
    .from('session_details')
    .select('*')
    .eq('session_id', session_id)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || []);
});

// POST /api/session-details — upsert all exercises for a session
router.post('/', async (req, res) => {
  if (!dbCheck(res)) return;
  const { session_id, exercises } = req.body;

  if (!session_id || !Array.isArray(exercises)) {
    return res.status(400).json({ error: 'session_id and exercises[] are required' });
  }

  // Replace existing records for this session
  const { error: delError } = await supabase
    .from('session_details')
    .delete()
    .eq('session_id', session_id);

  if (delError) return res.status(500).json({ error: delError.message });

  const rows = exercises.map(ex => ({
    session_id,
    exercise_key:  ex.key,
    exercise_name: ex.name,
    done:          ex.done ?? false,
  }));

  const { data, error } = await supabase
    .from('session_details')
    .insert(rows)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
});

module.exports = router;
