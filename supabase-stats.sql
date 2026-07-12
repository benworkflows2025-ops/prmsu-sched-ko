-- ============================================================================
-- PRMSU Schedule Maker - shared hearts + views, and an anonymous campus survey
-- ----------------------------------------------------------------------------
-- Run this ONCE in your Supabase project -> SQL Editor -> New query -> Run.
-- It reuses the SAME Supabase project as the Freedom Wall. It only ADDS two
-- tiny tables and a few functions, and touches nothing that already exists.
--
-- What it stores: a few anonymous whole numbers - a global hearts + views
-- count, and a per-campus tally (how many Ramonians from each campus answered
-- the "Taga-saang campus ka?" popup, and how many of them hearted). There is
-- NO login and nothing that identifies a student: no names, no COR, no emails.
-- The survey is anonymous by design, so you see counts per campus, never "who".
-- Safe to run more than once.
-- ============================================================================

-- ---- global counters for the site -----------------------------------------
create table if not exists public.site_counters (
  site       text primary key,
  hearts     bigint not null default 0,
  views      bigint not null default 0,
  updated_at timestamptz not null default now()
);

-- Starting (social-proof) baseline: 67 hearts, 141 views. Real taps grow it.
insert into public.site_counters (site, hearts, views)
values ('prmsu-sched', 67, 141)
on conflict (site) do nothing;

-- ---- anonymous per-campus survey -------------------------------------------
--   responses = how many picked this campus in the welcome popup
--   hearts    = how many of them also hearted the tool
create table if not exists public.site_survey (
  site      text   not null,
  branch    text   not null,
  responses bigint not null default 0,
  hearts    bigint not null default 0,
  primary key (site, branch)
);

-- Lock both tables down: anonymous visitors can NEVER read or write them
-- directly. Every read/write goes through the SECURITY DEFINER functions
-- below, which clamp the input so the counters can't be abused.
alter table public.site_counters enable row level security;
alter table public.site_survey   enable row level security;
-- (no policies on purpose -> direct anon / authenticated access is denied)

-- keep unknown campus names from spawning junk rows
create or replace function public._sched_branch(p_branch text)
returns text
language sql
immutable
set search_path = public
as $$
  select case
    when nullif(btrim(coalesce(p_branch, '')), '') is null then null
    when btrim(p_branch) in ('Iba (Main Campus)','Botolan','Candelaria','Castillejos',
                             'Masinloc','San Marcelino','Santa Cruz') then btrim(p_branch)
    else 'Other'
  end;
$$;

-- ---- read the two global numbers -------------------------------------------
create or replace function public.get_counters(p_site text)
returns table (hearts bigint, views bigint)
language sql
security definer
set search_path = public
as $$
  select coalesce(c.hearts, 0), coalesce(c.views, 0)
  from public.site_counters c
  where c.site = p_site;
$$;

-- ---- +1 view (returns the fresh numbers) -----------------------------------
create or replace function public.bump_view(p_site text)
returns table (hearts bigint, views bigint)
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.site_counters (site, views) values (p_site, 1)
  on conflict (site) do update
    set views = site_counters.views + 1,
        updated_at = now();
  return query
    select c.hearts, c.views from public.site_counters c where c.site = p_site;
end;
$$;

-- ---- record a survey answer (one campus pick) ------------------------------
create or replace function public.submit_survey(p_site text, p_branch text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  b text := public._sched_branch(p_branch);
begin
  if b is null then return; end if;
  insert into public.site_survey (site, branch, responses) values (p_site, b, 1)
  on conflict (site, branch) do update
    set responses = site_survey.responses + 1;
end;
$$;

-- ---- heart / un-heart -------------------------------------------------------
--   p_delta is clamped to -1..+1, so one tap can only ever move it by one.
--   hearts can never go below 0. p_branch is optional; when given, the same
--   move is applied to that campus's heart tally too.
create or replace function public.bump_heart(p_site text, p_delta int, p_branch text default null)
returns table (hearts bigint, views bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  d int  := greatest(-1, least(1, coalesce(p_delta, 0)));
  b text := public._sched_branch(p_branch);
begin
  -- global hearts
  insert into public.site_counters (site, hearts) values (p_site, greatest(0, d))
  on conflict (site) do update
    set hearts = greatest(0, site_counters.hearts + d),
        updated_at = now();

  -- per-campus hearts (only when a campus was chosen and it was a real tap)
  if b is not null and d <> 0 then
    insert into public.site_survey (site, branch, hearts) values (p_site, b, greatest(0, d))
    on conflict (site, branch) do update
      set hearts = greatest(0, site_survey.hearts + d);
  end if;

  return query
    select c.hearts, c.views from public.site_counters c where c.site = p_site;
end;
$$;

-- ---- OWNER: see the survey results (counts per campus, never "who") ---------
--   You can also just open the Table Editor -> site_survey in Supabase.
create or replace function public.get_survey(p_site text)
returns table (branch text, responses bigint, hearts bigint)
language sql
security definer
set search_path = public
as $$
  select s.branch, s.responses, s.hearts
  from public.site_survey s
  where s.site = p_site
  order by s.responses desc, s.hearts desc, s.branch asc;
$$;

-- Let anonymous visitors CALL the functions (but never touch the tables).
grant execute on function public.get_counters(text)          to anon, authenticated;
grant execute on function public.bump_view(text)             to anon, authenticated;
grant execute on function public.submit_survey(text, text)   to anon, authenticated;
grant execute on function public.bump_heart(text, int, text) to anon, authenticated;
grant execute on function public.get_survey(text)            to anon, authenticated;

notify pgrst, 'reload schema';

-- ============================================================================
-- OWNER CHEAT SHEET - to see who (well, how many, and from where) answered:
--   Supabase -> SQL Editor -> run:
--       select branch, responses, hearts
--       from site_survey where site = 'prmsu-sched'
--       order by responses desc;
--   ...or Supabase -> Table Editor -> site_survey.
-- It is anonymous: you get counts per campus, not individual identities.
-- ============================================================================
