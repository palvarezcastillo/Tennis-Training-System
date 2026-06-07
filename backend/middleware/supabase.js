require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;

// El backend media TODO el acceso a datos y ya filtra por user_id en cada ruta.
// Usa la SERVICE_ROLE key (secreta, solo backend) para poder operar con RLS
// estricto activado en la base. Si no está, cae a la ANON key con una
// advertencia (RLS estricto bloquearía las queries en ese caso).
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey    = process.env.SUPABASE_ANON_KEY;
const supabaseKey = serviceKey || anonKey;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[supabase] WARNING: SUPABASE_URL o la key no están seteadas — las rutas de DB fallarán hasta configurar el .env.');
} else if (!serviceKey) {
  console.warn('[supabase] WARNING: usando ANON key. Con RLS estricto las queries devolverán vacío. Configurá SUPABASE_SERVICE_ROLE_KEY.');
}

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

module.exports = supabase;
