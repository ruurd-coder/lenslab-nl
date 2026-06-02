import Link from "next/link";
import Image from "next/image";
import SiteNav from "@/components/site-nav";

// 6 rijen, elk met 2 beelden + 1 video (grid-x-1, grid-x-2, grid-x-3.mp4)
const ROWS = [1, 2, 3, 4, 5, 6];

export default function ChoicePage() {
  return (
    <div className="min-h-screen bg-[#FCFAFF] overflow-hidden">
      <SiteNav />

      {/* ── Hero keuze ────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
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

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a
            href="https://lenslab.design"
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

      {/* ── Scrollende rijen ──────────────────────────────── */}
      <section className="pb-16 space-y-3">
        {ROWS.map((row, index) => {
          const reverse = index % 2 === 1;
          return (
            <MarqueeRow key={row} row={row} reverse={reverse} />
          );
        })}
      </section>

      {/* Ingebouwde CSS animatie */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 30s linear infinite;
        }
        .animate-marquee:hover,
        .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

function MarqueeRow({ row, reverse }: { row: number; reverse: boolean }) {
  // Elke rij: [img1, img2, video] — herhaal 4x voor naadloze loop
  const items = Array.from({ length: 4 }, (_, i) => i).flatMap(() => [
    { type: "image" as const, src: `/showcase/grid-${row}-1.webp` },
    { type: "image" as const, src: `/showcase/grid-${row}-2.webp` },
    { type: "video" as const, src: `/showcase/grid-${row}-3.mp4` },
  ]);

  return (
    <div className="flex overflow-hidden">
      <div className={`flex gap-3 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
        {items.map((item, i) => (
          <div
            key={i}
            className="relative flex-none w-64 h-44 overflow-hidden rounded-xl bg-[#E9E7F0]"
          >
            {item.type === "image" ? (
              <Image
                src={item.src}
                alt={`Showcase rij ${row}`}
                fill
                className="object-cover"
              />
            ) : (
              <video
                src={item.src}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
