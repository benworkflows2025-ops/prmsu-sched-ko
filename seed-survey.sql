-- ============================================================================
-- PRMSU Schedule Maker - seed the campus leaderboard with starting numbers
-- ----------------------------------------------------------------------------
-- Run this ONCE in Supabase -> SQL Editor (after supabase-stats.sql).
-- It gives each campus a starting count so the "Which campus uses this the most?"
-- board looks alive. Real answers from the welcome popup keep adding on top of
-- these numbers. Safe to re-run (it just resets the baseline).
--
--   responses = how many picked that campus   |   hearts = how many also hearted
-- ============================================================================

insert into public.site_survey (site, branch, responses, hearts) values
  ('prmsu-sched', 'Iba (Main Campus)', 31, 24),
  ('prmsu-sched', 'Botolan',           18, 13),
  ('prmsu-sched', 'Candelaria',        12,  8),
  ('prmsu-sched', 'Castillejos',        9,  6),
  ('prmsu-sched', 'Masinloc',           7,  5),
  ('prmsu-sched', 'San Marcelino',      5,  3),
  ('prmsu-sched', 'Santa Cruz',         3,  2),
  ('prmsu-sched', 'Other',              2,  1)
on conflict (site, branch) do update
  set responses = excluded.responses,
      hearts    = excluded.hearts;

notify pgrst, 'reload schema';
