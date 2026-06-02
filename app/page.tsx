import Link from "next/link";
import Image from "next/image";
import SiteNav from "@/components/site-nav";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600;

// Masonry grid foto's van echte fotografen
async function getGridImages() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("photographers")
      .select("hero_image_url, business_name, slug")
      .eq("is_published", true)
      .not("hero_image_url", "is", null)
      .limit(12);
    return data || [];
  } catch {
    return [];
  }
}

export default async function ChoicePage() {
  const images = await getGridImages();

  // Fallback placeholder images als er nog geen echte zijn
  const fallbackImages = [
    { hero_image_url: "https://images.unsplash.com/photo-1511895426328-dc8714191011?w=400&h=600&fit=crop", business_name: "Familie", slug: "familie" },
    { hero_image_url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=400&fit=crop", business_name: "Portret", slug: "portret" },
    { hero_image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop", business_name: "Bruiloft", slug: "bruiloft" },
    { hero_image_url: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop", business_name: "Zwangerschap", slug: "zwangerschap" },
    { hero_image_url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=600&fit=crop", business_name: "Newborn", slug: "newborn" },
    { hero_image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop", business_name: "Bedrijf", slug: "bedrijf" },
    { hero_image_url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=500&fit=crop", business_name: "Video", slug: "video" },
    { hero_image_url: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=400&h=400&fit=crop", business_name: "Familie", slug: "familie-2" },
    { hero_image_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop", business_name: "Mode", slug: "mode" },
    { hero_image_url: "https://images.unsplash.com/photo-1473614447301-18eda9e8f5b7?w=400&h=400&fit=crop", business_name: "Feest", slug: "feest" },
    { hero_image_url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=500&fit=crop", business_name: "Baby", slug: "baby" },
    { hero_image_url: "https://images.unsplash.com/photo-1576153192396-180ecef2a715?w=400&h=400&fit=crop", business_name: "Food", slug: "food" },
  ];

  const gridImages = images.length >= 6 ? images : fallbackImages;

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />

      {/* ── Hero keuze ────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
          For people &amp; brands
        </p>
        <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tight mb-4">
          Choose your visual experience
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          From personal photoshoots to scalable business content. Create high-quality visuals
          tailored to your story, brand, or next big idea.
        </p>

        {/* CTA knoppen */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a
            href="https://lenslab.tech"
            className="bg-gray-900 text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-gray-700 transition-colors"
          >
            Create business content
          </a>
          <Link
            href="/beeldmakers"
            className="border border-gray-300 text-gray-700 text-sm font-medium px-6 py-3 rounded-full hover:border-gray-500 hover:bg-white transition-colors bg-white/50"
          >
            Book a personal shoot
          </Link>
        </div>
      </section>

      {/* ── Masonry foto grid ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 gap-3 space-y-3">
          {gridImages.map((img, i) => (
            <Link
              key={i}
              href={`/beeldmakers`}
              className="block overflow-hidden group break-inside-avoid"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={img.hero_image_url!}
                  alt={img.business_name}
                  width={300}
                  height={i % 3 === 0 ? 400 : i % 3 === 1 ? 280 : 340}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
