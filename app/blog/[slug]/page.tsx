import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import BlogFaq from "./blog-faq";
import type { ContentBlock } from "@/app/admin/blog/blog-editor";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await createServiceClient();
  const { data } = await service.from("blog_posts").select("title, meta_title, meta_description, meta_keywords, hero_image_url, og_image_url").eq("slug", slug).eq("is_published", true).single();
  if (!data) return {};
  const ogImage = data.og_image_url || data.hero_image_url;
  return {
    title: data.meta_title || `${data.title} | LensLab`,
    description: data.meta_description || undefined,
    keywords: data.meta_keywords || undefined,
    openGraph: {
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      images: ogImage ? [ogImage] : [],
    },
  };
}

function renderBlock(block: ContentBlock, idx: number) {
  switch (block.type) {
    case "h2":
      return <h2 key={block.id} id={`section-${idx}`} className="text-2xl sm:text-3xl font-black text-gray-900 mt-12 mb-4 leading-tight">{block.content}</h2>;
    case "h3":
      return <h3 key={block.id} className="text-xl font-bold text-gray-900 mt-8 mb-3">{block.content}</h3>;
    case "paragraph":
      return <p key={block.id} className="text-[16px] text-gray-700 leading-[1.75] mb-5">{block.content}</p>;
    case "bulletList":
      return (
        <ul key={block.id} className="mb-5 space-y-2">
          {(block.items || []).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-[16px] text-gray-700 leading-[1.75]">
              <span className="text-gray-400 mt-1 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "image":
      return block.url ? (
        <div key={block.id} className="my-8 rounded-2xl overflow-hidden">
          <Image src={block.url} alt={block.alt || ""} width={800} height={500} className="w-full object-cover" />
        </div>
      ) : null;
    default:
      return null;
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await createServiceClient();

  const { data: post } = await service
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  // Auto-generate TOC from h2 blocks
  const h2Blocks = (post.content_blocks as ContentBlock[]).filter(b => b.type === "h2");
  const toc = h2Blocks.map((b, i) => ({ number: String(i + 1).padStart(2, "0"), title: b.content || "", id: `section-${(post.content_blocks as ContentBlock[]).indexOf(b)}` }));

  // Related articles
  let relatedPosts: { title: string; slug: string; category: string; hero_image_url: string | null; reading_time_minutes: number }[] = [];
  if (post.related_slugs?.length) {
    const { data } = await service.from("blog_posts").select("title, slug, category, hero_image_url, reading_time_minutes").in("slug", post.related_slugs).eq("is_published", true);
    relatedPosts = data || [];
  }

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />

      <article className="max-w-2xl mx-auto px-5 md:px-8 pt-12 pb-20">
        {/* Categorie + leestijd */}
        <div className="flex items-center gap-3 mb-4">
          {post.category && (
            <span className="text-[11px] font-bold uppercase tracking-wider bg-gray-900 text-white px-3 py-1.5 rounded-full">
              {post.category}
            </span>
          )}
          <span className="text-sm text-gray-400">{post.reading_time_minutes} min leestijd</span>
        </div>

        {/* H1 */}
        <h1 className="text-3xl sm:text-4xl md:text-[2.6rem] font-black text-gray-900 leading-[1.1] tracking-tight mb-5" style={{ fontFamily: "var(--font-dm-sans)" }}>
          {post.title}
        </h1>

        {/* Intro */}
        <p className="text-[17px] text-gray-600 leading-relaxed mb-6">{post.intro}</p>

        <hr className="border-[#E9E7F0] mb-6" />

        {/* Auteur + datum */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[#E9E7F0] shrink-0">
            <Image src="/icon.png" alt="LensLab" width={36} height={36} className="object-cover w-full h-full" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{post.author}</p>
            {post.published_at && (
              <p className="text-xs text-gray-400">
                {new Date(post.published_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
          </div>
        </div>

        {/* Hero image */}
        {post.hero_image_url && (
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-8">
            <Image src={post.hero_image_url} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        {/* Table of Contents */}
        {toc.length > 0 && (
          <div className="bg-white border border-[#E9E7F0] rounded-2xl p-6 mb-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">TABLE OF CONTENTS</p>
            <ol className="space-y-2">
              {toc.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="text-xs text-gray-400 font-mono mt-0.5 shrink-0">{item.number}</span>
                  <a href={`#${item.id}`} className="text-sm text-gray-700 hover:text-gray-900 transition-colors">{item.title}</a>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Content blocks */}
        <div>
          {(post.content_blocks as ContentBlock[]).map((block, idx) => renderBlock(block, idx))}
        </div>

        {/* FAQ */}
        {post.faq_items?.length > 0 && (
          <div className="mt-16">
            <BlogFaq items={post.faq_items} />
          </div>
        )}

        {/* Samenvatting */}
        {post.summary_items?.length > 0 && (
          <div className="mt-10 bg-white border border-[#E9E7F0] rounded-2xl p-6">
            <h3 className="text-lg font-black text-gray-900 mb-4">Samengevat</h3>
            <ul className="space-y-2">
              {post.summary_items.map((item: string, i: number) => (
                <li key={i} className="text-sm text-gray-600 leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 bg-gray-900 rounded-2xl p-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">Klaar om te starten?</p>
          <h3 className="text-2xl font-black text-white mb-3">Vind de perfecte beeldmaker</h3>
          <p className="text-sm text-white/60 mb-6">Ontdek honderden gecureerde fotografen en videografen in Nederland.</p>
          <Link href="/beeldmakers" className="inline-block bg-white text-gray-900 text-sm font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors">
            Ga opzoek →
          </Link>
        </div>
      </article>

      {/* Gerelateerde artikelen */}
      {relatedPosts.length > 0 && (
        <section className="max-w-5xl mx-auto px-5 md:px-8 pb-20 border-t border-[#E9E7F0] pt-12">
          <h2 className="text-xl font-black text-gray-900 mb-6">Gerelateerde artikelen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {relatedPosts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`}
                className="bg-white rounded-2xl border border-[#E9E7F0] overflow-hidden hover:shadow-md transition-shadow">
                {p.hero_image_url && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image src={p.hero_image_url} alt={p.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-4">
                  {p.category && <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">{p.category}</span>}
                  <p className="text-sm font-bold text-gray-900 line-clamp-2">{p.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}
