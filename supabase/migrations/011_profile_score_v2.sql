-- Update scoring: reviews = min(review_count, 5) * 6 (max 30pt, 5 reviews)
create or replace function calculate_profile_score(p photographers)
returns integer as $$
declare
  v_score integer := 0;
  v_category_count integer := 0;
  v_cat_key text;
  v_cat_photos jsonb;
begin
  -- Portfolio (max 35pt): 7pt per category with >= 5 photos, max 5 categories
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

  -- Reviews (max 30pt): 6pt per review, max 5 reviews
  v_score := v_score + least(coalesce(p.review_count, 0), 5) * 6;

  -- Profile links (max 20pt)
  if p.website_url is not null and p.website_url <> '' then v_score := v_score + 8; end if;
  if p.instagram_url is not null and p.instagram_url <> '' then v_score := v_score + 8; end if;
  if p.linkedin_url is not null and p.linkedin_url <> '' then v_score := v_score + 4; end if;

  -- Recency (max 15pt)
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

-- Recalculate all existing scores
update photographers set updated_at = updated_at;
