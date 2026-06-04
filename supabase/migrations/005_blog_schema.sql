-- =============================================
-- LensLab — Blog Schema
-- Uitvoeren in: Supabase Dashboard > SQL Editor
-- =============================================

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),

  -- Basis
  title text not null,
  slug text not null unique,
  category text not null default '',
  intro text not null default '',
  hero_image_url text,
  reading_time_minutes integer not null default 5,

  -- SEO
  meta_title text,
  meta_description text,
  meta_keywords text,

  -- Content (JSON blocks)
  -- [{id, type: 'h2'|'h3'|'paragraph'|'bulletList'|'image', content?, items?: string[], url?, alt?}]
  content_blocks jsonb not null default '[]',

  -- Structured sections
  faq_items jsonb not null default '[]',     -- [{q, a}]
  summary_items jsonb not null default '[]', -- [string]

  -- Related articles (slugs)
  related_slugs jsonb not null default '[]', -- [slug]

  -- Publishing
  is_published boolean not null default false,
  published_at timestamptz,

  -- Meta
  author text not null default 'LensLab',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists blog_posts_slug_idx on blog_posts(slug);
create index if not exists blog_posts_published_idx on blog_posts(is_published, published_at desc);
create index if not exists blog_posts_category_idx on blog_posts(category);

-- Auto-update updated_at
create or replace trigger update_blog_posts_updated_at
  before update on blog_posts
  for each row execute procedure update_updated_at_column();

-- RLS
alter table blog_posts enable row level security;

-- Published posts are publicly readable
create policy "Published blog posts are public"
  on blog_posts for select
  using (is_published = true);

-- Service role (admin) can do everything — bypasses RLS
