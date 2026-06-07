import { redirect, notFound } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import BlogEditor from "../blog-editor";

interface Props { params: Promise<{ id: string }> }

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) redirect("/login");

  const service = await createServiceClient();
  const { data: post } = await service.from("blog_posts").select("*").eq("id", id).single();
  if (!post) notFound();

  return <BlogEditor initial={{
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.category || "",
    intro: post.intro || "",
    hero_image_url: post.hero_image_url || "",
    reading_time_minutes: post.reading_time_minutes || 5,
    meta_title: post.meta_title || "",
    meta_description: post.meta_description || "",
    meta_keywords: post.meta_keywords || "",
    og_image_url: post.og_image_url || "",
    content_blocks: post.content_blocks || [],
    faq_items: post.faq_items || [],
    summary_items: post.summary_items || [],
    related_slugs: post.related_slugs || [],
    is_published: post.is_published,
    author: post.author || "LensLab",
    listing_image_url: post.listing_image_url || "",
  }} />;
}
