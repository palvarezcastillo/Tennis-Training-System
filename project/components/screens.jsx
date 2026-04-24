
// All screens for the Tennis Training App

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

const MEAL_DATA = [
  { name: "Desayuno", time: "08:00", items: "Avena + banana + whey protein", cal: 480, p: 35, c: 62, g: 8 },
  { name: "Almuerzo", time: "13:00", items: "Arroz integral + pollo + ensalada", cal: 620, p: 48, c: 74, g: 11 },
  { name: "Pre-entreno", time: "16:30", items: "Tostadas + mantequilla de maní", cal: 320, p: 12, c: 36, g: 14 },
];

const PROGRESS_WEEKS = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
const WEIGHT_DATA = [84.2, 83.8, 83.5, 83.1, 82.9, 82.4, 82.0, 81.7];
const PERFORMANCE_DATA = [62, 65, 64, 68, 70, 73, 75, 78];

// ─── SPLASH SCREEN ─────────────────────────────────────────────────────────────
const SplashScreen = ({ onEnter }) => {
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
      position: 'fixed', inset: 0, background: 'linear-gradient(160deg, #0d0805 0%, #1a0c05 50%, #2a1005 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, opacity: out ? 0 : 1, transition: 'opacity 0.6s ease', padding: '32px 24px',
    }}>
      {/* Clay texture lines */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.06 }}>
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: `${i * 8.5}%`, width: 1, background: '#d4501a' }} />
        ))}
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: `${i * 5.3}%`, height: 1, background: '#d4501a' }} />
        ))}
      </div>

      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease', textAlign: 'center', maxWidth: 360 }}>
        {/* Logo */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 8 }}>
          <TennisPlayer size={110} color="#d4501a" />
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 80, height: 3, background: 'linear-gradient(90deg, transparent, #d4501a, transparent)', borderRadius: 2 }} />
        </div>

        <div style={{ marginBottom: 4 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>MIRA</span>
          <span style={{ fontSize: 28, fontWeight: 300, color: '#d4501a', letterSpacing: 2, marginLeft: 8 }}>TENNIS</span>
        </div>
        <div style={{ fontSize: 11, color: '#8a5a3a', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 40 }}>Training System</div>

        {/* Quote */}
        <div style={{ background: 'rgba(212,80,26,0.08)', border: '1px solid rgba(212,80,26,0.2)', borderRadius: 16, padding: '20px 24px', marginBottom: 40 }}>
          <div style={{ fontSize: 15, color: '#f0dac8', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 8, textWrap: 'pretty' }}>"{quote.text}"</div>
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
const DashboardScreen = ({ setScreen }) => {
  const todayEntry = WEEK_DATA.find(d => d.today);
  const totalCal = MEAL_DATA.reduce((s, m) => s + m.cal, 0);
  const totalP = MEAL_DATA.reduce((s, m) => s + m.p, 0);

  const metrics = [
    { label: "Peso", value: "81.7", unit: "kg", icon: "target", color: "#e87a3c", ring: 81.7, max: 90 },
    { label: "Calorías", value: totalCal, unit: "kcal", icon: "fire", color: "#d4501a", ring: totalCal, max: 2800 },
    { label: "Proteína", value: totalP, unit: "g", icon: "bolt", color: "#f0a060", ring: totalP, max: 180 },
    { label: "Sueño", value: "7.5", unit: "h", icon: "moon", color: "#a060d4", ring: 7.5, max: 9 },
    { label: "FC Reposo", value: "58", unit: "bpm", icon: "heart", color: "#e04060", ring: 58, max: 80 },
    { label: "Agua", value: "2.1", unit: "L", icon: "drop", color: "#40a0d4", ring: 2.1, max: 3 },
  ];

  return (
    <div style={{ padding: '0 16px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 12, color: '#8a5a3a', letterSpacing: 1, textTransform: 'uppercase' }}>Viernes 24 Abril</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>¡Hola, Mira! 👋</div>
          <div style={{ fontSize: 13, color: '#d4501a' }}>Hoy: Entrenamiento en Cancha</div>
        </div>
        <TennisPlayer size={60} color="#d4501a" opacity={0.9} />
      </div>

      {/* Next tournament banner */}
      <div style={{ background: 'linear-gradient(135deg, #3a2008, #2a1208)', border: '1px solid #f0c040', borderRadius: 14, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="trophy" size={22} color="#f0c040" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: '#f0c040', textTransform: 'uppercase', letterSpacing: 1 }}>Próximo Torneo</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Club Tenis Palermo — Sábado 25 Abr</div>
        </div>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#f0c040' }}>1</div>
        <div style={{ fontSize: 10, color: '#a07030' }}>día</div>
      </div>

      {/* Metrics grid */}
      <div style={{ fontSize: 12, color: '#8a5a3a', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Métricas del día</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ background: '#1a0c05', borderRadius: 14, padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
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

      {/* RPE / Intensidad */}
      <div style={{ background: '#1a0c05', borderRadius: 14, padding: '14px 16px', marginBottom: 14 }}>
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

      {/* Quick shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button onClick={() => setScreen('food')} style={{ background: '#1a0c05', border: '1px solid #3a1808', borderRadius: 14, padding: '14px', cursor: 'pointer', textAlign: 'left' }}>
          <Icon name="utensils" size={20} color="#e87a3c" />
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginTop: 8 }}>Registrar comida</div>
          <div style={{ fontSize: 11, color: '#8a5a3a' }}>{totalCal} / 2800 kcal</div>
          <MiniBar value={totalCal} max={2800} color="#e87a3c" />
        </button>
        <button onClick={() => setScreen('training')} style={{ background: '#1a0c05', border: '1px solid #3a1808', borderRadius: 14, padding: '14px', cursor: 'pointer', textAlign: 'left' }}>
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
const CalendarScreen = () => {
  const [selectedDay, setSelectedDay] = React.useState(4);
  const [planModal, setPlanModal] = React.useState(false);

  const upcoming = [
    { date: "25 Abr", event: "Torneo Club Palermo", type: "tournament", level: "A2" },
    { date: "3 May", event: "Liga Amateur Zona Norte", type: "tournament", level: "B1" },
    { date: "10 May", event: "Torneo Ranking AATT", type: "tournament", level: "A1" },
  ];

  return (
    <div style={{ padding: '0 16px 20px' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Calendario</div>
      <div style={{ fontSize: 13, color: '#8a5a3a', marginBottom: 20 }}>Semana del 20 al 26 de Abril</div>

      {/* Week strip */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {WEEK_DATA.map((d, i) => (
          <button key={i} onClick={() => setSelectedDay(i)} style={{
            flex: 1, background: selectedDay === i ? (d.today ? '#d4501a' : '#2a1808') : '#1a0c05',
            border: `1px solid ${selectedDay === i ? TYPE_COLOR[d.type] : '#2a1208'}`,
            borderRadius: 12, padding: '8px 4px', cursor: 'pointer',
            outline: d.today ? '2px solid #d4501a' : 'none', outlineOffset: 2,
          }}>
            <div style={{ fontSize: 9, color: '#8a5a3a', textTransform: 'uppercase', marginBottom: 2 }}>{d.day}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{d.date}</div>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: TYPE_COLOR[d.type], margin: '4px auto 0' }} />
          </button>
        ))}
      </div>

      {/* Selected day detail */}
      <div style={{ background: '#1a0c05', borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>
              {WEEK_DATA[selectedDay].day} {WEEK_DATA[selectedDay].date} Abr
            </div>
            <div style={{ fontSize: 12, color: TYPE_COLOR[WEEK_DATA[selectedDay].type] }}>
              {WEEK_DATA[selectedDay].label}
              {WEEK_DATA[selectedDay].today && ' • HOY'}
            </div>
          </div>
          <button onClick={() => setPlanModal(true)} style={{ background: 'rgba(212,80,26,0.15)', border: '1px solid rgba(212,80,26,0.3)', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', color: '#d4501a', fontSize: 12, fontWeight: 600 }}>
            + Planificar
          </button>
        </div>

        {WEEK_DATA[selectedDay].type === 'tennis' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Calentamiento 20min', 'Peloteo de fondo 30min', 'Trabajo de volea 20min', 'Saque y resto 15min', 'Partido de práctica'].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #2a1208' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: WEEK_DATA[selectedDay].done ? '#d4501a' : '#2a1808', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {WEEK_DATA[selectedDay].done && <Icon name="check" size={11} color="#fff" />}
                </div>
                <div style={{ fontSize: 13, color: WEEK_DATA[selectedDay].done ? '#a07050' : '#f0dac8' }}>{t}</div>
              </div>
            ))}
          </div>
        )}
        {WEEK_DATA[selectedDay].type === 'gym' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Sentadillas 4x8 80kg', 'Press banca 3x10 70kg', 'Peso muerto 3x6 100kg', 'Trabajo de core 20min', 'Estiramiento 10min'].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #2a1208' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: WEEK_DATA[selectedDay].done ? '#e87a3c' : '#2a1808', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {WEEK_DATA[selectedDay].done && <Icon name="check" size={11} color="#fff" />}
                </div>
                <div style={{ fontSize: 13, color: WEEK_DATA[selectedDay].done ? '#a07050' : '#f0dac8' }}>{t}</div>
              </div>
            ))}
          </div>
        )}
        {WEEK_DATA[selectedDay].type === 'tournament' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <Icon name="trophy" size={40} color="#f0c040" />
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginTop: 8 }}>Club Tenis Palermo</div>
            <div style={{ fontSize: 12, color: '#f0c040', marginTop: 4 }}>Categoría A2 · Singles</div>
            <div style={{ fontSize: 12, color: '#8a5a3a', marginTop: 4 }}>09:00 hs · Cancha 3</div>
          </div>
        )}
        {WEEK_DATA[selectedDay].type === 'rest' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <Icon name="moon" size={36} color="#a060d4" />
            <div style={{ fontSize: 14, color: '#f0dac8', marginTop: 8 }}>Día de recuperación activa</div>
            <div style={{ fontSize: 12, color: '#8a5a3a' }}>Caminata suave · Stretching · Hidratación</div>
          </div>
        )}
      </div>

      {/* Upcoming tournaments */}
      <div style={{ fontSize: 12, color: '#8a5a3a', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Torneos Próximos</div>
      {upcoming.map((ev, i) => (
        <div key={i} style={{ background: '#1a0c05', borderRadius: 12, padding: '12px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, borderLeft: '3px solid #f0c040' }}>
          <Icon name="trophy" size={18} color="#f0c040" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{ev.event}</div>
            <div style={{ fontSize: 11, color: '#8a5a3a' }}>{ev.date} · Cat. {ev.level}</div>
          </div>
          <Icon name="chevronRight" size={16} color="#5a3a22" />
        </div>
      ))}

      {planModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }} onClick={() => setPlanModal(false)}>
          <div style={{ background: '#1a0c05', width: '100%', borderRadius: '20px 20px 0 0', padding: 24 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Planificar día</div>
            {['Entrenamiento Tenis', 'Entrenamiento Gym', 'Descanso', 'Torneo'].map(op => (
              <button key={op} onClick={() => setPlanModal(false)} style={{ display: 'block', width: '100%', background: '#2a1208', border: 'none', borderRadius: 10, padding: '14px 16px', marginBottom: 8, color: '#f0dac8', fontSize: 14, textAlign: 'left', cursor: 'pointer' }}>{op}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── TRAINING ─────────────────────────────────────────────────────────────────
const TrainingScreen = () => {
  const [tab, setTab] = React.useState('tennis');
  const [rpe, setRpe] = React.useState(7);
  const [checkedItems, setCheckedItems] = React.useState({});

  const toggleCheck = (key) => setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));

  const tennisWork = [
    { key: 't1', label: 'Calentamiento', duration: '20min', detail: 'Trote + movilidad articular', done: false },
    { key: 't2', label: 'Peloteo de fondo', duration: '30min', detail: 'Cruzado FH/BH — consistencia', done: false },
    { key: 't3', label: 'Volea y red', duration: '20min', detail: 'Aproximaciones + voleas de definición', done: false },
    { key: 't4', label: 'Saque', duration: '15min', detail: '60 saques: plano, slice, kick', done: false },
    { key: 't5', label: 'Partido de práctica', duration: '30min', detail: 'Sets a 6 games — partido real', done: false },
  ];

  const shotTypes = [
    { label: 'FH Cruzado', pct: 85 },
    { label: 'BH Cruzado', pct: 72 },
    { label: 'Saque Plano', pct: 68 },
    { label: 'Volea', pct: 55 },
    { label: 'Resto', pct: 63 },
  ];

  const gymExercises = [
    { key: 'g1', name: 'Sentadillas', sets: '4x8', weight: '80 kg', muscle: 'Piernas' },
    { key: 'g2', name: 'Press Banca', sets: '3x10', weight: '70 kg', muscle: 'Pecho' },
    { key: 'g3', name: 'Peso Muerto', sets: '3x6', weight: '100 kg', muscle: 'Posterior' },
    { key: 'g4', name: 'Remo con Barra', sets: '3x10', weight: '60 kg', muscle: 'Espalda' },
    { key: 'g5', name: 'Rotación con Cable', sets: '3x15', weight: '20 kg', muscle: 'Core/Tenis' },
    { key: 'g6', name: 'Plancha', sets: '3x60s', weight: 'Peso corporal', muscle: 'Core' },
  ];

  return (
    <div style={{ padding: '0 16px 20px' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Entrenamiento</div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: '#1a0c05', borderRadius: 12, padding: 4, marginBottom: 20, gap: 4 }}>
        {[{ id: 'tennis', label: '🎾 Tenis' }, { id: 'gym', label: '🏋️ Gym' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
            background: tab === t.id ? 'linear-gradient(135deg, #d4501a, #e87a3c)' : 'transparent',
            color: tab === t.id ? '#fff' : '#8a5a3a', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'tennis' && (
        <>
          {/* Checklist */}
          <div style={{ fontSize: 12, color: '#8a5a3a', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Plan de sesión</div>
          {tennisWork.map(item => (
            <button key={item.key} onClick={() => toggleCheck(item.key)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: '#1a0c05', border: `1px solid ${checkedItems[item.key] ? '#d4501a' : '#2a1208'}`, borderRadius: 12, padding: '12px 14px', marginBottom: 8, cursor: 'pointer', textAlign: 'left' }}>
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

          {/* Shot quality */}
          <div style={{ fontSize: 12, color: '#8a5a3a', letterSpacing: 2, textTransform: 'uppercase', margin: '16px 0 10px' }}>Calidad de golpes</div>
          <div style={{ background: '#1a0c05', borderRadius: 14, padding: 14 }}>
            {shotTypes.map(s => (
              <div key={s.label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ fontSize: 12, color: '#f0dac8' }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: '#d4501a', fontWeight: 700 }}>{s.pct}%</div>
                </div>
                <MiniBar value={s.pct} max={100} color={s.pct >= 75 ? '#4caf50' : s.pct >= 55 ? '#e87a3c' : '#d44040'} />
              </div>
            ))}
          </div>

          {/* RPE */}
          <div style={{ background: '#1a0c05', borderRadius: 14, padding: 14, marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Intensidad percibida (RPE)</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#d4501a' }}>{rpe}/10</div>
            </div>
            <input type="range" min={1} max={10} value={rpe} onChange={e => setRpe(Number(e.target.value))} style={{ width: '100%', accentColor: '#d4501a' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#5a3a22', marginTop: 4 }}>
              <span>Muy fácil</span><span>Moderado</span><span>Máximo</span>
            </div>
          </div>
        </>
      )}

      {tab === 'gym' && (
        <>
          <div style={{ fontSize: 12, color: '#8a5a3a', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Rutina del día — Fuerza</div>
          {gymExercises.map(ex => (
            <button key={ex.key} onClick={() => toggleCheck(ex.key)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: '#1a0c05', border: `1px solid ${checkedItems[ex.key] ? '#e87a3c' : '#2a1208'}`, borderRadius: 12, padding: '12px 14px', marginBottom: 8, cursor: 'pointer', textAlign: 'left' }}>
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
          <div style={{ background: '#1a0c05', borderRadius: 14, padding: 14, marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Intensidad (RPE)</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#e87a3c' }}>{rpe}/10</div>
            </div>
            <input type="range" min={1} max={10} value={rpe} onChange={e => setRpe(Number(e.target.value))} style={{ width: '100%', accentColor: '#e87a3c' }} />
          </div>
        </>
      )}
    </div>
  );
};

// ─── FOOD ─────────────────────────────────────────────────────────────────────
const FoodScreen = () => {
  const [meals, setMeals] = React.useState(MEAL_DATA);
  const [showAdd, setShowAdd] = React.useState(false);
  const [newMeal, setNewMeal] = React.useState({ name: 'Merienda', items: '', cal: '', p: '', c: '', g: '' });

  const total = { cal: meals.reduce((s,m) => s+m.cal, 0), p: meals.reduce((s,m) => s+m.p, 0), c: meals.reduce((s,m) => s+m.c, 0), g: meals.reduce((s,m) => s+m.g, 0) };
  const targets = { cal: 2800, p: 180, c: 320, g: 80 };

  const addMeal = () => {
    if (!newMeal.items) return;
    setMeals(prev => [...prev, { ...newMeal, cal: +newMeal.cal || 300, p: +newMeal.p || 20, c: +newMeal.c || 40, g: +newMeal.g || 8, time: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }) }]);
    setShowAdd(false);
    setNewMeal({ name: 'Cena', items: '', cal: '', p: '', c: '', g: '' });
  };

  return (
    <div style={{ padding: '0 16px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>Nutrición</div>
          <div style={{ fontSize: 12, color: '#8a5a3a' }}>Viernes 24 Abril</div>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ background: 'linear-gradient(135deg, #d4501a, #e87a3c)', border: 'none', borderRadius: 12, padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: 13, fontWeight: 700 }}>
          <Icon name="plus" size={16} color="#fff" /> Agregar
        </button>
      </div>

      {/* Macro rings */}
      <div style={{ background: '#1a0c05', borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {[
            { label: 'Calorías', val: total.cal, max: targets.cal, unit: 'kcal', color: '#d4501a' },
            { label: 'Proteína', val: total.p, max: targets.p, unit: 'g', color: '#e87a3c' },
            { label: 'Carbs', val: total.c, max: targets.c, unit: 'g', color: '#f0a060' },
            { label: 'Grasas', val: total.g, max: targets.g, unit: 'g', color: '#a060d4' },
          ].map(m => (
            <div key={m.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ position: 'relative' }}>
                <RingChart value={m.val} max={m.max} color={m.color} size={64} strokeWidth={6}>
                  <text x="32" y="36" textAnchor="middle" style={{ fill: '#fff', fontSize: 11, fontWeight: 800 }}>{Math.round((m.val/m.max)*100)}%</text>
                </RingChart>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: m.color }}>{m.val}<span style={{ fontSize: 9, color: '#5a3a22' }}>{m.unit}</span></div>
              <div style={{ fontSize: 10, color: '#5a3a22' }}>{m.label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: '#8a5a3a', textAlign: 'center' }}>
          Faltan {targets.cal - total.cal} kcal para tu objetivo diario
        </div>
      </div>

      {/* Meals */}
      <div style={{ fontSize: 12, color: '#8a5a3a', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Comidas del día</div>
      {meals.map((m, i) => (
        <div key={i} style={{ background: '#1a0c05', borderRadius: 14, padding: '14px 16px', marginBottom: 10 }}>
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
            {[{ l: 'P', v: m.p, c: '#e87a3c' }, { l: 'C', v: m.c, c: '#f0a060' }, { l: 'G', v: m.g, c: '#a060d4' }].map(mc => (
              <div key={mc.l} style={{ flex: 1, background: '#2a1208', borderRadius: 8, padding: '4px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: mc.c }}>{mc.v}g</div>
                <div style={{ fontSize: 9, color: '#5a3a22' }}>{mc.l}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Pre-tournament tip */}
      <div style={{ background: 'rgba(240,192,64,0.08)', border: '1px solid rgba(240,192,64,0.2)', borderRadius: 14, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Icon name="trophy" size={18} color="#f0c040" />
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#f0c040', marginBottom: 2 }}>Torneo mañana</div>
          <div style={{ fontSize: 11, color: '#a07030', textWrap: 'pretty' }}>Asegurate de cargar bien carbohidratos en la cena de hoy. Hidratación óptima: 2.5–3L de agua.</div>
        </div>
      </div>

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }} onClick={() => setShowAdd(false)}>
          <div style={{ background: '#1a0c05', width: '100%', borderRadius: '20px 20px 0 0', padding: 24 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Nueva comida</div>
            {[
              { label: 'Comida', key: 'name', placeholder: 'Ej: Cena' },
              { label: 'Alimentos', key: 'items', placeholder: 'Ej: Pasta + pollo + verduras' },
              { label: 'Calorías', key: 'cal', placeholder: '500' },
              { label: 'Proteína (g)', key: 'p', placeholder: '40' },
              { label: 'Carbos (g)', key: 'c', placeholder: '70' },
              { label: 'Grasas (g)', key: 'g', placeholder: '12' },
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
const ProgressScreen = () => {
  const [activeMetric, setActiveMetric] = React.useState('performance');

  const maxW = Math.max(...WEIGHT_DATA);
  const minW = Math.min(...WEIGHT_DATA);
  const maxP = Math.max(...PERFORMANCE_DATA);

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

      {/* Metric selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[{ id: 'performance', label: 'Rendimiento' }, { id: 'weight', label: 'Peso' }].map(m => (
          <button key={m.id} onClick={() => setActiveMetric(m.id)} style={{ flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', background: activeMetric === m.id ? 'rgba(212,80,26,0.2)' : '#1a0c05', color: activeMetric === m.id ? '#d4501a' : '#8a5a3a', fontSize: 13, fontWeight: 700, cursor: 'pointer', borderBottom: activeMetric === m.id ? '2px solid #d4501a' : '2px solid transparent' }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: '#1a0c05', borderRadius: 16, padding: 16, marginBottom: 16 }}>
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

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Sesiones', value: '31', sub: 'en 8 sem.', color: '#d4501a' },
          { label: 'Torneos', value: '2', sub: 'jugados', color: '#f0c040' },
          { label: 'Streak', value: '12', sub: 'días seguidos', color: '#4caf50' },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a0c05', borderRadius: 14, padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: '#5a3a22' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div style={{ fontSize: 12, color: '#8a5a3a', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Logros</div>
      {achievements.map((a, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#1a0c05', borderRadius: 12, padding: '12px 14px', marginBottom: 8, opacity: a.unlocked ? 1 : 0.4 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `rgba(${a.color === '#d4501a' ? '212,80,26' : a.color === '#f0c040' ? '240,192,64' : a.color === '#4caf50' ? '76,175,80' : a.color === '#e87a3c' ? '232,122,60' : '160,96,212'},0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
const AIScreen = () => {
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
    const userMsg = text;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);
    try {
      const context = `Eres un coach de tenis y nutrición experto. El atleta es Mira, nivel Competitivo-Amateur, juega 2 días de tenis y 2 días de gym por semana, tiene un torneo mañana (25 Abril). Hoy es Viernes. Esta semana entrenó: Lun Gym RPE8, Mar Tenis RPE7, Mié Descanso, Jue Gym RPE9. Peso actual: 81.7kg. Sueño promedio: 7.5h. Calorías hoy: 1420/2800kcal. Responde en español rioplatense, de manera directa y motivante, máx 3 oraciones.`;
      const reply = await window.claude.complete({ messages: [{ role: 'user', content: context + '\n\nPregunta del atleta: ' + userMsg }] });
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (e) {
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

      {/* Rec cards */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginBottom: 16, paddingBottom: 4, scrollbarWidth: 'none' }}>
        {recCards.map((c, i) => (
          <div key={i} onClick={() => setActiveCard(activeCard === i ? null : i)} style={{ flex: '0 0 160px', background: activeCard === i ? '#2a1208' : '#1a0c05', border: `1px solid ${activeCard === i ? c.color : '#2a1208'}`, borderRadius: 14, padding: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
            <Icon name={c.icon} size={20} color={c.color} />
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', margin: '8px 0 4px' }}>{c.title}</div>
            {activeCard === i && <div style={{ fontSize: 11, color: '#a07050', lineHeight: 1.5, textWrap: 'pretty' }}>{c.detail}</div>}
            {activeCard !== i && <div style={{ fontSize: 10, color: '#5a3a22' }}>Tap para ver →</div>}
          </div>
        ))}
      </div>

      {/* Chat */}
      <div style={{ background: '#1a0c05', borderRadius: 16, padding: 12, marginBottom: 12, flex: 1, minHeight: 220, maxHeight: 280, overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
            {m.role === 'assistant' && (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#d4501a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: 8, marginTop: 2 }}>
                <Icon name="brain" size={14} color="#fff" />
              </div>
            )}
            <div style={{ maxWidth: '75%', background: m.role === 'user' ? 'linear-gradient(135deg, #d4501a, #e87a3c)' : '#2a1208', borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', padding: '10px 12px' }}>
              <div style={{ fontSize: 13, color: '#f0dac8', lineHeight: 1.5, textWrap: 'pretty' }}>{m.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 4, padding: 8 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#d4501a', animation: `pulse ${0.6 + i * 0.2}s infinite alternate` }} />)}
          </div>
        )}
      </div>

      {/* Quick suggestions */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 10, scrollbarWidth: 'none' }}>
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => sendMessage(s.label)} style={{ flex: '0 0 auto', background: '#1a0c05', border: `1px solid ${s.color}20`, borderRadius: 20, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name={s.icon} size={12} color={s.color} />
            <span style={{ fontSize: 11, color: '#a07050', whiteSpace: 'nowrap' }}>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Preguntale a tu coach..." style={{ flex: 1, background: '#1a0c05', border: '1px solid #3a1808', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14 }} />
        <button onClick={() => sendMessage(input)} style={{ background: 'linear-gradient(135deg, #d4501a, #e87a3c)', border: 'none', borderRadius: 12, padding: '0 16px', cursor: 'pointer' }}>
          <Icon name="bolt" size={18} color="#fff" />
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { SplashScreen, DashboardScreen, CalendarScreen, TrainingScreen, FoodScreen, ProgressScreen, AIScreen });
