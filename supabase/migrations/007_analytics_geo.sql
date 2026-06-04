-- Add geo fields to photographer_analytics
alter table photographer_analytics
  add column if not exists city text,
  add column if not exists country text;

create index if not exists photographer_analytics_city_idx on photographer_analytics(photographer_id, city);
