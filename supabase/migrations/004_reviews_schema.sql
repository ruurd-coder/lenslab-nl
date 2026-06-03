-- =============================================
-- LensLab — Reviews tabel
-- Uitvoeren in: Supabase Dashboard > SQL Editor
-- =============================================

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  photographer_id uuid not null references photographers(id) on delete cascade,
  reviewer_name text not null,
  rating integer not null check (rating between 1 and 5),
  review_text text,
  review_date date not null default current_date,
  source text default 'via uitnodiging',
  is_published boolean default true,
  created_at timestamptz default now()
);

create index if not exists reviews_photographer_idx on reviews(photographer_id);
create index if not exists reviews_published_idx on reviews(is_published);

-- RLS
alter table reviews enable row level security;

-- Iedereen mag een review inserten (anoniem)
create policy "Anyone can insert reviews"
  on reviews for insert
  with check (true);

-- Gepubliceerde reviews zijn publiek leesbaar
create policy "Published reviews are public"
  on reviews for select
  using (is_published = true);

-- Trigger: update rating en review_count op photographers na insert
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
    )
  where id = new.photographer_id;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_review_inserted
  after insert on reviews
  for each row execute procedure update_photographer_rating();
