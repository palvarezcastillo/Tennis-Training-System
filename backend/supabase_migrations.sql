-- Run this SQL in the Supabase SQL Editor to create and migrate the required tables.

-- ── tournaments ──────────────────────────────────────────────────────────────
create table if not exists tournaments (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  date       date not null,
  time       text,
  location   text,
  category   text,
  notes      text,
  created_at timestamptz default now()
);

-- Add time column if the table already exists without it
alter table tournaments add column if not exists time text;

alter table tournaments enable row level security;

create policy if not exists "Allow all" on tournaments
  for all using (true) with check (true);

-- ── sessions ─────────────────────────────────────────────────────────────────
create table if not exists sessions (
  id           uuid primary key default gen_random_uuid(),
  date         date not null,
  type         text not null,
  label        text,
  intensity    int default 0,
  done         boolean default false,
  duration_min int,
  rpe          int,
  notes        text,
  created_at   timestamptz default now()
);

-- Add new columns if the table already exists without them
alter table sessions add column if not exists duration_min int;
alter table sessions add column if not exists rpe          int;
alter table sessions add column if not exists notes        text;

alter table sessions enable row level security;

create policy if not exists "Allow all" on sessions
  for all using (true) with check (true);
