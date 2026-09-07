// Test del helper de fechas. Correr con: node lib/appDate.test.js
// Simula el servidor en UTC (como Vercel) y verifica que el calendario que
// devuelve sea el de Argentina, que es el bug que estamos arreglando.
process.env.TZ = 'UTC';

const { today, addDays, dayOfWeek, mondayOf, nowTime, APP_TZ } = require('./appDate');

let fallas = 0;
const check = (nombre, actual, esperado) => {
  const ok = actual === esperado;
  if (!ok) fallas += 1;
  console.log(`${ok ? 'OK  ' : 'FALLA'}  ${nombre}: ${actual}${ok ? '' : `  (esperado ${esperado})`}`);
};

console.log(`APP_TZ = ${APP_TZ}`);
console.log(`Reloj del proceso  = ${new Date().toISOString()} (TZ=${process.env.TZ})`);
console.log(`today() del helper = ${today()}\n`);

// --- aritmética de calendario ---
check('addDays 31/8 +6 = domingo 6/9', addDays('2026-08-31', 6), '2026-09-06');
check('addDays 1/3 -1 cruza a febrero', addDays('2026-03-01', -1), '2026-02-28');
check('addDays 31/12 +1 cruza de año', addDays('2026-12-31', 1), '2027-01-01');
check('dayOfWeek 6/9/2026 = domingo (0)', String(dayOfWeek('2026-09-06')), '0');
check('dayOfWeek 31/8/2026 = lunes (1)', String(dayOfWeek('2026-08-31')), '1');

// --- el caso del bug: domingo a la noche ---
// El domingo 6/9 pertenece a la semana que arranca el lunes 31/8.
check('mondayOf(domingo 6/9) = 31/8', mondayOf('2026-09-06'), '2026-08-31');
check('mondayOf(lunes 31/8) = 31/8', mondayOf('2026-08-31'), '2026-08-31');
check('mondayOf(lunes 7/9) = 7/9', mondayOf('2026-09-07'), '2026-09-07');
check('mondayOf(domingo 6/9, offset -1) = 24/8', mondayOf('2026-09-06', -1), '2026-08-24');
check('mondayOf(domingo 6/9, offset +1) = 7/9', mondayOf('2026-09-06', 1), '2026-09-07');

// --- ventana de 8 semanas de progress.js ---
const inicio = addDays(mondayOf('2026-09-06'), -49);
check('ventana de 8 semanas arranca 13/7', inicio, '2026-07-13');
check('la 8va semana arranca 31/8', addDays(inicio, 7 * 7), '2026-08-31');

// --- hora en zona del usuario ---
console.log(`\nnowTime() = ${nowTime()} (hora de Argentina, no del servidor)`);

// --- las 4 sesiones reales del usuario caen en la semana actual? ---
const monStr = mondayOf(today());
const sunStr = addDays(monStr, 6);
const reales = ['2026-09-06', '2026-09-04', '2026-09-03', '2026-08-31', '2026-08-30'];
const enSemana = reales.filter((d) => d >= monStr && d <= sunStr);
console.log(`\nSemana que devolveria el backend AHORA: ${monStr} a ${sunStr}`);
console.log(`Sesiones reales que caen ahi: ${enSemana.length} -> ${enSemana.join(', ') || '(ninguna)'}`);

console.log(`\n${fallas === 0 ? 'TODOS LOS TESTS PASARON' : `${fallas} TEST(S) FALLARON`}`);
process.exit(fallas === 0 ? 0 : 1);
