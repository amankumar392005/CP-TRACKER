-- ═══════════════════════════════════════════════════════════════
-- CP Tracker AI — Complete Database Schema
-- Run this ONCE in Supabase SQL Editor (safe to re-run)
-- ═══════════════════════════════════════════════════════════════

-- ── 1. profiles ──────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text,
  display_name  text,
  avatar_url    text,
  cf_handle     text default '',
  lc_handle     text default '',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── 2. cf_data (Codeforces cache) ────────────────────────────
create table if not exists public.cf_data (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references public.profiles(id) on delete cascade not null,
  handle          text not null,
  rating          integer default 0,
  max_rating      integer default 0,
  rank            text default 'unrated',
  max_rank        text default 'unrated',
  total_solved    integer default 0,
  streak_days     integer default 0,
  contribution    integer default 0,
  friend_count    integer default 0,
  country         text default '',
  organization    text default '',
  avatar          text default '',
  rating_history  jsonb default '[]',
  tag_dist        jsonb default '{}',
  difficulty_dist jsonb default '{}',
  contests        jsonb default '[]',
  cached_at       timestamptz default now(),
  unique (user_id)
);

-- ── 3. lc_data (LeetCode cache) ──────────────────────────────
create table if not exists public.lc_data (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references public.profiles(id) on delete cascade not null,
  handle          text not null,
  real_name       text default '',
  avatar          text default '',
  ranking         integer default 0,
  contest_rating  integer default 0,
  max_rating      integer default 0,
  total_solved    integer default 0,
  easy_solved     integer default 0,
  medium_solved   integer default 0,
  hard_solved     integer default 0,
  total_easy      integer default 0,
  total_medium    integer default 0,
  total_hard      integer default 0,
  acceptance_rate numeric(5,2) default 0,
  streak          integer default 0,
  total_contests  integer default 0,
  global_ranking  integer default 0,
  tag_dist        jsonb default '{}',
  rating_history  jsonb default '[]',
  contests        jsonb default '[]',
  cached_at       timestamptz default now(),
  unique (user_id)
);

-- ── 4. notes ─────────────────────────────────────────────────
create table if not exists public.notes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  title       text not null,
  content     text default '',
  platform    text check (platform in ('CF','LC','BOTH')) default 'CF',
  tags        text[] default '{}',
  url         text default '',
  bookmarked  boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── 5. goals ─────────────────────────────────────────────────
create table if not exists public.goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  title       text not null,
  platform    text check (platform in ('CF','LC','BOTH')) default 'CF',
  target      integer not null,
  current     integer default 0,
  deadline    date,
  color       text default '#3b82f6',
  achieved    boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── 6. ai_sessions ───────────────────────────────────────────
create table if not exists public.ai_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles(id) on delete cascade not null,
  roadmap       jsonb not null default '[]',
  problems      jsonb not null default '[]',
  weak_analysis text default '',
  created_at    timestamptz default now()
);

-- ════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY — every user sees only their own data
-- ════════════════════════════════════════════════════════════
alter table public.profiles   enable row level security;
alter table public.cf_data    enable row level security;
alter table public.lc_data    enable row level security;
alter table public.notes      enable row level security;
alter table public.goals      enable row level security;
alter table public.ai_sessions enable row level security;

-- Drop old policies (safe re-run)
do $$ begin
  drop policy if exists "profiles_self"    on public.profiles;
  drop policy if exists "cf_data_self"     on public.cf_data;
  drop policy if exists "lc_data_self"     on public.lc_data;
  drop policy if exists "notes_self"       on public.notes;
  drop policy if exists "goals_self"       on public.goals;
  drop policy if exists "ai_sessions_self" on public.ai_sessions;
end $$;

create policy "profiles_self"    on public.profiles    using (auth.uid()=id)          with check (auth.uid()=id);
create policy "cf_data_self"     on public.cf_data     using (auth.uid()=user_id)     with check (auth.uid()=user_id);
create policy "lc_data_self"     on public.lc_data     using (auth.uid()=user_id)     with check (auth.uid()=user_id);
create policy "notes_self"       on public.notes       using (auth.uid()=user_id)     with check (auth.uid()=user_id);
create policy "goals_self"       on public.goals       using (auth.uid()=user_id)     with check (auth.uid()=user_id);
create policy "ai_sessions_self" on public.ai_sessions using (auth.uid()=user_id)     with check (auth.uid()=user_id);

-- ════════════════════════════════════════════════════════════
-- AUTO-CREATE PROFILE on signup (email AND Google OAuth)
-- ════════════════════════════════════════════════════════════
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email,'@',1)
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      ''
    )
  )
  on conflict (id) do update set
    email        = excluded.email,
    display_name = coalesce(profiles.display_name, excluded.display_name),
    avatar_url   = coalesce(profiles.avatar_url,   excluded.avatar_url),
    updated_at   = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- updated_at triggers
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists t_profiles_updated on public.profiles;
drop trigger if exists t_notes_updated    on public.notes;
drop trigger if exists t_goals_updated    on public.goals;
create trigger t_profiles_updated before update on public.profiles for each row execute procedure public.touch_updated_at();
create trigger t_notes_updated    before update on public.notes    for each row execute procedure public.touch_updated_at();
create trigger t_goals_updated    before update on public.goals    for each row execute procedure public.touch_updated_at();

-- Indexes
create index if not exists idx_cf_data_user    on public.cf_data(user_id);
create index if not exists idx_lc_data_user    on public.lc_data(user_id);
create index if not exists idx_notes_user      on public.notes(user_id);
create index if not exists idx_goals_user      on public.goals(user_id);
create index if not exists idx_ai_user         on public.ai_sessions(user_id);
create index if not exists idx_notes_bookmarked on public.notes(user_id, bookmarked);
