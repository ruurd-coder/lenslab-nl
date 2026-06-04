-- Add og_image_url field to blog_posts
alter table blog_posts add column if not exists og_image_url text;
