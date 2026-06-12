-- Rewrite score as 0-100% based on new rules
create or replace function calculate_profile_score(p photographers)
returns integer as $$
declare
  v_score numeric := 0;
  v_active_categories integer := 0;
  v_total_photos integer := 0;
  v_filled_links integer := 0;
  v_cat_key text;
  v_cat_photos jsonb;
  v_last_activity timestamptz;
  v_months_ago numeric;
begin
  -- Portfolio (max 40%): total photos / (active categories × 5)
  if p.portfolio_by_category is not null then
    for v_cat_key, v_cat_photos in
      select key, value from jsonb_each(p.portfolio_by_category)
    loop
      if jsonb_typeof(v_cat_photos) = 'array' then
        v_active_categories := v_active_categories + 1;
        v_total_photos := v_total_photos + jsonb_array_length(v_cat_photos);
      end if;
    end loop;
  end if;
  if v_active_categories > 0 then
    v_score := v_score + least(v_total_photos::numeric / (v_active_categories * 5), 1) * 40;
  end if;

  -- Reviews (max 25%): 5% per review, max 5 reviews
  v_score := v_score + least(coalesce(p.review_count, 0), 5) * 5;

  -- Profile links (max 20%): 3 links, each 20/3 %
  if p.website_url is not null and p.website_url <> '' then v_filled_links := v_filled_links + 1; end if;
  if p.instagram_url is not null and p.instagram_url <> '' then v_filled_links := v_filled_links + 1; end if;
  if p.linkedin_url is not null and p.linkedin_url <> '' then v_filled_links := v_filled_links + 1; end if;
  v_score := v_score + (v_filled_links::numeric / 3) * 20;

  -- Recency (max 15%): -5% per inactive month
  v_last_activity := greatest(p.updated_at, coalesce(p.last_review_at, '1970-01-01'::timestamptz));
  v_months_ago := extract(epoch from (now() - v_last_activity)) / (30 * 24 * 3600);
  if v_months_ago <= 1 then
    v_score := v_score + 15;
  elsif v_months_ago <= 2 then
    v_score := v_score + 10;
  elsif v_months_ago <= 3 then
    v_score := v_score + 5;
  end if;

  return round(v_score)::integer;
end;
$$ language plpgsql;

-- Recalculate all
update photographers set updated_at = updated_at;
