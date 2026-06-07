import Link from "next/link";
import Image from "next/image";
import { createServiceClient } from "@/lib/supabase/server";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Blog — LensLab",
  description: "Tips, inspiratie en nieuws over fotografie, videografie en het vinden van de juiste beeldmaker.",
};

export default async function BlogPage() {
  const service = await createServiceClient();
  const { data: posts } = await service
    .from("blog_posts")
    .select("id, title, slug, category, intro, hero_image_url, reading_time_minutes, published_at, author")
    .eq("is_published", true)
    .or("platform.eq.lenslab.nl,platform.is.null")
    .order("published_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />

      <section className="max-w-5xl mx-auto px-5 md:px-8 pt-14 pb-6">
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Blog</p>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight" style={{ fontFamily: "var(--font-dm-sans)" }}>
          Inspiratie &amp; tips
        </h1>
      </section>

      <section className="max-w-5xl mx-auto px-5 md:px-8 pb-20">
        {!posts?.length ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-3xl mb-3">📝</p>
            <p>Binnenkort verschijnen hier onze eerste artikelen.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}
                className="bg-white rounded-3xl border border-[#E9E7F0] overflow-hidden hover:shadow-md transition-shadow group">
                {post.hero_image_url && (
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <Image src={post.hero_image_url} alt={post.title} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    {post.category && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-900 text-white px-2.5 py-1 rounded-full">
                        {post.category}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{post.reading_time_minutes} min leestijd</span>
                  </div>
                  <h2 className="text-base font-black text-gray-900 leading-snug mb-2 line-clamp-2">{post.title}</h2>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.intro}</p>
                  <p className="text-xs text-gray-400">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }) : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
