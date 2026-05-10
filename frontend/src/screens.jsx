import React from 'react'
import { TennisPlayer, RingChart, MiniBar, Icon } from './shared.jsx'

// ─── DATA & STATE ─────────────────────────────────────────────────────────────
const QUOTES = [
  { text: "El éxito es la suma de pequeños esfuerzos repetidos día tras día.", author: "R. Collier" },
  { text: "El campeón no es el que nunca cae, sino el que se levanta cada vez.", author: "Vince Lombardi" },
  { text: "Entrená como si nadie te viera. Competí como si todos te miraran.", author: "Anónimo" },
  { text: "La arcilla no miente: cada sesión deja su huella.", author: "Rafael Nadal" },
  { text: "Tu cuerpo puede hacer casi cualquier cosa. Es tu mente la que necesitás convencer.", author: "Anónimo" },
  { text: "No cuentes los días, hacé que los días cuenten.", author: "Muhammad Ali" },
  { text: "El dolor de hoy es la fortaleza de mañana.", author: "Anónimo" },
  { text: "Los grandes jugadores no nacen en los torneos, nacen en el entrenamiento.", author: "Anónimo" },
];

const WEEK_DATA = [
  { day: "Lun", date: "20", type: "gym", label: "Gym", done: true, intensity: 8 },
  { day: "Mar", date: "21", type: "tennis", label: "Cancha", done: true, intensity: 7 },
  { day: "Mié", date: "22", type: "rest", label: "Descanso", done: true, intensity: 0 },
  { day: "Jue", date: "23", type: "gym", label: "Gym", done: true, intensity: 9 },
  { day: "Vie", date: "24", type: "tennis", label: "Cancha", done: false, intensity: 0, today: true },
  { day: "Sáb", date: "25", type: "tournament", label: "Torneo", done: false, intensity: 0 },
  { day: "Dom", date: "26", type: "rest", label: "Descanso", done: false, intensity: 0 },
];

const TYPE_COLOR = {
  gym: "#e87a3c",
  tennis: "#d4501a",
  rest: "#5a3a22",
  tournament: "#f0c040",
};

const PROGRESS_WEEKS = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
const WEIGHT_DATA = [84.2, 83.8, 83.5, 83.1, 82.9, 82.4, 82.0, 81.7];
const PERFORMANCE_DATA = [62, 65, 64, 68, 70, 73, 75, 78];

// ─── SPLASH SCREEN ─────────────────────────────────────────────────────────────
export const SplashScreen = ({ onEnter }) => {
  const [quote] = React.useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [visible, setVisible] = React.useState(false);
  const [out, setOut] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setVisible(true), 200);
  }, []);

  const handleEnter = () => {
    setOut(true);
    setTimeout(onEnter, 600);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'linear-gradient(160deg, #1a0c05 0%, #2a160c 50%, #381e12 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, opacity: out ? 0 : 1, transition: 'opacity 0.6s ease', padding: '32px 24px',
    }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.06 }}>
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: `${i * 8.5}%`, width: 1, background: '#d4501a' }} />
        ))}
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: `${i * 5.3}%`, height: 1, background: '#d4501a' }} />
        ))}
      </div>

      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease', textAlign: 'center', maxWidth: 360 }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 8 }}>
          <TennisPlayer size={110} color="#d4501a" />
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 80, height: 3, background: 'linear-gradient(90deg, transparent, #d4501a, transparent)', borderRadius: 2 }} />
        </div>

        <div style={{ marginBottom: 4 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>MIRA</span>
          <span style={{ fontSize: 28, fontWeight: 300, color: '#d4501a', letterSpacing: 2, marginLeft: 8 }}>TENNIS</span>
        </div>
        <div style={{ fontSize: 11, color: '#8a5a3a', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 40 }}>Training System</div>

        <div style={{ background: 'rgba(212,80,26,0.08)', border: '1px solid rgba(212,80,26,0.2)', borderRadius: 16, padding: '20px 24px', marginBottom: 40 }}>
          <div style={{ fontSize: 15, color: '#f0dac8', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 8 }}>"{quote.text}"</div>
          <div style={{ fontSize: 12, color: '#8a5a3a' }}>— {quote.author}</div>
        </div>

        <button onClick={handleEnter} style={{
          background: 'linear-gradient(135deg, #d4501a, #e87a3c)',
          border: 'none', borderRadius: 50, padding: '16px 48px',
          color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: 1,
          cursor: 'pointer', boxShadow: '0 8px 32px rgba(212,80,26,0.4)',
          textTransform: 'uppercase',
        }}>
          Empezar →
        </button>
      </div>
    </div>
  );
};

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────
export const DashboardScreen = ({ setScreen }) => {
  const [apiMetrics, setApiMetrics] = React.useState(null);
  const [loadingMetrics, setLoadingMetrics] = React.useState(true);
  const [metricsError, setMetricsError] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/metrics/today')
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(data => setApiMetrics(data))
      .catch(err => setMetricsError(err.toString()))
      .finally(() => setLoadingMetrics(false));
  }, []);

  const weight     = apiMetrics?.weight       ?? 81.7;
  const calories   = apiMetrics?.calories     ?? 1420;
  const protein    = apiMetrics?.protein      ?? 95;
  const sleepHours = apiMetrics?.sleep_hours  ?? 7.5;
  const heartRate  = apiMetrics?.heart_rate   ?? 58;
  const water      = apiMetrics?.water_liters ?? 2.1;

  const metrics = [
    { label: "Peso",      value: weight,     unit: "kg",   icon: "target", color: "#e87a3c", ring: weight,     max: 90   },
    { label: "Calorías",  value: calories,   unit: "kcal", icon: "fire",   color: "#d4501a", ring: calories,   max: 2800 },
    { label: "Proteína",  value: protein,    unit: "g",    icon: "bolt",   color: "#f0a060", ring: protein,    max: 180  },
    { label: "Sueño",     value: sleepHours, unit: "h",    icon: "moon",   color: "#a060d4", ring: sleepHours, max: 9    },
    { label: "FC Reposo", value: heartRate,  unit: "bpm",  icon: "heart",  color: "#e04060", ring: heartRate,  max: 80   },
    { label: "Agua",      value: water,      unit: "L",    icon: "drop",   color: "#40a0d4", ring: water,      max: 3    },
  ];

  return (
    <div style={{ padding: '0 16px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 12, color: '#8a5a3a', letterSpacing: 1, textTransform: 'uppercase' }}>Viernes 24 Abril</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>¡Hola, Mira! 👋</div>
          <div style={{ fontSize: 13, color: '#d4501a' }}>Hoy: Entrenamiento en Cancha</div>
        </div>
        <TennisPlayer size={60} color="#d4501a" opacity={0.9} />
      </div>

      <div style={{ background: 'linear-gradient(135deg, #3a2008, #2a1208)', border: '1px solid #f0c040', borderRadius: 14, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="trophy" size={22} color="#f0c040" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: '#f0c040', textTransform: 'uppercase', letterSpacing: 1 }}>Próximo Torneo</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Club Tenis Palermo — Sábado 25 Abr</div>
        </div>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#f0c040' }}>1</div>
        <div style={{ fontSize: 10, color: '#a07030' }}>día</div>
      </div>

      <div style={{ fontSize: 12, color: '#8a5a3a', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Métricas del día</div>
      {metricsError && (
        <div style={{ background: 'rgba(212,80,26,0.08)', border: '1px solid rgba(212,80,26,0.25)', borderRadius: 10, padding: '8px 14px', marginBottom: 12, fontSize: 11, color: '#e87a3c' }}>
          Sin conexión al backend — mostrando datos de ejemplo
        </div>
      )}
      {loadingMetrics ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 120, marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: '#5a3a22' }}>Cargando métricas...</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
          {metrics.map(m => (
            <div key={m.label} style={{ background: '#2a160c', borderRadius: 14, padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ position: 'relative' }}>
                <RingChart value={m.ring} max={m.max} color={m.color} size={58} strokeWidth={5}>
                  <foreignObject x={8} y={8} width={42} height={42}>
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={m.icon} size={16} color={m.color} />
                    </div>
                  </foreignObject>
                </RingChart>
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{m.value}<span style={{ fontSize: 9, color: '#8a5a3a', fontWeight: 400, marginLeft: 1 }}>{m.unit}</span></div>
              <div style={{ fontSize: 10, color: '#8a5a3a' }}>{m.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: '#2a160c', borderRadius: 14, padding: '14px 16px', marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Intensidad semana</div>
          <div style={{ fontSize: 11, color: '#8a5a3a' }}>RPE</div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 48 }}>
          {WEEK_DATA.map((d, i) => {
            const h = d.intensity > 0 ? (d.intensity / 10) * 44 : 4;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', height: 44, display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ width: '100%', height: h, background: d.today ? '#d4501a' : (d.done ? '#5a3018' : '#2a1808'), borderRadius: 3, transition: 'height 0.5s ease' }} />
                </div>
                <div style={{ fontSize: 9, color: d.today ? '#d4501a' : '#5a3018' }}>{d.day}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button onClick={() => setScreen('food')} style={{ background: '#2a160c', border: '1px solid #3a1808', borderRadius: 14, padding: '14px', cursor: 'pointer', textAlign: 'left' }}>
          <Icon name="utensils" size={20} color="#e87a3c" />
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginTop: 8 }}>Registrar comida</div>
          <div style={{ fontSize: 11, color: '#8a5a3a' }}>{calories} / 2800 kcal</div>
          <MiniBar value={calories} max={2800} color="#e87a3c" />
        </button>
        <button onClick={() => setScreen('training')} style={{ background: '#2a160c', border: '1px solid #3a1808', borderRadius: 14, padding: '14px', cursor: 'pointer', textAlign: 'left' }}>
          <Icon name="racket" size={20} color="#d4501a" />
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginTop: 8 }}>Entrenamiento</div>
          <div style={{ fontSize: 11, color: '#8a5a3a' }}>Cancha hoy</div>
          <div style={{ marginTop: 6 }}>
            <span style={{ fontSize: 10, background: 'rgba(212,80,26,0.2)', color: '#d4501a', padding: '2px 8px', borderRadius: 20 }}>Pendiente</span>
          </div>
        </button>
      </div>
    </div>
  );
};

// ─── CALENDAR ─────────────────────────────────────────────────────────────────
export const CalendarScreen = () => {
  const [weekOffset, setWeekOffset]   = React.useState(0);
  const [refreshKey, setRefreshKey]   = React.useState(0);
  const [weekData, setWeekData]       = React.useState(WEEK_DATA);
  const [weekLabel, setWeekLabel]     = React.useState('');
  const [loadingWeek, setLoadingWeek] = React.useState(true);
  const [weekError, setWeekError]     = React.useState(null);
  const [selectedDay, setSelectedDay] = React.useState(() => {
    const idx = WEEK_DATA.findIndex(d => d.today);
    return idx >= 0 ? idx : 0;
  });
  const [planModal, setPlanModal]     = React.useState(false);
  const [allTournaments, setAllTournaments]   = React.useState([]);
  const [showAddTournament, setShowAddTournament] = React.useState(false);
  const [newTournament, setNewTournament] = React.useState({ name: '', date: '', time: '', location: '', category: 'Club', notes: '' });
  const [savingTournament, setSavingTournament] = React.useState(false);
  const [tournamentError, setTournamentError] = React.useState(null);
  const [planForm, setPlanForm] = React.useState({ type: 'tennis', date: '', time: '', duration_min: 60, rpe: 7, notes: '' });
  const [savingPlan, setSavingPlan] = React.useState(false);
  const [planError, setPlanError] = React.useState(null);
  const [weekSessions, setWeekSessions] = React.useState([]);

  const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const fmtDate = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;

  const getMonday = (offset) => {
    const today = new Date();
    const dow = today.getDay();
    const shift = dow === 0 ? -6 : 1 - dow;
    const mon = new Date(today);
    mon.setDate(today.getDate() + shift + offset * 7);
    return mon;
  };

  React.useEffect(() => {
    setLoadingWeek(true);
    const localDate = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const today = new Date();
    const todayStr = localDate(today);
    const monday = getMonday(weekOffset);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const monStr = localDate(monday);
    const sunStr = localDate(sunday);

    setWeekLabel(`${fmtDate(monday)} – ${fmtDate(sunday)}`);

    const DAY_NAMES = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    const TYPE_LABELS = { gym:'Gym', tennis:'Cancha', rest:'Descanso', tournament:'Torneo' };

    Promise.all([
      fetch(`/api/sessions/week?offset=${weekOffset}`)
        .then(r => r.ok ? r.json() : Promise.reject(r.statusText)),
      fetch(`/api/tournaments?from=${monStr}&to=${sunStr}`)
        .then(r => r.ok ? r.json() : []),
    ]).then(([sessions, weekTournaments]) => {
      const week = DAY_NAMES.map((dayName, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dateStr = localDate(d);
        const isToday = dateStr === todayStr;
        const session = sessions.find(s => s.date === dateStr);
        const trn = weekTournaments.find(t => t.date === dateStr);
        const type = trn ? 'tournament' : (session?.type || 'rest');
        return {
          day: dayName,
          date: String(d.getDate()),
          fullDate: dateStr,
          type,
          label: trn ? trn.name : (session?.label || TYPE_LABELS[type] || 'Descanso'),
          done: session?.done ?? false,
          intensity: session?.intensity ?? 0,
          tournament: trn || null,
          ...(isToday ? { today: true } : {}),
        };
      });
      console.log('[weekSessions] recibidas:', JSON.stringify(sessions));
      setWeekData(week);
      setWeekSessions(sessions);
      setWeekError(null);
      if (weekOffset === 0) {
        const todayIdx = week.findIndex(d => d.today);
        if (todayIdx >= 0) setSelectedDay(todayIdx);
      } else {
        setSelectedDay(0);
      }
    }).catch(err => {
      setWeekError(err.toString());
      if (weekOffset === 0) setWeekData(WEEK_DATA);
    }).finally(() => setLoadingWeek(false));
  }, [weekOffset, refreshKey]);

  React.useEffect(() => {
    fetch('/api/tournaments')
      .then(r => r.ok ? r.json() : [])
      .then(data => setAllTournaments(data))
      .catch(() => {});
  }, [refreshKey]);

  const addTournament = () => {
    if (!newTournament.name || !newTournament.date) return;
    setSavingTournament(true);
    setTournamentError(null);
    fetch('/api/tournaments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTournament),
    })
      .then(r => r.ok ? r.json() : r.json().then(body => Promise.reject(body.error || r.statusText)))
      .then(() => {
        setShowAddTournament(false);
        setTournamentError(null);
        setNewTournament({ name: '', date: '', time: '', location: '', category: 'Club', notes: '' });
        setRefreshKey(k => k + 1);
      })
      .catch(err => setTournamentError(String(err)))
      .finally(() => setSavingTournament(false));
  };

  const openPlanModal = () => {
    setPlanForm(f => ({ ...f, date: sel.fullDate || '', time: '' }));
    setPlanError(null);
    setPlanModal(true);
  };

  const savePlan = () => {
    if (!planForm.date || !planForm.type) return;
    setSavingPlan(true);
    setPlanError(null);
    fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: planForm.date, type: planForm.type, duration_min: planForm.duration_min, rpe: planForm.rpe, notes: planForm.notes, done: false }),
    })
      .then(r => r.ok ? r.json() : r.json().then(body => Promise.reject(body.error || r.statusText)))
      .then(() => {
        setPlanModal(false);
        setPlanError(null);
        setRefreshKey(k => k + 1);
      })
      .catch(err => setPlanError(String(err)))
      .finally(() => setSavingPlan(false));
  };

  const deleteTournament = (id) => {
    fetch(`/api/tournaments/${id}`, { method: 'DELETE' })
      .then(() => setRefreshKey(k => k + 1))
      .catch(err => setWeekError(err.toString()));
  };

  const toggleDone = (session) => {
    const newDone = !session.done;
    setWeekSessions(prev => prev.map(s => s.id === session.id ? { ...s, done: newDone } : s));
    fetch(`/api/sessions/${session.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: newDone }),
    }).catch(() => {
      setWeekSessions(prev => prev.map(s => s.id === session.id ? { ...s, done: session.done } : s));
    });
  };

  const sel = weekData[selectedDay] || weekData[0] || {};
  const daySessions = weekSessions.filter(s => s.date === sel.fullDate);
  console.log('[daySessions] filtrando por', sel.fullDate, '→', daySessions.length, 'sesiones', JSON.stringify(daySessions.map(s => ({ id: s.id, type: s.type, date: s.date, duration_min: s.duration_min, rpe: s.rpe, notes: s.notes, done: s.done }))));

  return (
    <div style={{ padding: '0 16px 20px' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Calendario</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setWeekOffset(o => o - 1)} style={{ background: '#2a160c', border: '1px solid #2a1208', borderRadius: 10, width: 34, height: 34, cursor: 'pointer', color: '#f0dac8', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>‹</button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#f0dac8' }}>{weekLabel}</div>
        <button onClick={() => setWeekOffset(o => o + 1)} style={{ background: '#2a160c', border: '1px solid #2a1208', borderRadius: 10, width: 34, height: 34, cursor: 'pointer', color: '#f0dac8', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>›</button>
        {weekOffset !== 0 && (
          <button onClick={() => setWeekOffset(0)} style={{ background: 'rgba(212,80,26,0.15)', border: '1px solid rgba(212,80,26,0.3)', borderRadius: 10, padding: '6px 10px', cursor: 'pointer', color: '#d4501a', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>Hoy</button>
        )}
      </div>

      {weekError && (
        <div style={{ background: 'rgba(212,80,26,0.08)', border: '1px solid rgba(212,80,26,0.25)', borderRadius: 10, padding: '8px 14px', marginBottom: 12, fontSize: 11, color: '#e87a3c' }}>
          Sin conexión al backend — mostrando datos de ejemplo
        </div>
      )}

      {loadingWeek ? (
        <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: '#5a3a22' }}>Cargando semana...</div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {weekData.map((d, i) => (
            <button key={i} onClick={() => setSelectedDay(i)} style={{
              flex: 1, background: selectedDay === i ? (d.type === 'tournament' ? '#3a2a00' : '#2a1808') : '#2a160c',
              border: `1px solid ${selectedDay === i ? TYPE_COLOR[d.type] : '#2a1208'}`,
              borderRadius: 12, padding: '8px 2px', cursor: 'pointer',
              outline: d.today ? '2px solid #d4501a' : 'none', outlineOffset: 2,
            }}>
              <div style={{ fontSize: 9, color: '#8a5a3a', textTransform: 'uppercase', marginBottom: 2 }}>{d.day}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{d.date}</div>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: TYPE_COLOR[d.type], margin: '4px auto 0' }} />
            </button>
          ))}
        </div>
      )}

      {!loadingWeek && (
        <div style={{ background: '#2a160c', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{sel.day} {sel.date}</div>
              <div style={{ fontSize: 12, color: TYPE_COLOR[sel.type] || '#8a5a3a' }}>
                {sel.label}{sel.today && ' • HOY'}
              </div>
            </div>
            <button onClick={openPlanModal} style={{ background: 'rgba(212,80,26,0.15)', border: '1px solid rgba(212,80,26,0.3)', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', color: '#d4501a', fontSize: 12, fontWeight: 600 }}>
              + Planificar
            </button>
          </div>

          {sel.type === 'tournament' && (
            <div style={{ textAlign: 'center', padding: '10px 0', marginBottom: daySessions.length > 0 ? 12 : 0 }}>
              <Icon name="trophy" size={32} color="#f0c040" />
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginTop: 6 }}>{sel.tournament?.name || sel.label}</div>
              {sel.tournament?.location && <div style={{ fontSize: 12, color: '#a07030', marginTop: 3 }}>{sel.tournament.location}</div>}
              {sel.tournament?.category && <div style={{ fontSize: 11, color: '#f0c040', marginTop: 3 }}>Cat. {sel.tournament.category}</div>}
            </div>
          )}
          {daySessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '14px 0' }}>
              <div style={{ fontSize: 13, color: '#5a3a22' }}>Sin actividad planificada</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {daySessions.map(s => {
                const tc = { tennis: '#d4501a', gym: '#e87a3c', rest: '#a060d4', tournament: '#f0c040' }[s.type] || '#8a5a3a';
                const tl = { tennis: 'Tenis', gym: 'Gym', rest: 'Descanso', tournament: 'Torneo' }[s.type] || s.type;
                return (
                  <div key={s.id} style={{ background: '#2a1208', borderRadius: 12, padding: '12px 14px', borderLeft: `3px solid ${tc}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ background: `${tc}22`, color: tc, fontSize: 10, fontWeight: 700, borderRadius: 6, padding: '2px 7px' }}>{tl}</span>
                        {s.time && <span style={{ fontSize: 11, color: '#8a5a3a' }}>{s.time}</span>}
                      </div>
                      <button onClick={() => toggleDone(s)}
                        style={{ background: s.done ? 'rgba(80,180,80,0.15)' : 'rgba(212,80,26,0.08)', border: `1px solid ${s.done ? '#4a8a4a' : '#3a1808'}`, borderRadius: 8, padding: '4px 9px', cursor: 'pointer', color: s.done ? '#6aba6a' : '#5a3a22', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {s.done ? '✓ Cumplido' : '✗ No cumplido'}
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: s.notes ? 4 : 0 }}>
                      <span style={{ fontSize: 10, color: '#f0dac8' }}>{s.date}</span>
                      {s.duration_min && <span style={{ fontSize: 14, color: '#f0dac8' }}>{s.duration_min} min</span>}
                      {s.rpe && <span style={{ fontSize: 14, color: '#f0dac8' }}>RPE {s.rpe}/10</span>}
                      <span style={{ fontSize: 10, color: s.done ? '#6aba6a' : '#5a3a22' }}>{s.done ? 'cumplido' : 'pendiente'}</span>
                    </div>
                    {s.notes && <div style={{ fontSize: 16, color: '#f0dac8', fontStyle: 'italic' }}>{s.notes}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: '#8a5a3a', letterSpacing: 2, textTransform: 'uppercase' }}>Torneos</div>
        <button onClick={() => setShowAddTournament(true)} style={{ background: 'rgba(240,192,64,0.15)', border: '1px solid rgba(240,192,64,0.3)', borderRadius: 10, padding: '5px 12px', cursor: 'pointer', color: '#f0c040', fontSize: 12, fontWeight: 700 }}>+ Agregar</button>
      </div>

      {allTournaments.length === 0 ? (
        <div style={{ background: '#2a160c', borderRadius: 12, padding: '16px', textAlign: 'center', fontSize: 12, color: '#5a3a22', marginBottom: 8 }}>
          No hay torneos cargados
        </div>
      ) : (
        allTournaments.map((ev) => (
          <div key={ev.id} style={{ background: '#2a160c', borderRadius: 12, padding: '12px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, borderLeft: '3px solid #f0c040' }}>
            <Icon name="trophy" size={18} color="#f0c040" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{ev.name}</div>
              <div style={{ fontSize: 11, color: '#8a5a3a' }}>{ev.date}{ev.location ? ` · ${ev.location}` : ''}{ev.category ? ` · ${ev.category}` : ''}</div>
            </div>
            <button onClick={() => deleteTournament(ev.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5a3a22', fontSize: 18, lineHeight: 1, padding: '0 4px' }}>×</button>
          </div>
        ))
      )}

      {planModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }} onClick={() => { setPlanModal(false); setPlanError(null); }}>
          <div style={{ background: '#2a160c', width: '100%', borderRadius: '20px 20px 0 0', padding: 24, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Planificar día</div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#8a5a3a', marginBottom: 6 }}>Tipo</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { val: 'tennis', label: 'Tenis', color: '#d4501a' },
                  { val: 'gym', label: 'Gym', color: '#e87a3c' },
                  { val: 'rest', label: 'Descanso', color: '#a060d4' },
                ].map(({ val, label, color }) => (
                  <button key={val} onClick={() => setPlanForm(f => ({ ...f, type: val }))}
                    style={{ flex: 1, padding: '8px 2px', borderRadius: 10, border: `1px solid ${planForm.type === val ? color : '#3a1808'}`, background: planForm.type === val ? `${color}22` : '#2a1208', color: planForm.type === val ? color : '#5a3a22', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: '#8a5a3a', marginBottom: 4 }}>Fecha</div>
                <input type="date" value={planForm.date} onChange={e => setPlanForm(f => ({ ...f, date: e.target.value }))}
                  style={{ width: '100%', background: '#2a1208', border: '1px solid #3a1808', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: '#8a5a3a', marginBottom: 4 }}>Hora</div>
                <input type="time" value={planForm.time} onChange={e => setPlanForm(f => ({ ...f, time: e.target.value }))}
                  style={{ width: '100%', background: '#2a1208', border: '1px solid #3a1808', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: '#8a5a3a', marginBottom: 4 }}>Duración (minutos)</div>
              <input type="number" min="1" max="480" value={planForm.duration_min} onChange={e => setPlanForm(f => ({ ...f, duration_min: Number(e.target.value) }))}
                style={{ width: '100%', background: '#2a1208', border: '1px solid #3a1808', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#8a5a3a', marginBottom: 6 }}>RPE — <span style={{ color: '#f0dac8', fontWeight: 700 }}>{planForm.rpe}</span>/10</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button key={n} onClick={() => setPlanForm(f => ({ ...f, rpe: n }))}
                    style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: 'none', background: planForm.rpe === n ? '#d4501a' : '#2a1208', color: planForm.rpe === n ? '#fff' : '#5a3a22', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: '#8a5a3a', marginBottom: 4 }}>Notas</div>
              <textarea value={planForm.notes} onChange={e => setPlanForm(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Opcional..."
                style={{ width: '100%', background: '#2a1208', border: '1px solid #3a1808', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }} />
            </div>

            {planError && (
              <div style={{ background: 'rgba(212,80,26,0.12)', border: '1px solid rgba(212,80,26,0.4)', borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 12, color: '#e87a3c' }}>
                Error: {planError}
              </div>
            )}
            <button onClick={savePlan} disabled={savingPlan} style={{ width: '100%', background: 'linear-gradient(135deg, #a03010, #d4501a)', border: 'none', borderRadius: 12, padding: 14, color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
              {savingPlan ? 'Guardando...' : 'Guardar sesión'}
            </button>
          </div>
        </div>
      )}

      {showAddTournament && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }} onClick={() => { setShowAddTournament(false); setTournamentError(null); }}>
          <div style={{ background: '#2a160c', width: '100%', borderRadius: '20px 20px 0 0', padding: 24, maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Nuevo Torneo</div>
            {[
              { label: 'Nombre',  key: 'name',     placeholder: 'Ej: Torneo Club Palermo', type: 'text' },
              { label: 'Notas',   key: 'notes',    placeholder: 'Opcional...',               type: 'text' },
              { label: 'Lugar',   key: 'location', placeholder: 'Ej: Club Palermo, Cancha 3', type: 'text' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: '#8a5a3a', marginBottom: 4 }}>{f.label}</div>
                <input type={f.type} value={newTournament[f.key]} onChange={e => setNewTournament(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} style={{ width: '100%', background: '#2a1208', border: '1px solid #3a1808', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: '#8a5a3a', marginBottom: 4 }}>Fecha</div>
                <input type="date" value={newTournament.date} onChange={e => setNewTournament(prev => ({ ...prev, date: e.target.value }))}
                  style={{ width: '100%', background: '#2a1208', border: '1px solid #3a1808', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: '#8a5a3a', marginBottom: 4 }}>Hora</div>
                <input type="time" value={newTournament.time} onChange={e => setNewTournament(prev => ({ ...prev, time: e.target.value }))}
                  style={{ width: '100%', background: '#2a1208', border: '1px solid #3a1808', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: '#8a5a3a', marginBottom: 4 }}>Categoría</div>
              <select value={newTournament.category} onChange={e => setNewTournament(prev => ({ ...prev, category: e.target.value }))}
                style={{ width: '100%', background: '#2a1208', border: '1px solid #3a1808', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, boxSizing: 'border-box' }}>
                {['Club','Provincial','Nacional','ITF'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {tournamentError && (
              <div style={{ background: 'rgba(212,80,26,0.12)', border: '1px solid rgba(212,80,26,0.4)', borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 12, color: '#e87a3c' }}>
                Error: {tournamentError}
              </div>
            )}
            <button onClick={addTournament} disabled={savingTournament} style={{ width: '100%', background: 'linear-gradient(135deg, #c89010, #f0c040)', border: 'none', borderRadius: 12, padding: 14, color: '#1a0c05', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
              {savingTournament ? 'Guardando...' : 'Agregar Torneo'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── TRAINING ─────────────────────────────────────────────────────────────────
export const TrainingScreen = () => {
  const [weekOffset, setWeekOffset]   = React.useState(0);
  const [weekData, setWeekData]       = React.useState(WEEK_DATA);
  const [weekLabel, setWeekLabel]     = React.useState('');
  const [weekSessions, setWeekSessions] = React.useState([]);
  const [loadingWeek, setLoadingWeek] = React.useState(true);
  const [weekError, setWeekError]     = React.useState(null);
  const [selectedDay, setSelectedDay] = React.useState(() => {
    const idx = WEEK_DATA.findIndex(d => d.today);
    return idx >= 0 ? idx : 0;
  });
  const [checkedItems, setCheckedItems] = React.useState({});
  const [rpe, setRpe]         = React.useState(7);
  const [saving, setSaving]   = React.useState(false);
  const [saveError, setSaveError]     = React.useState(null);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const fmtDate = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;

  const getMonday = (offset) => {
    const today = new Date();
    const dow = today.getDay();
    const shift = dow === 0 ? -6 : 1 - dow;
    const mon = new Date(today);
    mon.setDate(today.getDate() + shift + offset * 7);
    return mon;
  };

  React.useEffect(() => {
    setLoadingWeek(true);
    const localDate = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const today = new Date();
    const todayStr = localDate(today);
    const monday = getMonday(weekOffset);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    setWeekLabel(`${fmtDate(monday)} – ${fmtDate(sunday)}`);

    const DAY_NAMES  = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    const TYPE_LABELS = { gym:'Gym', tennis:'Cancha', rest:'Descanso', tournament:'Torneo' };

    fetch(`/api/sessions/week?offset=${weekOffset}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(sessions => {
        const week = DAY_NAMES.map((dayName, i) => {
          const d = new Date(monday);
          d.setDate(monday.getDate() + i);
          const dateStr = localDate(d);
          const isToday = dateStr === todayStr;
          const session = sessions.find(s => s.date === dateStr);
          const type = session?.type || 'rest';
          return {
            day: dayName,
            date: String(d.getDate()),
            fullDate: dateStr,
            type,
            label: session?.label || TYPE_LABELS[type] || 'Descanso',
            done: session?.done ?? false,
            intensity: session?.intensity ?? 0,
            ...(isToday ? { today: true } : {}),
          };
        });
        setWeekData(week);
        setWeekSessions(sessions);
        setWeekError(null);
        if (weekOffset === 0) {
          const todayIdx = week.findIndex(d => d.today);
          if (todayIdx >= 0) setSelectedDay(todayIdx);
        } else {
          setSelectedDay(0);
        }
      })
      .catch(err => {
        setWeekError(err.toString());
        if (weekOffset === 0) setWeekData(WEEK_DATA);
      })
      .finally(() => setLoadingWeek(false));
  }, [weekOffset]);

  React.useEffect(() => {
    setCheckedItems({});
    setSaveSuccess(false);
    setSaveError(null);
  }, [selectedDay, weekOffset]);

  const sel = weekData[selectedDay] || weekData[0] || {};
  const daySessions   = weekSessions.filter(s => s.date === sel.fullDate);
  const activeSession = daySessions[0] || null;

  const tennisWork = [
    { key: 't1', label: 'Calentamiento',       duration: '20min', detail: 'Trote + movilidad articular' },
    { key: 't2', label: 'Peloteo de fondo',     duration: '30min', detail: 'Cruzado FH/BH — consistencia' },
    { key: 't3', label: 'Volea y red',          duration: '20min', detail: 'Aproximaciones + voleas de definición' },
    { key: 't4', label: 'Saque',                duration: '15min', detail: '60 saques: plano, slice, kick' },
    { key: 't5', label: 'Partido de práctica',  duration: '30min', detail: 'Sets a 6 games — partido real' },
  ];

  const gymExercises = [
    { key: 'g1', name: 'Sentadillas',        sets: '4x8',  weight: '80 kg',       muscle: 'Piernas' },
    { key: 'g2', name: 'Press Banca',        sets: '3x10', weight: '70 kg',       muscle: 'Pecho' },
    { key: 'g3', name: 'Peso Muerto',        sets: '3x6',  weight: '100 kg',      muscle: 'Posterior' },
    { key: 'g4', name: 'Remo con Barra',     sets: '3x10', weight: '60 kg',       muscle: 'Espalda' },
    { key: 'g5', name: 'Rotación con Cable', sets: '3x15', weight: '20 kg',       muscle: 'Core/Tenis' },
    { key: 'g6', name: 'Plancha',            sets: '3x60s', weight: 'Peso corporal', muscle: 'Core' },
  ];

  const toggleCheck = (key) => setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));

  const completeSession = async () => {
    if (!activeSession) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const planItems = activeSession.type === 'tennis' ? tennisWork : gymExercises;
    const exercises = planItems.map(ex => ({
      key:  ex.key,
      name: ex.label || ex.name,
      done: !!checkedItems[ex.key],
    }));

    try {
      const detRes = await fetch('/api/session-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: activeSession.id, exercises }),
      });
      if (!detRes.ok) throw new Error((await detRes.json()).error || detRes.statusText);

      const sessRes = await fetch(`/api/sessions/${activeSession.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: true, rpe }),
      });
      if (!sessRes.ok) throw new Error((await sessRes.json()).error || sessRes.statusText);

      setWeekSessions(prev => prev.map(s => s.id === activeSession.id ? { ...s, done: true, rpe } : s));
      setWeekData(prev => prev.map((d, i) => i === selectedDay ? { ...d, done: true } : d));
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(String(err));
    }
    setSaving(false);
  };

  const accentColor = activeSession?.type === 'gym' ? '#e87a3c' : '#d4501a';

  return (
    <div style={{ padding: '0 16px 20px' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Entrenamiento</div>

      {/* Week navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setWeekOffset(o => o - 1)} style={{ background: '#2a160c', border: '1px solid #2a1208', borderRadius: 10, width: 34, height: 34, cursor: 'pointer', color: '#f0dac8', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>‹</button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#f0dac8' }}>{weekLabel}</div>
        <button onClick={() => setWeekOffset(o => o + 1)} style={{ background: '#2a160c', border: '1px solid #2a1208', borderRadius: 10, width: 34, height: 34, cursor: 'pointer', color: '#f0dac8', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>›</button>
        {weekOffset !== 0 && (
          <button onClick={() => setWeekOffset(0)} style={{ background: 'rgba(212,80,26,0.15)', border: '1px solid rgba(212,80,26,0.3)', borderRadius: 10, padding: '6px 10px', cursor: 'pointer', color: '#d4501a', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>Hoy</button>
        )}
      </div>

      {weekError && (
        <div style={{ background: 'rgba(212,80,26,0.08)', border: '1px solid rgba(212,80,26,0.25)', borderRadius: 10, padding: '8px 14px', marginBottom: 12, fontSize: 11, color: '#e87a3c' }}>
          Sin conexión al backend — mostrando datos de ejemplo
        </div>
      )}

      {/* 7-day row */}
      {loadingWeek ? (
        <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: '#5a3a22' }}>Cargando semana...</div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {weekData.map((d, i) => (
            <button key={i} onClick={() => setSelectedDay(i)} style={{
              flex: 1, background: selectedDay === i ? '#2a1808' : '#2a160c',
              border: `1px solid ${selectedDay === i ? TYPE_COLOR[d.type] : '#3a1808'}`,
              borderRadius: 12, padding: '8px 2px', cursor: 'pointer',
              outline: d.today ? '2px solid #d4501a' : 'none', outlineOffset: 2,
            }}>
              <div style={{ fontSize: 9, color: '#8a5a3a', textTransform: 'uppercase', marginBottom: 2 }}>{d.day}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: d.done ? '#4caf50' : '#fff' }}>{d.date}</div>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: d.done ? '#4caf50' : TYPE_COLOR[d.type], margin: '4px auto 0' }} />
            </button>
          ))}
        </div>
      )}

      {/* Day detail card */}
      {!loadingWeek && (
        <div style={{ background: '#2a160c', borderRadius: 16, padding: 16 }}>

          {/* Day header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{sel.day} {sel.date}</div>
              <div style={{ fontSize: 12, color: TYPE_COLOR[sel.type] || '#8a5a3a' }}>
                {sel.label}{sel.today && ' • HOY'}
              </div>
            </div>
            {activeSession && (
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                {activeSession.duration_min && (
                  <div style={{ fontSize: 12, color: '#f0dac8' }}>{activeSession.duration_min} min</div>
                )}
                {activeSession.done && (
                  <span style={{ fontSize: 10, background: 'rgba(76,175,80,0.2)', color: '#4caf50', padding: '2px 8px', borderRadius: 20 }}>✓ Cumplida</span>
                )}
              </div>
            )}
          </div>

          {/* No session */}
          {!activeSession && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 13, color: '#5a3a22' }}>Sin sesión planificada</div>
              <div style={{ fontSize: 11, color: '#3a2010', marginTop: 4 }}>Planificá desde el Calendario</div>
            </div>
          )}

          {/* Rest */}
          {activeSession?.type === 'rest' && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 32 }}>😴</div>
              <div style={{ fontSize: 14, color: '#a060d4', fontWeight: 700, marginTop: 8 }}>Día de Descanso</div>
              <div style={{ fontSize: 11, color: '#5a3a22', marginTop: 4 }}>Recuperación activa o reposo total</div>
            </div>
          )}

          {/* Tournament */}
          {activeSession?.type === 'tournament' && (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <Icon name="trophy" size={32} color="#f0c040" />
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginTop: 6 }}>Día de Torneo</div>
              <div style={{ fontSize: 11, color: '#a07030', marginTop: 3 }}>Llegá 30 min antes · Calentá bien</div>
            </div>
          )}

          {/* Tennis plan */}
          {activeSession?.type === 'tennis' && (
            <>
              <div style={{ fontSize: 11, color: '#8a5a3a', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Plan de sesión</div>
              {tennisWork.map(item => (
                <button key={item.key} onClick={() => toggleCheck(item.key)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: '#381e12', border: `1px solid ${checkedItems[item.key] ? '#d4501a' : '#3a1808'}`, borderRadius: 12, padding: '12px 14px', marginBottom: 8, cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: checkedItems[item.key] ? '#d4501a' : '#2a1808', border: `2px solid ${checkedItems[item.key] ? '#d4501a' : '#5a3018'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {checkedItems[item.key] && <Icon name="check" size={12} color="#fff" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: checkedItems[item.key] ? '#8a5a3a' : '#fff', textDecoration: checkedItems[item.key] ? 'line-through' : 'none' }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: '#5a3a22' }}>{item.detail}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#d4501a', fontWeight: 700 }}>{item.duration}</div>
                </button>
              ))}
            </>
          )}

          {/* Gym plan */}
          {activeSession?.type === 'gym' && (
            <>
              <div style={{ fontSize: 11, color: '#8a5a3a', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Rutina del día — Fuerza</div>
              {gymExercises.map(ex => (
                <button key={ex.key} onClick={() => toggleCheck(ex.key)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: '#381e12', border: `1px solid ${checkedItems[ex.key] ? '#e87a3c' : '#3a1808'}`, borderRadius: 12, padding: '12px 14px', marginBottom: 8, cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: checkedItems[ex.key] ? '#e87a3c' : '#2a1808', border: `2px solid ${checkedItems[ex.key] ? '#e87a3c' : '#5a3018'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {checkedItems[ex.key] && <Icon name="check" size={12} color="#fff" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: checkedItems[ex.key] ? '#8a5a3a' : '#fff' }}>{ex.name}</div>
                    <div style={{ fontSize: 11, color: '#5a3a22' }}>{ex.muscle}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#e87a3c' }}>{ex.sets}</div>
                    <div style={{ fontSize: 10, color: '#5a3a22' }}>{ex.weight}</div>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* RPE + Complete button — shown only after at least one exercise is checked */}
          {activeSession && (activeSession.type === 'tennis' || activeSession.type === 'gym') && !saveSuccess && !activeSession.done && Object.values(checkedItems).some(Boolean) && (
            <>
              <div style={{ background: '#381e12', borderRadius: 14, padding: 14, marginTop: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Intensidad percibida (RPE)</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: accentColor }}>{rpe}/10</div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <button key={n} onClick={() => setRpe(n)}
                      style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: 'none', background: rpe === n ? accentColor : '#2a1208', color: rpe === n ? '#fff' : '#5a3a22', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {saveError && (
                <div style={{ background: 'rgba(212,80,26,0.12)', border: '1px solid rgba(212,80,26,0.4)', borderRadius: 10, padding: '10px 14px', marginTop: 12, fontSize: 12, color: '#e87a3c' }}>
                  Error: {saveError}
                </div>
              )}

              <button onClick={completeSession} disabled={saving} style={{ width: '100%', background: `linear-gradient(135deg, ${accentColor === '#e87a3c' ? '#a04010, #e87a3c' : '#a03010, #d4501a'})`, border: 'none', borderRadius: 12, padding: 14, color: '#fff', fontSize: 15, fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', marginTop: 12, opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Guardando...' : '✓ Completar sesión'}
              </button>
            </>
          )}

          {/* Success */}
          {(saveSuccess || (activeSession?.done && !saveSuccess === false)) && saveSuccess && (
            <div style={{ background: 'rgba(76,175,80,0.12)', border: '1px solid rgba(76,175,80,0.4)', borderRadius: 10, padding: '16px 14px', marginTop: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>🎉</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#4caf50' }}>¡Sesión completada!</div>
              <div style={{ fontSize: 11, color: '#5a8a5a', marginTop: 4 }}>Guardada en RPE {rpe}/10</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── FOOD ─────────────────────────────────────────────────────────────────────
const NUTRITION_PILLARS = [
  { key: 'hydration',    name: 'Hidratación',      icon: 'drop',   color: '#40a0d4', detail: '2.5 L de agua diaria' },
  { key: 'carbs',        name: 'Carbohidratos',     icon: 'fire',   color: '#f0a060', detail: 'Fuente de energía principal' },
  { key: 'protein',      name: 'Proteína',          icon: 'bolt',   color: '#e87a3c', detail: 'Reparación y desarrollo muscular' },
  { key: 'fiber',        name: 'Fibras',            icon: 'target', color: '#4caf50', detail: 'Salud digestiva' },
  { key: 'supplements',  name: 'Suplementos',       icon: 'heart',  color: '#a060d4', detail: 'Vitaminas, minerales, omega-3' },
  { key: 'healthy_fats', name: 'Grasas saludables', icon: 'star',   color: '#f0c040', detail: 'Palta, frutos secos, aceite de oliva' },
];

export const FoodScreen = () => {
  // ── week navigation ──
  const [weekOffset, setWeekOffset]     = React.useState(0);
  const [weekData, setWeekData]         = React.useState(WEEK_DATA);
  const [weekLabel, setWeekLabel]       = React.useState('');
  const [weekNutrition, setWeekNutrition] = React.useState([]);
  const [loadingWeek, setLoadingWeek]   = React.useState(true);
  const [weekError, setWeekError]       = React.useState(null);
  const [selectedDay, setSelectedDay]   = React.useState(() => {
    const idx = WEEK_DATA.findIndex(d => d.today);
    return idx >= 0 ? idx : 0;
  });

  // ── pillars state for selected day ──
  const [pillarsState, setPillarsState]             = React.useState({});
  const [initialPillarsState, setInitialPillarsState] = React.useState({});
  const [saving, setSaving]         = React.useState(false);
  const [saveError, setSaveError]   = React.useState(null);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  // ── meals (today only) ──
  const [meals, setMeals]     = React.useState([]);
  const [mealsLoading, setMealsLoading] = React.useState(true);
  const [mealsError, setMealsError]     = React.useState(null);
  const [showAdd, setShowAdd] = React.useState(false);
  const [newMeal, setNewMeal] = React.useState({ name: 'Merienda', items: '', cal: '', p: '', c: '', g: '' });

  const MONTHS   = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const fmtDate  = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  const localDate = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  const getMonday = (offset) => {
    const today = new Date();
    const dow   = today.getDay();
    const shift = dow === 0 ? -6 : 1 - dow;
    const mon   = new Date(today);
    mon.setDate(today.getDate() + shift + offset * 7);
    return mon;
  };

  // fetch week dates + nutrition records
  React.useEffect(() => {
    setLoadingWeek(true);
    const today   = new Date();
    const todayStr = localDate(today);
    const monday  = getMonday(weekOffset);
    const sunday  = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const monStr  = localDate(monday);
    const sunStr  = localDate(sunday);
    setWeekLabel(`${fmtDate(monday)} – ${fmtDate(sunday)}`);

    const DAY_NAMES = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    const week = DAY_NAMES.map((dayName, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = localDate(d);
      return { day: dayName, date: String(d.getDate()), fullDate: dateStr, today: dateStr === todayStr };
    });

    fetch(`/api/nutrition?from=${monStr}&to=${sunStr}`)
      .then(r => r.ok ? r.json() : [])
      .catch(() => [])
      .then(nutrition => {
        setWeekData(week);
        setWeekNutrition(nutrition);
        setWeekError(null);
        if (weekOffset === 0) {
          const todayIdx = week.findIndex(d => d.today);
          if (todayIdx >= 0) setSelectedDay(todayIdx);
        } else {
          setSelectedDay(0);
        }
      })
      .catch(err => setWeekError(err.toString()))
      .finally(() => setLoadingWeek(false));
  }, [weekOffset]);

  // derive pillar state when day or nutrition data changes
  React.useEffect(() => {
    const sel = weekData[selectedDay] || {};
    const dayRecs = weekNutrition.filter(n => n.date === sel.fullDate);
    const state = {};
    NUTRITION_PILLARS.forEach(p => {
      const rec = dayRecs.find(n => n.pillar === p.key);
      state[p.key] = rec?.done ?? false;
    });
    setPillarsState(state);
    setInitialPillarsState(state);
    setSaveSuccess(false);
    setSaveError(null);
  }, [selectedDay, weekOffset, weekNutrition]);

  // fetch today's meals once
  React.useEffect(() => {
    fetch('/api/meals/today')
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(data => { setMeals(data); setMealsError(null); })
      .catch(err => setMealsError(err.toString()))
      .finally(() => setMealsLoading(false));
  }, []);

  const togglePillar = (key) => {
    setPillarsState(prev => ({ ...prev, [key]: !prev[key] }));
    setSaveSuccess(false);
  };

  const hasChanges = NUTRITION_PILLARS.some(p => pillarsState[p.key] !== initialPillarsState[p.key]);

  const getDayDoneCount = (fullDate) =>
    weekNutrition.filter(n => n.date === fullDate && n.done).length;

  const saveNutrition = async () => {
    const sel = weekData[selectedDay] || {};
    if (!sel.fullDate) return;
    setSaving(true);
    setSaveError(null);
    const pillars = NUTRITION_PILLARS.map(p => ({ key: p.key, name: p.name, done: pillarsState[p.key] ?? false }));
    try {
      const res = await fetch('/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: sel.fullDate, pillars }),
      });
      if (!res.ok) throw new Error((await res.json()).error || res.statusText);
      setInitialPillarsState({ ...pillarsState });
      setSaveSuccess(true);
      setWeekNutrition(prev => [
        ...prev.filter(n => n.date !== sel.fullDate),
        ...pillars.map(p => ({ date: sel.fullDate, pillar: p.key, pillar_name: p.name, done: p.done })),
      ]);
    } catch (err) {
      setSaveError(String(err));
    }
    setSaving(false);
  };

  const addMeal = () => {
    if (!newMeal.items) return;
    fetch('/api/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newMeal.name, items: newMeal.items, cal: +newMeal.cal || 300, protein: +newMeal.p || 20, carbs: +newMeal.c || 40, fat: +newMeal.g || 8 }),
    })
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(() => fetch('/api/meals/today').then(r => r.json()))
      .then(data => { setMeals(data); setShowAdd(false); setNewMeal({ name: 'Cena', items: '', cal: '', p: '', c: '', g: '' }); })
      .catch(err => setMealsError(err.toString()));
  };

  const sel = weekData[selectedDay] || {};
  const donePillars = NUTRITION_PILLARS.filter(p => pillarsState[p.key]).length;
  const pm = m => m.protein ?? m.p ?? 0;
  const cm = m => m.carbs   ?? m.c ?? 0;
  const gm = m => m.fat     ?? m.g ?? 0;

  return (
    <div style={{ padding: '0 16px 20px' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Nutrición</div>

      {/* Week navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setWeekOffset(o => o - 1)} style={{ background: '#2a160c', border: '1px solid #2a1208', borderRadius: 10, width: 34, height: 34, cursor: 'pointer', color: '#f0dac8', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>‹</button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#f0dac8' }}>{weekLabel}</div>
        <button onClick={() => setWeekOffset(o => o + 1)} style={{ background: '#2a160c', border: '1px solid #2a1208', borderRadius: 10, width: 34, height: 34, cursor: 'pointer', color: '#f0dac8', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>›</button>
        {weekOffset !== 0 && (
          <button onClick={() => setWeekOffset(0)} style={{ background: 'rgba(212,80,26,0.15)', border: '1px solid rgba(212,80,26,0.3)', borderRadius: 10, padding: '6px 10px', cursor: 'pointer', color: '#d4501a', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>Hoy</button>
        )}
      </div>

      {weekError && (
        <div style={{ background: 'rgba(212,80,26,0.08)', border: '1px solid rgba(212,80,26,0.25)', borderRadius: 10, padding: '8px 14px', marginBottom: 12, fontSize: 11, color: '#e87a3c' }}>
          Sin conexión al backend
        </div>
      )}

      {/* 7-day row */}
      {loadingWeek ? (
        <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: '#5a3a22' }}>Cargando semana...</div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {weekData.map((d, i) => {
            const done     = getDayDoneCount(d.fullDate);
            const complete = done === NUTRITION_PILLARS.length;
            const partial  = done > 0 && !complete;
            return (
              <button key={i} onClick={() => setSelectedDay(i)} style={{
                flex: 1, background: selectedDay === i ? '#2a1808' : '#2a160c',
                border: `1px solid ${selectedDay === i ? (complete ? '#4caf50' : '#d4501a') : '#3a1808'}`,
                borderRadius: 12, padding: '8px 2px', cursor: 'pointer',
                outline: d.today ? '2px solid #d4501a' : 'none', outlineOffset: 2,
              }}>
                <div style={{ fontSize: 9, color: '#8a5a3a', textTransform: 'uppercase', marginBottom: 2 }}>{d.day}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: complete ? '#4caf50' : '#fff' }}>{d.date}</div>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: complete ? '#4caf50' : partial ? '#f0a060' : '#3a1808', margin: '4px auto 0' }} />
              </button>
            );
          })}
        </div>
      )}

      {/* Pillars card */}
      {!loadingWeek && (
        <div style={{ background: '#2a160c', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{sel.day} {sel.date}</div>
              <div style={{ fontSize: 12, color: '#8a5a3a' }}>Pilares de nutrición</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: donePillars === NUTRITION_PILLARS.length ? '#4caf50' : '#d4501a' }}>
                {donePillars}<span style={{ fontSize: 13, color: '#5a3a22', fontWeight: 400 }}>/{NUTRITION_PILLARS.length}</span>
              </div>
              <div style={{ fontSize: 10, color: '#5a3a22' }}>cumplidos</div>
            </div>
          </div>

          {NUTRITION_PILLARS.map(p => (
            <button key={p.key} onClick={() => togglePillar(p.key)} style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%',
              background: '#381e12',
              border: `1px solid ${pillarsState[p.key] ? p.color : '#3a1808'}`,
              borderRadius: 12, padding: '12px 14px', marginBottom: 8, cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: pillarsState[p.key] ? `${p.color}28` : '#2a1208', border: `2px solid ${pillarsState[p.key] ? p.color : '#5a3018'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={p.icon} size={16} color={pillarsState[p.key] ? p.color : '#5a3a22'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: pillarsState[p.key] ? p.color : '#fff' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: '#5a3a22' }}>{p.detail}</div>
              </div>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: pillarsState[p.key] ? p.color : '#2a1208', border: `2px solid ${pillarsState[p.key] ? p.color : '#5a3018'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {pillarsState[p.key] && <Icon name="check" size={12} color="#fff" />}
              </div>
            </button>
          ))}

          {hasChanges && (
            <>
              {saveError && (
                <div style={{ background: 'rgba(212,80,26,0.12)', border: '1px solid rgba(212,80,26,0.4)', borderRadius: 10, padding: '10px 14px', marginBottom: 10, fontSize: 12, color: '#e87a3c' }}>
                  Error: {saveError}
                </div>
              )}
              <button onClick={saveNutrition} disabled={saving} style={{ width: '100%', background: 'linear-gradient(135deg, #a03010, #d4501a)', border: 'none', borderRadius: 12, padding: 14, color: '#fff', fontSize: 15, fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', marginTop: 4, opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Guardando...' : '✓ Guardar nutrición del día'}
              </button>
            </>
          )}

          {saveSuccess && !hasChanges && (
            <div style={{ background: 'rgba(76,175,80,0.12)', border: '1px solid rgba(76,175,80,0.4)', borderRadius: 10, padding: '12px 14px', marginTop: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#4caf50' }}>✓ Guardado</div>
              <div style={{ fontSize: 11, color: '#5a8a5a', marginTop: 2 }}>{donePillars} de {NUTRITION_PILLARS.length} pilares cumplidos</div>
            </div>
          )}
        </div>
      )}

      {/* Meals section (today only) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: '#8a5a3a', letterSpacing: 2, textTransform: 'uppercase' }}>Comidas de hoy</div>
        <button onClick={() => setShowAdd(true)} style={{ background: 'rgba(212,80,26,0.15)', border: '1px solid rgba(212,80,26,0.3)', borderRadius: 10, padding: '5px 12px', cursor: 'pointer', color: '#d4501a', fontSize: 12, fontWeight: 700 }}>+ Agregar</button>
      </div>

      {mealsError && (
        <div style={{ background: 'rgba(212,80,26,0.08)', border: '1px solid rgba(212,80,26,0.25)', borderRadius: 10, padding: '8px 14px', marginBottom: 10, fontSize: 11, color: '#e87a3c' }}>
          Sin conexión al backend
        </div>
      )}

      {mealsLoading ? (
        <div style={{ textAlign: 'center', padding: 20, fontSize: 13, color: '#5a3a22' }}>Cargando comidas...</div>
      ) : meals.length === 0 ? (
        <div style={{ background: '#2a160c', borderRadius: 12, padding: '16px', textAlign: 'center', fontSize: 12, color: '#5a3a22', marginBottom: 8 }}>No hay comidas registradas hoy</div>
      ) : (
        meals.map((m, i) => (
          <div key={m.id || i} style={{ background: '#2a160c', borderRadius: 14, padding: '14px 16px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{m.name}</div>
                <div style={{ fontSize: 11, color: '#5a3a22' }}>{m.time} · {m.items}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#d4501a' }}>{m.cal}</div>
                <div style={{ fontSize: 9, color: '#5a3a22' }}>kcal</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ l: 'P', v: pm(m), col: '#e87a3c' }, { l: 'C', v: cm(m), col: '#f0a060' }, { l: 'G', v: gm(m), col: '#a060d4' }].map(mc => (
                <div key={mc.l} style={{ flex: 1, background: '#2a1208', borderRadius: 8, padding: '4px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: mc.col }}>{mc.v}g</div>
                  <div style={{ fontSize: 9, color: '#5a3a22' }}>{mc.l}</div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }} onClick={() => setShowAdd(false)}>
          <div style={{ background: '#2a160c', width: '100%', borderRadius: '20px 20px 0 0', padding: 24 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Nueva comida</div>
            {[
              { label: 'Comida',       key: 'name',  placeholder: 'Ej: Cena' },
              { label: 'Alimentos',    key: 'items', placeholder: 'Ej: Pasta + pollo + verduras' },
              { label: 'Calorías',     key: 'cal',   placeholder: '500' },
              { label: 'Proteína (g)', key: 'p',     placeholder: '40' },
              { label: 'Carbos (g)',   key: 'c',     placeholder: '70' },
              { label: 'Grasas (g)',   key: 'g',     placeholder: '12' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: '#8a5a3a', marginBottom: 4 }}>{f.label}</div>
                <input value={newMeal[f.key]} onChange={e => setNewMeal(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} style={{ width: '100%', background: '#2a1208', border: '1px solid #3a1808', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, boxSizing: 'border-box' }} />
              </div>
            ))}
            <button onClick={addMeal} style={{ width: '100%', background: 'linear-gradient(135deg, #d4501a, #e87a3c)', border: 'none', borderRadius: 12, padding: 14, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>
              Agregar comida
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── PROGRESS ─────────────────────────────────────────────────────────────────
export const ProgressScreen = () => {
  const [activeMetric, setActiveMetric] = React.useState('performance');

  const maxW = Math.max(...WEIGHT_DATA);
  const minW = Math.min(...WEIGHT_DATA);

  const achievements = [
    { label: '8 semanas seguidas entrenando', icon: 'fire', color: '#d4501a', unlocked: true },
    { label: 'Primer torneo del año', icon: 'trophy', color: '#f0c040', unlocked: true },
    { label: 'Pérdida de 2.5 kg', icon: 'target', color: '#4caf50', unlocked: true },
    { label: 'Servicio al 70% de efectividad', icon: 'zap', color: '#e87a3c', unlocked: false },
    { label: 'Top 10 del ranking club', icon: 'star', color: '#a060d4', unlocked: false },
  ];

  return (
    <div style={{ padding: '0 16px 20px' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Progreso</div>
      <div style={{ fontSize: 12, color: '#8a5a3a', marginBottom: 20 }}>Últimas 8 semanas</div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[{ id: 'performance', label: 'Rendimiento' }, { id: 'weight', label: 'Peso' }].map(m => (
          <button key={m.id} onClick={() => setActiveMetric(m.id)} style={{ flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', background: activeMetric === m.id ? 'rgba(212,80,26,0.2)' : '#2a160c', color: activeMetric === m.id ? '#d4501a' : '#8a5a3a', fontSize: 13, fontWeight: 700, cursor: 'pointer', borderBottom: activeMetric === m.id ? '2px solid #d4501a' : '2px solid transparent' }}>
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ background: '#2a160c', borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: 100, gap: 4 }}>
          {(activeMetric === 'weight' ? WEIGHT_DATA : PERFORMANCE_DATA).map((val, i) => {
            const data = activeMetric === 'weight' ? WEIGHT_DATA : PERFORMANCE_DATA;
            const mn = Math.min(...data); const mx = Math.max(...data);
            const pct = (val - mn) / (mx - mn + 0.01);
            const h = 20 + pct * 70;
            const isLast = i === data.length - 1;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 9, color: isLast ? '#d4501a' : 'transparent', fontWeight: 700 }}>{val}{activeMetric === 'weight' ? 'kg' : '%'}</div>
                <div style={{ width: '100%', height: h, background: isLast ? 'linear-gradient(180deg, #d4501a, #8a2a0a)' : '#2a1808', borderRadius: '4px 4px 0 0', transition: 'height 0.6s ease' }} />
                <div style={{ fontSize: 9, color: '#5a3a22' }}>{PROGRESS_WEEKS[i]}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, color: '#8a5a3a' }}>
            {activeMetric === 'weight' ? `↓ ${(maxW - minW).toFixed(1)} kg en 8 semanas` : `↑ ${PERFORMANCE_DATA[7] - PERFORMANCE_DATA[0]}% de mejora`}
          </div>
          <div style={{ fontSize: 11, color: '#4caf50', fontWeight: 700 }}>↑ Progresando</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Sesiones', value: '31', sub: 'en 8 sem.', color: '#d4501a' },
          { label: 'Torneos', value: '2', sub: 'jugados', color: '#f0c040' },
          { label: 'Streak', value: '12', sub: 'días seguidos', color: '#4caf50' },
        ].map(s => (
          <div key={s.label} style={{ background: '#2a160c', borderRadius: 14, padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: '#5a3a22' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12, color: '#8a5a3a', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Logros</div>
      {achievements.map((a, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#2a160c', borderRadius: 12, padding: '12px 14px', marginBottom: 8, opacity: a.unlocked ? 1 : 0.4 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${a.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name={a.icon} size={18} color={a.color} />
          </div>
          <div style={{ flex: 1, fontSize: 13, color: a.unlocked ? '#f0dac8' : '#5a3a22', fontWeight: a.unlocked ? 600 : 400 }}>{a.label}</div>
          {a.unlocked && <Icon name="check" size={16} color="#4caf50" />}
        </div>
      ))}
    </div>
  );
};

// ─── AI COACH ─────────────────────────────────────────────────────────────────
export const AIScreen = () => {
  const [messages, setMessages] = React.useState([
    { role: 'assistant', text: '¡Hola Mira! Soy tu coach IA. Analizando tu semana: tenés un torneo mañana, llevás 3 días de carga moderada y tu sueño promedio fue de 7.5h. ¿Qué querés trabajar hoy?' }
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [activeCard, setActiveCard] = React.useState(null);

  const suggestions = [
    { icon: 'target', label: '¿Cómo preparo el torneo de mañana?', color: '#f0c040' },
    { icon: 'fire', label: '¿Debería entrenar hoy en cancha?', color: '#d4501a' },
    { icon: 'utensils', label: '¿Qué como antes del torneo?', color: '#e87a3c' },
    { icon: 'moon', label: '¿Cuánto debo descansar?', color: '#a060d4' },
  ];

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = res.ok ? await res.json() : null;
      setMessages(prev => [...prev, { role: 'assistant', text: data?.reply || 'No pude conectarme ahora. Intentá de nuevo.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'No pude conectarme ahora. Intentá de nuevo.' }]);
    }
    setLoading(false);
  };

  const recCards = [
    { title: 'Preparación Torneo', icon: 'trophy', color: '#f0c040', detail: 'Sesión ligera hoy máx 45min. Mucho estiramiento. Cena con carbos. Dormí 8h+. Llegá 30min antes al club.' },
    { title: 'Recuperación', icon: 'moon', color: '#a060d4', detail: 'Después de Jue al 9/10 de RPE, hoy es ideal para trabajo técnico suave, no físico intenso.' },
    { title: 'Nutrición Pre-Torneo', icon: 'utensils', color: '#e87a3c', detail: 'Cena: pasta + pollo. Mañana: tostadas + miel 2h antes. Isotónico durante el partido.' },
  ];

  return (
    <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Coach IA</div>
      <div style={{ fontSize: 12, color: '#8a5a3a', marginBottom: 16 }}>Recomendaciones inteligentes</div>

      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginBottom: 16, paddingBottom: 4, scrollbarWidth: 'none' }}>
        {recCards.map((c, i) => (
          <div key={i} onClick={() => setActiveCard(activeCard === i ? null : i)} style={{ flex: '0 0 160px', background: activeCard === i ? '#2a1208' : '#2a160c', border: `1px solid ${activeCard === i ? c.color : '#2a1208'}`, borderRadius: 14, padding: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
            <Icon name={c.icon} size={20} color={c.color} />
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', margin: '8px 0 4px' }}>{c.title}</div>
            {activeCard === i && <div style={{ fontSize: 11, color: '#a07050', lineHeight: 1.5 }}>{c.detail}</div>}
            {activeCard !== i && <div style={{ fontSize: 10, color: '#5a3a22' }}>Tap para ver →</div>}
          </div>
        ))}
      </div>

      <div style={{ background: '#2a160c', borderRadius: 16, padding: 12, marginBottom: 12, flex: 1, minHeight: 220, maxHeight: 280, overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
            {m.role === 'assistant' && (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#d4501a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: 8, marginTop: 2 }}>
                <Icon name="brain" size={14} color="#fff" />
              </div>
            )}
            <div style={{ maxWidth: '75%', background: m.role === 'user' ? 'linear-gradient(135deg, #d4501a, #e87a3c)' : '#2a1208', borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', padding: '10px 12px' }}>
              <div style={{ fontSize: 13, color: '#f0dac8', lineHeight: 1.5 }}>{m.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 4, padding: 8 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#d4501a' }} />)}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 10, scrollbarWidth: 'none' }}>
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => sendMessage(s.label)} style={{ flex: '0 0 auto', background: '#2a160c', border: `1px solid ${s.color}20`, borderRadius: 20, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name={s.icon} size={12} color={s.color} />
            <span style={{ fontSize: 11, color: '#a07050', whiteSpace: 'nowrap' }}>{s.label}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Preguntale a tu coach..." style={{ flex: 1, background: '#2a160c', border: '1px solid #3a1808', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14 }} />
        <button onClick={() => sendMessage(input)} style={{ background: 'linear-gradient(135deg, #d4501a, #e87a3c)', border: 'none', borderRadius: 12, padding: '0 16px', cursor: 'pointer' }}>
          <Icon name="bolt" size={18} color="#fff" />
        </button>
      </div>
    </div>
  );
};
