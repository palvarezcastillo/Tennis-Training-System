const { Router } = require('express');
const supabase   = require('../middleware/supabase');
const requireAuth = require('../middleware/auth');

const router = Router();
router.use(requireAuth);

const dbCheck = (res) => { if (!supabase) { res.status(503).json({ error: 'Database not configured.' }); return false; } return true; };

// GET /api/progress
// Ventana: últimas 8 semanas (lunes-domingo). S8 contiene HOY, S1 es la más vieja.
router.get('/', async (req, res) => {
  if (!dbCheck(res)) return;

  const localDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Lunes de la semana actual
  const today = new Date();
  const dow = today.getDay();
  const mondayShift = dow === 0 ? -6 : 1 - dow;
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() + mondayShift);

  // Inicio de ventana = lunes de 7 semanas atrás respecto al lunes de esta semana
  const startMonday = new Date(thisMonday);
  startMonday.setDate(thisMonday.getDate() - 7 * 7);

  const todayStr = localDate(today);
  const startStr = localDate(startMonday);

  // Límites (inclusive inicio, exclusivo fin) de cada una de las 8 semanas
  const weekBounds = [];
  for (let i = 0; i < 8; i++) {
    const wStart = new Date(startMonday);
    wStart.setDate(startMonday.getDate() + i * 7);
    const wEnd = new Date(wStart);
    wEnd.setDate(wStart.getDate() + 7); // exclusivo
    weekBounds.push({ start: localDate(wStart), end: localDate(wEnd) });
  }

  const weeks = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];

  // Asigna una fecha (YYYY-MM-DD) al índice de semana 0-7, o -1 si está fuera de ventana.
  const weekIndexOf = (dateStr) => {
    for (let i = 0; i < 8; i++) {
      if (dateStr >= weekBounds[i].start && dateStr < weekBounds[i].end) return i;
    }
    return -1;
  };

  // --- sessions en la ventana ---
  const { data: sessions, error: sessErr } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', req.userId)
    .gte('date', startStr)
    .lte('date', todayStr)
    .order('date', { ascending: true });
  if (sessErr) return res.status(500).json({ error: sessErr.message });

  // --- tournaments en la ventana ---
  const { data: tournaments, error: tourErr } = await supabase
    .from('tournaments')
    .select('*')
    .eq('user_id', req.userId)
    .gte('date', startStr)
    .lte('date', todayStr);
  if (tourErr) return res.status(500).json({ error: tourErr.message });

  // --- daily_metrics en la ventana (columnas de cuerpo arbitrarias) ---
  const { data: metrics, error: metErr } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('user_id', req.userId)
    .gte('date', startStr)
    .lte('date', todayStr)
    .order('date', { ascending: true });
  if (metErr) return res.status(500).json({ error: metErr.message });

  const sessRows = sessions || [];
  const tourRows = tournaments || [];
  const metRows  = metrics || [];

  // ---- weightData: último peso registrado por semana, null si no hay ----
  const weightByWeek = new Array(8).fill(null);
  let anyWeight = false;
  for (const row of metRows) {
    const w = row.weight_kg;
    if (w === undefined || w === null) continue;
    const idx = weekIndexOf(row.date);
    if (idx < 0) continue;
    // metRows viene ordenado ascendente por date, así que el último que escribimos
    // es el más reciente de la semana.
    weightByWeek[idx] = w;
    anyWeight = true;
  }
  const weightData = anyWeight ? weightByWeek : [];

  // ---- performanceData: % de sesiones done sobre planificadas no-rest por semana ----
  const planned = new Array(8).fill(0); // type != 'rest'
  const doneNonRest = new Array(8).fill(0); // type != 'rest' && done
  let anyPlanned = false;
  for (const s of sessRows) {
    const idx = weekIndexOf(s.date);
    if (idx < 0) continue;
    if (s.type !== 'rest') {
      planned[idx] += 1;
      anyPlanned = true;
      if (s.done === true) doneNonRest[idx] += 1;
    }
  }
  const perfByWeek = new Array(8).fill(null);
  for (let i = 0; i < 8; i++) {
    if (planned[i] > 0) {
      perfByWeek[i] = Math.round((doneNonRest[i] / planned[i]) * 100);
    }
  }
  const performanceData = anyPlanned ? perfByWeek : [];

  // ---- stats.sessions: sesiones done=true en la ventana ----
  const statsSessions = sessRows.filter((s) => s.done === true).length;

  // ---- stats.tournaments: torneos en la ventana ----
  const statsTournaments = tourRows.length;

  // ---- stats.streak: días consecutivos con al menos una sesión done, terminando hoy o ayer ----
  const doneDates = new Set(
    sessRows.filter((s) => s.done === true).map((s) => s.date)
  );
  let streak = 0;
  {
    const cursor = new Date(today);
    const todayHas = doneDates.has(localDate(cursor));
    if (!todayHas) {
      // permitir que la racha empiece ayer si hoy no hay
      cursor.setDate(cursor.getDate() - 1);
    }
    // si ni hoy ni ayer tienen, streak queda en 0
    while (doneDates.has(localDate(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  const hasData = sessRows.length > 0 || tourRows.length > 0 || anyWeight;

  return res.json({
    weeks,
    weightData,
    performanceData,
    stats: {
      sessions: statsSessions,
      tournaments: statsTournaments,
      streak,
    },
    hasData,
  });
});

module.exports = router;
