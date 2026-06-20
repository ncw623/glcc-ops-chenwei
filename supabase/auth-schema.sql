-- ============================================================
-- TEAM LOGIN — run this once in the Supabase SQL Editor (after schema.sql).
-- Safe to re-run. Adds a `profiles` table linked to Supabase Auth users,
-- where each person's role + allowed tabs live.
-- ============================================================

create table if not exists profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  role         text   not null default 'member',          -- 'admin' | 'member'
  allowed_tabs text[] not null default '{}',               -- e.g. {dashboard,pipeline,tasks}
  created_at   timestamptz not null default now()
);

-- Row Level Security: a signed-in user may read ONLY their own profile row.
-- (The server reads roles with this; nobody can see or edit anyone else's.)
alter table profiles enable row level security;

drop policy if exists "read own profile" on profiles;
create policy "read own profile" on profiles
  for select using (auth.uid() = id);

-- Every new auth user automatically gets a 'member' profile with the default
-- tabs you chose (Dashboard, Pipeline, Tasks, Projects, Contacts, Content).
-- Admins / custom members are set afterwards by the create-user script.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, allowed_tabs)
  values (new.id, 'member', array['dashboard','pipeline','tasks','projects','contacts','content'])
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
