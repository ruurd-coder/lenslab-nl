import Link from "next/link";
import Image from "next/image";
import { createServiceClient } from "@/lib/supabase/server";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Blog — LensLab",
  description: "Tips, inspiratie en nieuws over fotografie, videografie en het vinden van de juiste beeldmaker.",
};

const CATEGORY_FILTERS = [
  "Alle blogs",
  "Fotografie",
  "Videografie",
  "E-commerce & Webshop",
  "Marketing & Content",
];

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const service = await createServiceClient();

  let query = service
    .from("blog_posts")
    .select("id, title, slug, category, intro, hero_image_url, reading_time_minutes, published_at")
    .eq("is_published", true)
    .or("platform.eq.lenslab.nl,platform.is.null")
    .order("published_at", { ascending: false });

  if (category && category !== "Alle blogs") {
    query = query.ilike("category", `%${category}%`);
  }

  const { data: posts } = await query;

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />

      {/* Hero header */}
      <section className="max-w-6xl mx-auto px-5 md:px-10 pt-14 pb-8">
        <p className="text-[11px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-5">
          Alles over beeld
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-[1.05] tracking-tight max-w-3xl mb-10"
          style={{ fontFamily: "var(--font-dm-sans)" }}>
          Inzichten voor iedereen die gelooft in de kracht van sterke visuals.
        </h1>

        {/* Categorie filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map((cat) => {
            const isActive = (!category && cat === "Alle blogs") || category === cat;
            return (
              <Link
                key={cat}
                href={cat === "Alle blogs" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`}
                className={`text-sm px-4 py-2 rounded-full border transition-colors font-medium ${
                  isActive
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Blog cards */}
      <section className="max-w-6xl mx-auto px-5 md:px-10 pb-24">
        {!posts?.length ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-3xl mb-3">📝</p>
            <p>Geen artikelen gevonden{category ? ` in "${category}"` : ""}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex bg-[#EEE8F8] rounded-3xl overflow-hidden hover:bg-[#E6DEEF] transition-colors min-h-[280px]"
              >
                {/* Tekst links */}
                <div className="flex flex-col justify-between p-7 flex-1 min-w-0">
                  <div>
                    {post.category && (
                      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-3">
                        {post.category}
                      </p>
                    )}
                    <h2 className="text-base sm:text-lg font-black text-gray-900 leading-tight mb-3 line-clamp-3"
                      style={{ fontFamily: "var(--font-dm-sans)" }}>
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                      {post.intro}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">
                    {post.reading_time_minutes} min leestijd
                    {post.published_at && (
                      <> · {new Date(post.published_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}</>
                    )}
                  </p>
                </div>

                {/* Foto rechts */}
                {post.hero_image_url && (
                  <div className="relative w-44 sm:w-52 shrink-0 overflow-hidden">
                    <Image
                      src={post.hero_image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
