"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import Lightbox from "@/components/lightbox";
import ContactModal from "@/components/contact-modal";
import { MOCK_PHOTOGRAPHERS } from "@/lib/mock-data";
import { getMembership } from "@/lib/membership";
import type { Photographer } from "@/lib/types";
import type { Review } from "./page";
import TrustpilotBar from "@/components/trustpilot-bar";

const MAX_IMAGES_PER_CATEGORY = 10; // upload-limiet per categorie in dashboard

interface OtherPhotographer {
  id: string;
  slug: string;
  business_name: string;
  city: string | null;
  avatar_url: string | null;
}

interface Props {
  photographer: Photographer;
  reviews: Review[];
  otherPhotographers: OtherPhotographer[];
}

function Stars({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const px = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`${px} ${s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}


function Nav() {
  return (
    <div className="sticky top-0 z-50">
      <div className="bg-[#FCFAFF] border-b border-[#E9E7F0]">
        <nav className="px-6 py-3.5 flex items-center justify-between max-w-5xl mx-auto">
          <Link href="/">
            <Image src="/logo.png" alt="LensLab" width={120} height={32} className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Login</Link>
            <Link href="/aanmelden" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors font-medium">Get Started</Link>
          </div>
        </nav>
      </div>
      <TrustpilotBar />
    </div>
  );
}

// Canonieke categorieënlijst
const CANONICAL_CATEGORIES = [
  "Drone / Lucht", "Food & restaurant", "Afscheid", "Baby",
  "Evenementen", "Makelaars", "Bedrijf", "Huisdier",
  "Familie", "Portret", "Boudoir", "Bruiloft", "Zwangerschap", "Feest",
];

function normalizeCat(cat: string): string {
  return CANONICAL_CATEGORIES.find((c) => c.toLowerCase() === cat.toLowerCase()) ?? cat;
}

function normalizePortfolio(portfolio: Record<string, string[]> | null | undefined): Record<string, string[]> {
  if (!portfolio) return {};
  const result: Record<string, string[]> = {};
  for (const [key, images] of Object.entries(portfolio)) {
    const normalized = normalizeCat(key);
    result[normalized] = [...(result[normalized] ?? []), ...images];
  }
  return result;
}

export default function ProfileClient({ photographer, reviews, otherPhotographers }: Props) {
  const membership = getMembership(photographer.membership_tier);
  const normalizedPortfolio = normalizePortfolio(photographer.portfolio_by_category);
  const categories = photographer.specialties.slice(0, membership.maxCategories).map(normalizeCat);
  const [activeCategory, setActiveCategory] = useState("Alle");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showContact, setShowContact] = useState(false);

  // "Alle" = mix van alle categorieën (max 10 totaal), anders gefilterd per cat
  const categoryImages = activeCategory === "Alle"
    ? Object.values(normalizedPortfolio)
        .flat()
        .filter((v, i, a) => a.indexOf(v) === i)
    : (normalizedPortfolio[activeCategory] ?? []);

  // Hoofdfoto: hero bij "Alle", anders eerste foto van de geselecteerde categorie
  const mainImage = activeCategory === "Alle"
    ? (photographer.hero_image_url || categoryImages[0] || null)
    : (categoryImages[0] || photographer.hero_image_url || null);

  // Thumbnails: bij "Alle" met hero toon alle categoryImages, anders sla eerste over (al mainImage)
  const thumbnailImages = activeCategory === "Alle" && photographer.hero_image_url
    ? categoryImages
    : categoryImages.slice(1);

  // Lightbox afbeeldingen: mainImage voorop, daarna de rest
  const lightboxImages = [
    ...(mainImage ? [mainImage] : []),
    ...( activeCategory === "Alle" && photographer.hero_image_url ? categoryImages : categoryImages.slice(1)),
  ];

  useEffect(() => {
    trackEvent(photographer.id, "impression");
  }, [photographer.id]);

  const visibleOtherPhotographers = membership.showOtherPhotographers
    ? otherPhotographers
    : [];

  const initials = photographer.contact_name
    ? photographer.contact_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : photographer.business_name[0].toUpperCase();

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <Nav />

      {/* ── Terug knop ──────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <Link
          href="/beeldmakers"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Terug
        </Link>
      </div>

      {/* ── Profiel ─────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10 items-start">

          {/* Links: info */}
          <div>
            <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tight mb-3">
              {photographer.business_name}
            </h1>

            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <Stars rating={photographer.rating} />
                <span className="text-sm text-gray-400">
                  {photographer.rating.toFixed(1)}/5 gebaseerd op {photographer.review_count} reviews
                </span>
              </div>
            )}

            {photographer.bio && (
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{photographer.bio}</p>
            )}

            <hr className="border-gray-100 mb-5" />

            {/* Specialiteiten */}
            {categories.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-800 mb-2">Te boeken voor:</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((s) => (
                    <span key={s} className="text-xs bg-[#E9E7F0] text-gray-700 rounded-full px-3 py-1">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Regio's */}
            {photographer.regions.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-800 mb-2">Beschikbaar in:</p>
                <div className="flex flex-wrap gap-2">
                  {photographer.regions.map((r) => (
                    <span key={r} className="text-xs bg-[#E9E7F0] text-gray-700 rounded-full px-3 py-1">{r}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact persoon */}
            {photographer.contact_name && (
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  {photographer.avatar_url ? (
                    <Image src={photographer.avatar_url} alt={photographer.contact_name} width={44} height={44} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-500">{initials}</div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-400">Neem contact op met:</p>
                  <p className="text-sm font-semibold text-gray-900">{photographer.contact_name}</p>
                </div>
              </div>
            )}

            {/* CTA knoppen */}
            <div className="flex gap-3 mb-5">
              {membership.showMail && photographer.email && (
                <button
                  onClick={() => { trackEvent(photographer.id, "mail_click"); setShowContact(true); }}
                  className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full hover:bg-gray-700 transition-colors font-medium"
                >
                  Contact
                </button>
              )}
              {membership.showWebsite && photographer.website_url && (
                <button
                  onClick={() => { trackEvent(photographer.id, "website_click"); const url = photographer.website_url!; window.open(url.startsWith("http") ? url : `https://${url}`, "_blank"); }}
                  className="flex items-center gap-1.5 border border-gray-200 text-gray-700 text-sm px-5 py-2.5 rounded-full hover:border-gray-400 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  Website
                </button>
              )}
            </div>

            {/* Socials — alleen Plus/Premium */}
            {membership.showSocials && (
              <div className="flex gap-2">
                {photographer.instagram_url && (
                  <button onClick={() => { trackEvent(photographer.id, "instagram_click"); window.open(photographer.instagram_url!, "_blank"); }}
                    className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center hover:border-gray-400 transition-colors" aria-label="Instagram">
                    <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  </button>
                )}
                {photographer.linkedin_url && (
                  <button onClick={() => { trackEvent(photographer.id, "linkedin_click"); window.open(photographer.linkedin_url!, "_blank"); }}
                    className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center hover:border-gray-400 transition-colors" aria-label="LinkedIn">
                    <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Rechts: hero groot + portfolio klein */}
          <div>
            {/* Filter — label links, dropdown waarde rechts */}
            <div className="flex items-center justify-end gap-3 mb-2">
              <span className="text-sm text-gray-500">Filter op categorie</span>
              <div className="relative">
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="appearance-none bg-transparent text-sm font-semibold text-gray-900 pr-5 pl-0 py-0.5 cursor-pointer focus:outline-none"
                >
                  <option value="Alle">Alle</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Hoofdfoto — wisselt mee met geselecteerde categorie */}
            {mainImage ? (
              <button
                onClick={() => setLightboxIndex(0)}
                className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 mb-2 group cursor-zoom-in block"
              >
                <Image src={mainImage} alt={photographer.business_name} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" priority />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </button>
            ) : (
              <div className="w-full aspect-[4/3] bg-[#E9E7F0] flex items-center justify-center mb-2">
                <p className="text-sm text-gray-400">Geen foto&apos;s beschikbaar</p>
              </div>
            )}

            {/* Portfolio thumbnails */}
            {thumbnailImages.length > 0 && (
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {thumbnailImages.slice(0, 4).map((img, i) => {
                  const totalPhotos = 1 + thumbnailImages.length; // main + alle thumbnails
                  const remaining = totalPhotos - 4; // 4 al zichtbaar (1 main + 3 thumbs)
                  const showOverlay = i === 3 && totalPhotos > 4;
                  return (
                    <button
                      key={i}
                      onClick={() => setLightboxIndex(i + 1)}
                      className="relative aspect-square overflow-hidden bg-gray-100 group cursor-zoom-in"
                    >
                      <Image src={img} alt={`Foto ${i + 2}`} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.05]" />
                      {showOverlay ? (
                        <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">+ {remaining} foto&apos;s</span>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Reviews — alleen tonen als er reviews zijn ── */}
      {reviews.length > 0 && <section className="max-w-5xl mx-auto px-6 py-10 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Beoordelingen</h2>
        <p className="text-sm text-gray-500 mb-6">
          Ervaringen van klanten met {photographer.business_name}.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {reviews.slice(0, 3).map((r) => (
            <div key={r.id} className="bg-[#E9E7F0] rounded-2xl p-5">
              <Stars rating={r.rating} size="sm" />
              <p className="text-sm font-semibold text-gray-900 mt-2 mb-0.5">
                {r.review_date ? new Date(r.review_date).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }) : ""} door {r.reviewer_name}
              </p>
              {r.review_text && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-3">{r.review_text}</p>
              )}
              {r.source && (
                <p className="text-xs text-gray-400 mt-2">{r.source}</p>
              )}
            </div>
          ))}
        </div>
        {reviews.length > 3 && (
          <div className="text-right">
            <span className="text-sm text-gray-400">{reviews.length} recensies totaal</span>
          </div>
        )}
      </section>}

      {/* ── Andere creators — alleen Free ───────── */}
      {membership.showOtherPhotographers && visibleOtherPhotographers.length > 0 && (
      <section className="max-w-5xl mx-auto px-6 py-10 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Ontdek andere creators</h2>
        <p className="text-sm text-gray-500 mb-6">Bekijk profielen van fotografen en creatieven bij jou in de buurt.</p>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {visibleOtherPhotographers.map((p) => (
            <Link key={p.id} href={`/beeldmakers/${p.slug}`}
              className="flex-none bg-[#E9E7F0] rounded-2xl p-4 flex flex-col items-center text-center w-36 hover:shadow-md transition-shadow group">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300 mb-3">
                {p.avatar_url ? (
                  <Image src={p.avatar_url} alt={p.business_name} width={64} height={64} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-400">{p.business_name[0]}</div>
                )}
              </div>
              <p className="text-xs font-semibold text-gray-900 leading-tight group-hover:text-gray-600 transition-colors">{p.business_name}</p>
              {p.city && <p className="text-xs text-gray-400 mt-0.5">{p.city}</p>}
            </Link>
          ))}
        </div>
      </section>
      )}

      <footer className="border-t border-gray-100 py-8 px-6 text-center mt-4">
        <p className="text-sm text-gray-400">© 2025 LensLab — Alle beeldmakers in Nederland</p>
      </footer>

      {/* Contact modal */}
      {showContact && (
        <ContactModal
          photographerId={photographer.id}
          photographerName={photographer.business_name}
          onClose={() => setShowContact(false)}
        />
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          photographerName={photographer.business_name}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((i) => i !== null ? (i + 1) % lightboxImages.length : null)}
          onPrev={() => setLightboxIndex((i) => i !== null ? (i - 1 + lightboxImages.length) % lightboxImages.length : null)}
        />
      )}
    </div>
  );
}
