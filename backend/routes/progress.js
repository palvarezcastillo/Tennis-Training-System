const { Router } = require('express');
const supabase   = require('../middleware/supabase');
const requireAuth = require('../middleware/auth');
const { today, addDays, mondayOf } = require('../lib/appDate');

const router = Router();
router.use(requireAuth);

const dbCheck = (res) => { if (!supabase) { res.status(503).json({ error: 'Database not configured.' }); return false; } return true; };

// GET /api/progress
// Ventana: últimas 8 semanas (lunes-domingo). S8 contiene HOY, S1 es la más vieja.
router.get('/', async (req, res) => {
  if (!dbCheck(res)) return;

  // Todas las fechas en el calendario del usuario, no en el del servidor.
  const todayStr = today();

  // Inicio de ventana = lunes de 7 semanas atrás respecto al lunes de esta semana
  const startStr = addDays(mondayOf(todayStr), -7 * 7);

  // Límites (inclusive inicio, exclusivo fin) de cada una de las 8 semanas
  const weekBounds = [];
  for (let i = 0; i < 8; i++) {
    const wStart = addDays(startStr, i * 7);
    weekBounds.push({ start: wStart, end: addDays(wStart, 7) }); // end exclusivo
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

  // ---- loadData: carga de entrenamiento semanal = Σ(duration_min × rpe) de sesiones cumplidas ----
  // ---- rpeData: RPE promedio semanal de sesiones cumplidas (señal de sobreentrenamiento) ----
  const loadByWeek = new Array(8).fill(0);
  const loadCount  = new Array(8).fill(0);
  const rpeSum     = new Array(8).fill(0);
  const rpeCount   = new Array(8).fill(0);
  let anyLoad = false;
  let anyRpe  = false;
  for (const s of sessRows) {
    if (s.done !== true) continue;
    const idx = weekIndexOf(s.date);
    if (idx < 0) continue;
    const hasRpe = s.rpe !== null && s.rpe !== undefined && !Number.isNaN(Number(s.rpe));
    const hasDur = s.duration_min !== null && s.duration_min !== undefined && !Number.isNaN(Number(s.duration_min));
    if (hasRpe) {
      rpeSum[idx] += Number(s.rpe);
      rpeCount[idx] += 1;
      anyRpe = true;
      if (hasDur) {
        loadByWeek[idx] += Number(s.duration_min) * Number(s.rpe);
        loadCount[idx] += 1;
        anyLoad = true;
      }
    }
  }
  const loadData = anyLoad ? loadByWeek.map((v, i) => (loadCount[i] > 0 ? Math.round(v) : null)) : [];
  const rpeData  = anyRpe  ? rpeSum.map((v, i) => (rpeCount[i] > 0 ? Math.round((v / rpeCount[i]) * 10) / 10 : null)) : [];

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
    let cursor = todayStr;
    if (!doneDates.has(cursor)) {
      // permitir que la racha empiece ayer si hoy no hay
      cursor = addDays(cursor, -1);
    }
    // si ni hoy ni ayer tienen, streak queda en 0
    while (doneDates.has(cursor)) {
      streak += 1;
      cursor = addDays(cursor, -1);
    }
  }

  const hasData = sessRows.length > 0 || tourRows.length > 0 || anyWeight;

  return res.json({
    weeks,
    weightData,
    performanceData,
    loadData,
    rpeData,
    stats: {
      sessions: statsSessions,
      tournaments: statsTournaments,
      streak,
    },
    hasData,
  });
});

module.exports = router;
