import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import BlogEditor from "../blog-editor";
import type { BlogPost } from "../blog-editor";

const EMPTY: BlogPost = {
  title: "",
  slug: "",
  category: "",
  intro: "",
  hero_image_url: "",
  reading_time_minutes: 5,
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  content_blocks: [],
  faq_items: [],
  summary_items: [],
  related_slugs: [],
  is_published: false,
  author: "LensLab",
};

export default async function NewBlogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) redirect("/login");

  return <BlogEditor initial={EMPTY} />;
}
