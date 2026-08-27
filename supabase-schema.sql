create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  location text,
  tag text default 'New',
  status text default 'Active',
  orders integer default 0,
  total_spent numeric default 0,
  last_order timestamptz,
  favorite_product text,
  note text,
  created_at timestamptz default now()
);

alter table public.customers enable row level security;
-- Add authenticated-user policies here when Supabase Auth is enabled.
