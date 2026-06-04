import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const service = await createServiceClient();

  // Strip any leading slashes or /blog/ prefix from slug
  const cleanSlug = (body.slug as string).replace(/^\/+/, "").replace(/^blog\//, "");

  const { data, error } = await service.from("blog_posts").insert({
    title: body.title,
    slug: cleanSlug,
    category: body.category,
    intro: body.intro,
    hero_image_url: body.hero_image_url || null,
    reading_time_minutes: body.reading_time_minutes,
    meta_title: body.meta_title || null,
    meta_description: body.meta_description || null,
    meta_keywords: body.meta_keywords || null,
    og_image_url: body.og_image_url || null,
    content_blocks: body.content_blocks,
    faq_items: body.faq_items,
    summary_items: body.summary_items,
    related_slugs: body.related_slugs,
    is_published: body.is_published,
    published_at: body.published_at || null,
    author: body.author,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const service = await createServiceClient();

  const cleanSlugPut = (body.slug as string).replace(/^\/+/, "").replace(/^blog\//, "");

  const { data, error } = await service.from("blog_posts").update({
    title: body.title,
    slug: cleanSlugPut,
    category: body.category,
    intro: body.intro,
    hero_image_url: body.hero_image_url || null,
    reading_time_minutes: body.reading_time_minutes,
    meta_title: body.meta_title || null,
    meta_description: body.meta_description || null,
    meta_keywords: body.meta_keywords || null,
    og_image_url: body.og_image_url || null,
    content_blocks: body.content_blocks,
    faq_items: body.faq_items,
    summary_items: body.summary_items,
    related_slugs: body.related_slugs,
    is_published: body.is_published,
    published_at: body.published_at || null,
    author: body.author,
  }).eq("id", body.id).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
