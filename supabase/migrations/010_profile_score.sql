-- Add profile_score and last_review_at columns
alter table photographers
  add column if not exists profile_score integer not null default 0,
  add column if not exists last_review_at timestamptz;

-- Update review trigger to also track last_review_at
create or replace function update_photographer_rating()
returns trigger as $$
begin
  update photographers
  set
    rating = (
      select round(avg(rating)::numeric, 2)
      from reviews
      where photographer_id = new.photographer_id
        and is_published = true
    ),
    review_count = (
      select count(*)
      from reviews
      where photographer_id = new.photographer_id
        and is_published = true
    ),
    last_review_at = now()
  where id = new.photographer_id;
  return new;
end;
$$ language plpgsql security definer;

-- Function: calculate profile score from a photographers row
create or replace function calculate_profile_score(p photographers)
returns integer as $$
declare
  v_score integer := 0;
  v_category_count integer := 0;
  v_cat_key text;
  v_cat_photos jsonb;
begin
  -- Portfolio (35pt): 7pt per category with >= 5 photos, max 5 categories
  if p.portfolio_by_category is not null then
    for v_cat_key, v_cat_photos in
      select key, value from jsonb_each(p.portfolio_by_category)
    loop
      if jsonb_typeof(v_cat_photos) = 'array' and jsonb_array_length(v_cat_photos) >= 5 then
        v_category_count := v_category_count + 1;
      end if;
    end loop;
  end if;
  v_score := v_score + least(v_category_count, 5) * 7;

  -- Reviews (30pt): rating score (max 20pt) + volume (max 10pt)
  v_score := v_score + round((coalesce(p.rating, 0) / 5.0) * 20)::integer;
  v_score := v_score + least(coalesce(p.review_count, 0), 10);

  -- Profile links (20pt)
  if p.website_url is not null and p.website_url <> '' then v_score := v_score + 8; end if;
  if p.instagram_url is not null and p.instagram_url <> '' then v_score := v_score + 8; end if;
  if p.linkedin_url is not null and p.linkedin_url <> '' then v_score := v_score + 4; end if;

  -- Recency (15pt)
  if p.updated_at >= now() - interval '30 days' then
    v_score := v_score + 8;
  elsif p.updated_at >= now() - interval '90 days' then
    v_score := v_score + 4;
  end if;

  if p.last_review_at is not null and p.last_review_at >= now() - interval '30 days' then
    v_score := v_score + 7;
  end if;

  return v_score;
end;
$$ language plpgsql;

-- Trigger function: keep profile_score in sync
create or replace function update_profile_score()
returns trigger as $$
begin
  new.profile_score := calculate_profile_score(new);
  return new;
end;
$$ language plpgsql;

create or replace trigger trg_update_profile_score
  before insert or update on photographers
  for each row execute function update_profile_score();

-- Helper for cron: recalculate all scores (recency changes over time)
create or replace function recalculate_all_profile_scores()
returns void as $$
begin
  update photographers
  set profile_score = calculate_profile_score(photographers.*)
  where is_published = true;
end;
$$ language plpgsql security definer;

-- Backfill existing photographers
update photographers set updated_at = updated_at;
