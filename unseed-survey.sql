-- ============================================================================
-- PRMSU Schedule Maker - REMOVE the seeded (fake) starting numbers
-- ----------------------------------------------------------------------------
-- Run this ONCE in Supabase -> SQL Editor. It subtracts EXACTLY the social-proof
-- seed that supabase-stats.sql + seed-survey.sql added, leaving only the real
-- activity from actual visitors. It never goes below 0, and it keeps any real
-- taps that happened since (because it subtracts the seed, not a fixed total).
--
-- After running, expect roughly:  hearts 8, views 28, and only campuses that
-- real Ramonians actually picked (e.g. Iba (Main): ~10 answers, ~8 hearts).
-- ============================================================================

-- 1) Global counters: remove the 67 hearts / 141 views baseline.
update public.site_counters
  set hearts = greatest(0, hearts - 67),
      views  = greatest(0, views  - 141),
      updated_at = now()
  where site = 'prmsu-sched';

-- 2) Per-campus: remove the seeded answers/hearts from each campus.
update public.site_survey s set
  responses = greatest(0, s.responses - v.seed_r),
  hearts    = greatest(0, s.hearts    - v.seed_h)
from (values
  ('Iba (Main Campus)', 31, 24),
  ('Botolan',           18, 13),
  ('Candelaria',        12,  8),
  ('Castillejos',        9,  6),
  ('Masinloc',           7,  5),
  ('San Marcelino',      5,  3),
  ('Santa Cruz',         3,  2),
  ('Other',              2,  1)
) as v(branch, seed_r, seed_h)
where s.site = 'prmsu-sched' and s.branch = v.branch;

-- 3) Drop campus rows that are now empty (they were all seed, no real activity).
delete from public.site_survey
  where site = 'prmsu-sched' and responses = 0 and hearts = 0;

notify pgrst, 'reload schema';

-- Check the result:
--   select hearts, views from site_counters where site = 'prmsu-sched';
--   select branch, responses, hearts from site_survey
--     where site = 'prmsu-sched' order by responses desc;
