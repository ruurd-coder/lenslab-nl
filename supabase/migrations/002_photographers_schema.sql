-- =============================================
-- LensLab — Photographers / Beeldmakers Schema
-- Gedeeld tussen lenslab-nl en lenslab-b2b-saas
-- Uitvoeren in: Supabase Dashboard > SQL Editor
-- =============================================

-- Beeldmakers (fotografen & videografen)
create table if not exists photographers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null, -- gekoppeld Supabase account
  slug text not null unique,                                  -- URL slug bijv. "hoven-fotografie"
  business_name text not null,                               -- "Hoven Fotografie"
  contact_name text,                                         -- "Jill van den Hoven"
  type text not null default 'fotograaf',                    -- 'fotograaf' | 'videograaf' | 'beide'
  bio text,
  avatar_url text,                                           -- profielfoto contactpersoon
  hero_image_url text,                                       -- groot beeld op profielpagina
  portfolio_images jsonb default '[]',                       -- array van image URLs
  specialties text[] default '{}',                           -- ["Familie","Zwangerschap","Baby"]
  regions text[] default '{}',                               -- ["Brabant","Noord-Holland"]
  city text,                                                 -- primaire stad
  website_url text,
  instagram_url text,
  linkedin_url text,
  email text,
  phone text,
  rating numeric(3,2) default 0,                            -- gemiddelde beoordeling
  review_count integer default 0,
  is_verified boolean default false,
  is_published boolean default false,                        -- zichtbaar op platform
  is_b2b boolean default false,                              -- ook zichtbaar in lenslab-b2b-saas
  meta_title text,                                           -- SEO
  meta_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Regio's (voor filtering + regio-pagina's)
create table if not exists regions (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,         -- "Noord-Holland"
  slug text not null unique,         -- "noord-holland"
  province text,                     -- "Noord-Holland" (provincie)
  city text,                         -- optioneel: plaatsnaam
  meta_title text,
  meta_description text,
  created_at timestamptz default now()
);

-- Fotografie types (voor type-pagina's)
create table if not exists photography_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,         -- "Bruiloftsfotografie"
  slug text not null unique,         -- "bruiloftsfotografie"
  description text,
  meta_title text,
  meta_description text,
  hero_image_url text,
  created_at timestamptz default now()
);

-- Analytics events (impressies, clicks)
create table if not exists photographer_analytics (
  id uuid primary key default gen_random_uuid(),
  photographer_id uuid references photographers(id) on delete cascade,
  event_type text not null,  -- 'impression' | 'profile_click' | 'mail_click' | 'instagram_click' | 'linkedin_click' | 'website_click'
  page_context text,         -- op welke pagina vond het event plaats
  session_id text,           -- anonieme sessie ID
  created_at timestamptz default now()
);

-- Indexes voor snelle queries
create index if not exists photographers_slug_idx on photographers(slug);
create index if not exists photographers_regions_idx on photographers using gin(regions);
create index if not exists photographers_specialties_idx on photographers using gin(specialties);
create index if not exists photographers_type_idx on photographers(type);
create index if not exists photographers_published_idx on photographers(is_published);
create index if not exists photographer_analytics_photographer_idx on photographer_analytics(photographer_id);
create index if not exists photographer_analytics_event_idx on photographer_analytics(event_type);
create index if not exists photographer_analytics_created_idx on photographer_analytics(created_at);

-- Row Level Security
alter table photographers enable row level security;
alter table regions enable row level security;
alter table photography_types enable row level security;
alter table photographer_analytics enable row level security;

-- Publiek leesbaar (gepubliceerde profielen)
create policy "Photographers are publicly readable"
  on photographers for select
  using (is_published = true);

-- Beeldmaker kan eigen profiel lezen en bewerken
create policy "Photographers can manage own profile"
  on photographers for all
  using (auth.uid() = user_id);

-- Admins kunnen alles
create policy "Admins have full access to photographers"
  on photographers for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Regio's en types: publiek leesbaar
create policy "Regions are publicly readable"
  on regions for select using (true);

create policy "Types are publicly readable"
  on photography_types for select using (true);

-- Analytics: iedereen kan inserten (anoniem tracken), alleen eigenaar/admin kan lezen
create policy "Anyone can insert analytics"
  on photographer_analytics for insert
  with check (true);

create policy "Photographers can read own analytics"
  on photographer_analytics for select
  using (
    exists (
      select 1 from photographers
      where photographers.id = photographer_id
      and photographers.user_id = auth.uid()
    )
  );

create policy "Admins can read all analytics"
  on photographer_analytics for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Admins kunnen regio's en types beheren
create policy "Admins can manage regions"
  on regions for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can manage photography types"
  on photography_types for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Seed: basis regio's
insert into regions (name, slug, province) values
  ('Amsterdam', 'amsterdam', 'Noord-Holland'),
  ('Rotterdam', 'rotterdam', 'Zuid-Holland'),
  ('Den Haag', 'den-haag', 'Zuid-Holland'),
  ('Utrecht', 'utrecht', 'Utrecht'),
  ('Eindhoven', 'eindhoven', 'Noord-Brabant'),
  ('Groningen', 'groningen', 'Groningen'),
  ('Tilburg', 'tilburg', 'Noord-Brabant'),
  ('Almere', 'almere', 'Flevoland'),
  ('Breda', 'breda', 'Noord-Brabant'),
  ('Nijmegen', 'nijmegen', 'Gelderland'),
  ('Noord-Holland', 'noord-holland', 'Noord-Holland'),
  ('Zuid-Holland', 'zuid-holland', 'Zuid-Holland'),
  ('Noord-Brabant', 'noord-brabant', 'Noord-Brabant'),
  ('Gelderland', 'gelderland', 'Gelderland'),
  ('Utrecht (provincie)', 'utrecht-provincie', 'Utrecht')
on conflict (slug) do nothing;

-- Seed: basis fotografie types
insert into photography_types (name, slug, description) values
  ('Bruiloftsfotografie', 'bruiloftsfotografie', 'Fotografen gespecialiseerd in bruiloften en trouwerijen'),
  ('Familiefotografie', 'familiefotografie', 'Fotografen voor gezins- en familieshoot'),
  ('Portretfotografie', 'portretfotografie', 'Professionele portretfotografie'),
  ('Bedrijfsfotografie', 'bedrijfsfotografie', 'Zakelijke fotografie en headshots'),
  ('Zwangerschapsfotografie', 'zwangerschapsfotografie', 'Fotografie rondom zwangerschap en geboorte'),
  ('Newbornfotografie', 'newbornfotografie', 'Fotografen gespecialiseerd in pasgeborenen'),
  ('Eventfotografie', 'eventfotografie', 'Fotografie van evenementen en bijeenkomsten'),
  ('Productfotografie', 'productfotografie', 'Professionele productfotografie voor e-commerce en marketing'),
  ('Architectuurfotografie', 'architectuurfotografie', 'Interieur- en exterieursfotografie'),
  ('Videografie', 'videografie', 'Professionele videografen')
on conflict (slug) do nothing;

-- Voeg portfolio_by_category toe (uitvoeren als de tabel al bestaat)
alter table photographers
  add column if not exists portfolio_by_category jsonb default '{}';
