alter table photographers
  add column if not exists profile_status text default 'concept'
  check (profile_status in ('concept', 'live', 'hidden'));

-- Bestaande data migreren
update photographers set profile_status = 'live'   where is_published = true;
update photographers set profile_status = 'hidden' where is_published = false and contact_name is not null;
-- Overige (is_published = false, geen contact_name) blijven 'concept' (default)
