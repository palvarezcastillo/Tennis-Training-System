-- ============================================================================
--  Asociación de datos por usuario (Google login) + RLS estricto
--  Correr en Supabase → SQL Editor. Es idempotente: se puede correr varias veces.
--
--  Contexto: todas las rutas del backend filtran por user_id. Estas tablas
--  necesitan la columna user_id ligada a auth.users. El backend usa la
--  SERVICE_ROLE key (bypassa RLS), así que el RLS estricto NO rompe la app y
--  además protege contra acceso directo con la anon key.
--
--  Tablas afectadas: sessions, session_details, tournaments, nutrition,
--                    meals, daily_metrics, profile
-- ============================================================================


-- ─────────────────────────────────────────────────────────────────────────
--  PARTE 0 — DIAGNÓSTICO (solo lectura). Corré esto PRIMERO para entender el estado.
-- ─────────────────────────────────────────────────────────────────────────

-- 0.a) ¿Qué usuarios existen y cuál es tu UUID de Google?
--      Anotá el id de la fila con provider = 'google' y tu email.
-- select id, email,
--        raw_app_meta_data->>'provider' as provider,
--        created_at
-- from auth.users
-- order by created_at;

-- 0.b) ¿Cuántas filas quedaron huérfanas (sin user_id) por tabla?
-- select 'sessions'        as tabla, count(*) filter (where user_id is null) as huerfanas, count(*) as total from sessions
-- union all select 'session_details', count(*) filter (where user_id is null), count(*) from session_details
-- union all select 'tournaments',     count(*) filter (where user_id is null), count(*) from tournaments
-- union all select 'nutrition',       count(*) filter (where user_id is null), count(*) from nutrition
-- union all select 'meals',           count(*) filter (where user_id is null), count(*) from meals
-- union all select 'daily_metrics',   count(*) filter (where user_id is null), count(*) from daily_metrics
-- union all select 'profile',         count(*) filter (where user_id is null), count(*) from profile;

-- 0.c) Si antes usabas login por email/password, puede haber datos con un user_id
--      VIEJO (distinto al de Google). Esto te muestra qué user_ids tienen datos:
-- select user_id, count(*) from sessions  group by user_id
-- union all select user_id, count(*) from tournaments group by user_id;


-- ─────────────────────────────────────────────────────────────────────────
--  PARTE 1 — ESQUEMA: columna user_id + FK a auth.users + índice (idempotente)
-- ─────────────────────────────────────────────────────────────────────────
do $$
declare
  t text;
  tbls text[] := array[
    'sessions','session_details','tournaments',
    'nutrition','meals','daily_metrics','profile'
  ];
begin
  foreach t in array tbls loop
    -- 1) columna user_id (no toca filas existentes; quedan en NULL hasta el backfill)
    execute format('alter table public.%I add column if not exists user_id uuid', t);

    -- 2) FK a auth.users con borrado en cascada (solo si no existe ya)
    if not exists (
      select 1 from pg_constraint
      where conname = t || '_user_id_fkey'
        and conrelid = format('public.%I', t)::regclass
    ) then
      execute format(
        'alter table public.%I add constraint %I '
        || 'foreign key (user_id) references auth.users(id) on delete cascade',
        t, t || '_user_id_fkey'
      );
    end if;

    -- 3) índice para que los filtros .eq(''user_id'', ...) sean rápidos
    execute format(
      'create index if not exists %I on public.%I (user_id)',
      'idx_' || t || '_user_id', t
    );
  end loop;
end $$;

-- Un perfil por usuario (recomendado). Si hay duplicados, primero limpialos.
-- create unique index if not exists uq_profile_user_id on public.profile (user_id);


-- ─────────────────────────────────────────────────────────────────────────
--  PARTE 2 — BACKFILL: reclamar TODOS los datos para tu usuario de Google
--  Confirmado: todos los datos de la base son tuyos → asignamos TODAS las
--  filas a tu usuario (cubre tanto user_id NULL como un user_id viejo).
--
--  👉 Editá una sola cosa: poné el EMAIL con el que entrás por Google.
--     El bloque resuelve tu UUID solo y actualiza las 7 tablas.
-- ─────────────────────────────────────────────────────────────────────────
do $$
declare
  uid uuid;
begin
  select id into uid
  from auth.users
  where email = 'TU_EMAIL_DE_GOOGLE'   -- <<< EDITÁ ESTO
  order by created_at desc
  limit 1;

  if uid is null then
    raise exception 'No se encontró un usuario con ese email en auth.users';
  end if;

  update sessions        set user_id = uid where user_id is distinct from uid;
  update session_details set user_id = uid where user_id is distinct from uid;
  update tournaments     set user_id = uid where user_id is distinct from uid;
  update nutrition       set user_id = uid where user_id is distinct from uid;
  update meals           set user_id = uid where user_id is distinct from uid;
  update daily_metrics   set user_id = uid where user_id is distinct from uid;
  update profile         set user_id = uid where user_id is distinct from uid;

  raise notice 'Backfill OK. Todas las filas asignadas a user_id %', uid;
end $$;

-- Si tenés MÁS de un perfil tras el backfill (la ruta /api/profile espera uno
-- solo), dejá el más reciente y borrá el resto:
-- delete from profile p
-- where exists (
--   select 1 from profile p2
--   where p2.user_id = p.user_id and p2.updated_at > p.updated_at
-- );

-- Alternativa: si preferís pegar tu UUID a mano (mirá la PARTE 0.a),
-- reemplazá '<TU_UUID>' y corré:
-- update sessions        set user_id = '<TU_UUID>';
-- update session_details set user_id = '<TU_UUID>';
-- update tournaments     set user_id = '<TU_UUID>';
-- update nutrition       set user_id = '<TU_UUID>';
-- update meals           set user_id = '<TU_UUID>';
-- update daily_metrics   set user_id = '<TU_UUID>';
-- update profile         set user_id = '<TU_UUID>';


-- ─────────────────────────────────────────────────────────────────────────
--  PARTE 3 — RLS ESTRICTO (defensa en profundidad)
--  Hacelo DESPUÉS del backfill. El backend (service_role) bypassa RLS y sigue
--  funcionando; el acceso directo con anon/authenticated queda limitado a las
--  filas propias (auth.uid() = user_id).
-- ─────────────────────────────────────────────────────────────────────────
do $$
declare
  t text;
  tbls text[] := array[
    'sessions','session_details','tournaments',
    'nutrition','meals','daily_metrics','profile'
  ];
begin
  foreach t in array tbls loop
    execute format('alter table public.%I enable row level security', t);
    -- saca la política insegura anterior
    execute format('drop policy if exists "Allow all" on public.%I', t);
    -- política por-usuario (recreada limpia)
    execute format('drop policy if exists "Users manage own rows" on public.%I', t);
    execute format(
      'create policy "Users manage own rows" on public.%I '
      || 'for all to authenticated '
      || 'using (auth.uid() = user_id) with check (auth.uid() = user_id)',
      t
    );
  end loop;
end $$;
