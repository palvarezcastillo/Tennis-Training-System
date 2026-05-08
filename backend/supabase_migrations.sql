-- Run this SQL in the Supabase SQL Editor to create the required tables.

create table if not exists tournaments (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  date       date not null,
  location   text,
  category   text,
  notes      text,
  created_at timestamptz default now()
);

-- Allow all operations without authentication (adjust to your RLS policy)
alter table tournaments enable row level security;

create policy "Allow all" on tournaments
  for all using (true) with check (true);
