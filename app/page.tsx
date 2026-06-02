import Link from "next/link";
import Image from "next/image";
import SiteNav from "@/components/site-nav";

// Grid images van lenslab.design (lokaal opgeslagen in public/showcase/)
const GRID = [
  { col: 1, images: ["/showcase/grid-1-1.webp", "/showcase/grid-1-2.webp"] },
  { col: 2, images: ["/showcase/grid-2-1.webp", "/showcase/grid-2-2.webp"] },
  { col: 3, images: ["/showcase/grid-3-1.webp", "/showcase/grid-3-2.webp"] },
  { col: 4, images: ["/showcase/grid-4-1.webp", "/showcase/grid-4-2.webp"] },
  { col: 5, images: ["/showcase/grid-5-1.webp", "/showcase/grid-5-2.webp"] },
  { col: 6, images: ["/showcase/grid-6-1.webp", "/showcase/grid-6-2.webp"] },
];

export default function ChoicePage() {
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
            className="border border-gray-300 bg-white text-gray-700 text-sm font-medium px-6 py-3 rounded-full hover:border-gray-500 transition-colors"
          >
            Book a personal shoot
          </Link>
        </div>
      </section>

      {/* ── Showcase grid (exact zoals lenslab.design) ────── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {GRID.map((col) => (
            <div key={col.col} className="flex flex-col gap-3">
              {col.images.map((src, i) => (
                <div key={i} className="relative overflow-hidden rounded-lg bg-[#E9E7F0]">
                  <Image
                    src={src}
                    alt={`Showcase ${col.col}-${i + 1}`}
                    width={300}
                    height={i === 0 ? 380 : 280}
                    className="w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
