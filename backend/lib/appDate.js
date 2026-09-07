// Fechas del calendario del usuario, no del reloj del servidor.
//
// Vercel corre las funciones en UTC. Como la app se usa en Argentina (UTC-3),
// entre las 21:00 y la medianoche el servidor ya está en el día siguiente: un
// domingo a las 23:40 el backend calculaba "esta semana" como la que arranca el
// lunes siguiente, y devolvía vacío aunque hubiera sesiones cargadas.
//
// Todo el cálculo de calendario del backend pasa por acá. Se trabaja con strings
// 'YYYY-MM-DD' a propósito: la columna `date` de Postgres es DATE (sin hora),
// así que un día es un día y no hay husos horarios de por medio.

const APP_TZ = process.env.APP_TIMEZONE || 'America/Argentina/Buenos_Aires';

// 'YYYY-MM-DD' de hoy en APP_TZ. formatToParts para no depender del locale.
const today = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: APP_TZ, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
};

// Los helpers de abajo hacen aritmética de calendario sobre el string, usando
// UTC como eje neutro para que no vuelva a entrar el huso del servidor.
const parse = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

const format = (dt) =>
  `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`;

const addDays = (dateStr, n) => {
  const dt = parse(dateStr);
  dt.setUTCDate(dt.getUTCDate() + n);
  return format(dt);
};

// 0 = domingo … 6 = sábado
const dayOfWeek = (dateStr) => parse(dateStr).getUTCDay();

// Lunes de la semana de `dateStr`. weekOffset corre semanas enteras (-1 = anterior).
const mondayOf = (dateStr, weekOffset = 0) => {
  const dow = dayOfWeek(dateStr);
  const shift = dow === 0 ? -6 : 1 - dow; // el domingo cierra la semana que arrancó 6 días antes
  return addDays(dateStr, shift + weekOffset * 7);
};

// 'HH:MM' de ahora en APP_TZ (default del campo `time` al cargar una comida).
const nowTime = () =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: APP_TZ, hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date());

module.exports = { APP_TZ, today, addDays, dayOfWeek, mondayOf, nowTime };
