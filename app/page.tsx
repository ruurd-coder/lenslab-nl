import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import TrustpilotBar from "@/components/trustpilot-bar";
import { getPageSeoOverrides } from "@/lib/seo-overrides";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const ov = await getPageSeoOverrides('nl:homepage');
  return {
    title: ov?.meta_title || "LensLab | Vind de beste fotograaf of videograaf in Nederland",
    description: ov?.meta_description || "Ontdek honderden professionele fotografen en videografen in jouw regio. Bekijk portfolio's, filter op specialiteit en neem direct contact op via LensLab.",
    alternates: { canonical: "https://lenslab.nl/" },
  };
}

const COLUMNS = [
  { items: [{ type: "image", src: "/showcase/grid-1-1.webp", ar: "1/1" }, { type: "image", src: "/showcase/grid-1-2.webp", ar: "2/3" }, { type: "video", src: "/showcase/grid-1-3.mp4" }], animation: "scroll-up 30s linear infinite", mobile: true },
  { items: [{ type: "image", src: "/showcase/grid-2-1.webp", ar: "1/1" }, { type: "image", src: "/showcase/grid-2-2.webp", ar: "2/3" }, { type: "video", src: "/showcase/grid-2-3.mp4" }], animation: "scroll-down 34s linear infinite", mobile: true },
  { items: [{ type: "image", src: "/showcase/grid-3-1.webp", ar: "1/1" }, { type: "image", src: "/showcase/grid-3-2.webp", ar: "2/3" }, { type: "video", src: "/showcase/grid-3-3.mp4" }], animation: "scroll-up 38s linear infinite", mobile: true },
  { items: [{ type: "image", src: "/showcase/grid-4-1.webp", ar: "1/1" }, { type: "image", src: "/showcase/grid-4-2.webp", ar: "2/3" }, { type: "video", src: "/showcase/grid-4-3.mp4" }], animation: "scroll-down 42s linear infinite", mobile: false },
  { items: [{ type: "image", src: "/showcase/grid-5-1.webp", ar: "1/1" }, { type: "image", src: "/showcase/grid-5-2.webp", ar: "2/3" }, { type: "video", src: "/showcase/grid-5-3.mp4" }], animation: "scroll-up 46s linear infinite", mobile: false },
  { items: [{ type: "image", src: "/showcase/grid-6-1.webp", ar: "1/1" }, { type: "image", src: "/showcase/grid-6-2.webp", ar: "2/3" }, { type: "video", src: "/showcase/grid-6-3.mp4" }], animation: "scroll-down 50s linear infinite", mobile: false },
];

export default function ChoicePage() {
  return (
    <div className="min-h-screen bg-[#FCFAFF] overflow-hidden">
      {/* Alleen logo — geen navigatie */}
      <div className="bg-[#FCFAFF] border-b border-[#E9E7F0]">
        <div className="px-6 py-3.5 flex items-center max-w-7xl mx-auto">
          <Link href="/">
            <Image src="/logo.png" alt="LensLab" width={120} height={32} className="h-8 w-auto" priority />
          </Link>
        </div>
      </div>
      <TrustpilotBar />

      {/* ── Hero ─────────────────────────────────────────── */}
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

      {/* ── Vertikaal scrollend grid ─────────────────────── */}
      <section
        className="mt-10 md:mt-12 overflow-hidden h-[380px] md:h-[520px]"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
        }}
      >
        <div className="flex gap-3 md:gap-4 h-full px-5 md:px-12 max-w-[1400px] mx-auto">
          {COLUMNS.map((col, colIndex) => {
            const allItems = [...col.items, ...col.items];
            return (
              <div
                key={colIndex}
                className={`flex-1 overflow-hidden ${!col.mobile ? "hidden md:block" : ""}`}
              >
                <div className="flex flex-col gap-4" style={{ animation: col.animation }}>
                  {allItems.map((item, i) => (
                    <div
                      key={i}
                      className="relative w-full overflow-hidden rounded-2xl flex-shrink-0"
                      style={{ aspectRatio: item.type === "image" ? item.ar : "9/16" }}
                    >
                      {item.type === "image" ? (
                        <Image
                          src={item.src}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="16vw"
                        />
                      ) : (
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          className="absolute inset-0 w-full h-full object-cover"
                        >
                          <source src={item.src} type="video/mp4" />
                        </video>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
