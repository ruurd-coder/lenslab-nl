import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import SiteNav from "@/components/site-nav";
import type { Photographer } from "@/lib/types";

export const revalidate = 3600;

const CATEGORIES = [
  { emoji: "☁️", name: "Drone / Lucht", slug: "drone-lucht" },
  { emoji: "🌶️", name: "Food & restaurant", slug: "food-restaurant" },
  { emoji: "🌹", name: "Afscheid", slug: "afscheid" },
  { emoji: "👶🏼", name: "Baby", slug: "baby" },
  { emoji: "🎤", name: "Evenementen", slug: "evenementen" },
  { emoji: "🏘️", name: "Makelaars", slug: "makelaars" },
  { emoji: "🏢", name: "Bedrijf", slug: "bedrijf" },
  { emoji: "🐶", name: "Huisdier", slug: "huisdier" },
  { emoji: "👨‍👨‍👧‍👧", name: "Familie", slug: "familie" },
  { emoji: "👱‍♀️", name: "Portret", slug: "portret" },
  { emoji: "💋", name: "Boudoir", slug: "boudoir" },
  { emoji: "💍", name: "Bruiloft", slug: "bruiloft" },
  { emoji: "🤰", name: "Zwangerschap", slug: "zwangerschap" },
  { emoji: "🥳", name: "Feest", slug: "feest" },
];

const CITIES = [
  { name: "Amsterdam", slug: "amsterdam" },
  { name: "Rotterdam", slug: "rotterdam" },
  { name: "Den Haag", slug: "den-haag" },
  { name: "Utrecht", slug: "utrecht" },
  { name: "Eindhoven", slug: "eindhoven" },
  { name: "Tilburg", slug: "tilburg" },
  { name: "Groningen", slug: "groningen" },
  { name: "Almere", slug: "almere" },
  { name: "Breda", slug: "breda" },
  { name: "Nijmegen", slug: "nijmegen" },
  { name: "Haarlem", slug: "haarlem" },
  { name: "Arnhem", slug: "arnhem" },
];

export default async function HomePage() {
  const supabase = await createClient();

  // Haal uitgelichte fotografen op (premium + plus)
  const { data: featured } = await supabase
    .from("photographers")
    .select("id, slug, business_name, hero_image_url, city, specialties, rating, membership_tier")
    .eq("is_published", true)
    .in("membership_tier", ["premium", "plus"])
    .order("rating", { ascending: false })
    .limit(8);

  // Stats
  const { count: totalCount } = await supabase
    .from("photographers")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  // Masonry grid foto's — haal hero images op van alle fotografen
  const { data: allPhotographers } = await supabase
    .from("photographers")
    .select("hero_image_url, business_name, slug")
    .eq("is_published", true)
    .not("hero_image_url", "is", null)
    .limit(12);

  const gridImages = allPhotographers || [];
  const totalPhotographers = totalCount || 0;

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Links: tekst */}
          <div>
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
              Voor mensen &amp; merken
            </p>
            <h1 className="text-6xl font-black text-gray-900 leading-[1.05] tracking-tight mb-6">
              Vind de beste<br />
              <span className="text-[#E55A2B]">fotograaf</span> in<br />
              Nederland
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
              Bekijk portfolio&apos;s van {totalPhotographers}+ professionele fotografen en videografen. Direct contact opnemen, geen tussenpersonen.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/beeldmakers"
                className="bg-gray-900 text-white text-sm px-6 py-3 rounded-full hover:bg-gray-700 transition-colors font-medium"
              >
                Bekijk alle beeldmakers
              </Link>
              <Link
                href="/login"
                className="border border-gray-200 text-gray-700 text-sm px-6 py-3 rounded-full hover:border-gray-400 transition-colors"
              >
                Beeldmaker? Meld je aan
              </Link>
            </div>
          </div>

          {/* Rechts: masonry foto grid */}
          <div className="grid grid-cols-3 gap-2 h-[480px]">
            {gridImages.slice(0, 6).map((p, i) => (
              <Link
                key={i}
                href={`/beeldmakers/${p.slug}`}
                className={`relative overflow-hidden group ${
                  i === 0 ? "row-span-2" : i === 4 ? "row-span-2" : ""
                }`}
              >
                {p.hero_image_url ? (
                  <Image
                    src={p.hero_image_url}
                    alt={p.business_name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-[#E9E7F0]" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-white/90 text-xs font-medium text-gray-800 px-2 py-1 rounded">
                    {p.business_name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────── */}
      <section className="bg-white border-y border-[#E9E7F0] py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 divide-x divide-[#E9E7F0] text-center">
            {[
              { value: `${totalPhotographers}+`, label: "Beeldmakers" },
              { value: "14", label: "Specialiteiten" },
              { value: "12", label: "Provincies" },
            ].map((stat) => (
              <div key={stat.label} className="py-2">
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Uitgelichte beeldmakers ───────────────────────── */}
      {featured && featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
                Geverifieerde beeldmakers
              </p>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                Een selectie voor jouw project
              </h2>
            </div>
            <Link
              href="/beeldmakers"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden md:block"
            >
              Bekijk alle →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {(featured as Partial<Photographer>[]).map((p) => (
              <Link
                key={p.id}
                href={`/beeldmakers/${p.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-[#E9E7F0] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#E9E7F0]">
                  {p.hero_image_url && (
                    <Image
                      src={p.hero_image_url}
                      alt={p.business_name || ""}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-4">
                  <p className="font-bold text-gray-900 text-sm">{p.business_name}</p>
                  {p.city && <p className="text-xs text-gray-400 mt-0.5">{p.city}</p>}
                  {p.specialties && p.specialties.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">{p.specialties[0]}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Categorieën ───────────────────────────────────── */}
      <section className="bg-white border-y border-[#E9E7F0] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
              Specialiteiten
            </p>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              Wat zoek je?
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categorie/${cat.slug}`}
                className="bg-[#FCFAFF] border border-[#E9E7F0] rounded-2xl p-4 text-center hover:border-gray-400 hover:shadow-sm transition-all group"
              >
                <span className="text-2xl block mb-2">{cat.emoji}</span>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 leading-tight block">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Steden ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
            Locaties
          </p>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">
            Fotografen bij jou in de buurt
          </h2>
        </div>

        <div className="flex flex-wrap gap-3">
          {CITIES.map((city) => (
            <Link
              key={city.slug}
              href={`/locatie/${city.slug}`}
              className="bg-white border border-[#E9E7F0] text-gray-700 text-sm font-medium px-5 py-2.5 rounded-full hover:border-gray-400 hover:shadow-sm transition-all"
            >
              {city.name}
            </Link>
          ))}
          <Link
            href="/beeldmakers"
            className="bg-[#E9E7F0] text-gray-600 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-200 transition-all"
          >
            Alle locaties →
          </Link>
        </div>
      </section>

      {/* ── Hoe werkt het ─────────────────────────────────── */}
      <section className="bg-white border-y border-[#E9E7F0] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
            Hoe het werkt
          </p>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-12">
            In drie stappen jouw beeldmaker
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Zoek & filter", desc: "Zoek op specialiteit, locatie of type. Filter op wat bij jouw project past." },
              { step: "02", title: "Bekijk portfolio's", desc: "Vergelijk stijlen, lees reviews en check beschikbaarheid direct op het profiel." },
              { step: "03", title: "Neem contact op", desc: "Stuur de beeldmaker direct een bericht. Geen tussenpersonen, geen extra kosten." },
            ].map((item) => (
              <div key={item.step} className="text-left">
                <span className="text-5xl font-black text-[#E9E7F0]">{item.step}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA voor beeldmakers ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gray-900 rounded-3xl p-12 text-center">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
            Ben jij beeldmaker?
          </p>
          <h2 className="text-4xl font-black text-white tracking-tight mb-4">
            Zet jouw portfolio online
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Bereik nieuwe klanten via LensLab. Gratis profiel aanmaken, betaalde upgrades voor meer zichtbaarheid.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/login"
              className="bg-white text-gray-900 text-sm font-medium px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              Gratis aanmelden
            </Link>
            <Link
              href="/beeldmakers"
              className="border border-gray-600 text-white text-sm px-6 py-3 rounded-full hover:border-gray-400 transition-colors"
            >
              Bekijk voorbeeldprofielen
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="bg-white border-t border-[#E9E7F0] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <Image src="/logo.png" alt="LensLab" width={100} height={28} className="h-7 w-auto mb-4" />
              <p className="text-sm text-gray-400 leading-relaxed">
                Het platform voor fotografen en videografen in Nederland.
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 mb-3">Platform</p>
              <div className="space-y-2">
                <Link href="/beeldmakers" className="block text-sm text-gray-400 hover:text-gray-700">Beeldmakers</Link>
                <Link href="/categorie/bruiloft" className="block text-sm text-gray-400 hover:text-gray-700">Bruiloftsfotograaf</Link>
                <Link href="/categorie/portret" className="block text-sm text-gray-400 hover:text-gray-700">Portretfotograaf</Link>
                <Link href="/categorie/bedrijf" className="block text-sm text-gray-400 hover:text-gray-700">Bedrijfsfotograaf</Link>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 mb-3">Steden</p>
              <div className="space-y-2">
                <Link href="/locatie/amsterdam" className="block text-sm text-gray-400 hover:text-gray-700">Amsterdam</Link>
                <Link href="/locatie/rotterdam" className="block text-sm text-gray-400 hover:text-gray-700">Rotterdam</Link>
                <Link href="/locatie/den-haag" className="block text-sm text-gray-400 hover:text-gray-700">Den Haag</Link>
                <Link href="/locatie/utrecht" className="block text-sm text-gray-400 hover:text-gray-700">Utrecht</Link>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 mb-3">Beeldmakers</p>
              <div className="space-y-2">
                <Link href="/login" className="block text-sm text-gray-400 hover:text-gray-700">Inloggen</Link>
                <Link href="/login" className="block text-sm text-gray-400 hover:text-gray-700">Aanmelden</Link>
                <a href="mailto:info@lenslab.nl" className="block text-sm text-gray-400 hover:text-gray-700">Contact</a>
              </div>
            </div>
          </div>
          <div className="border-t border-[#E9E7F0] pt-6 flex items-center justify-between">
            <p className="text-xs text-gray-400">© 2025 LensLab — Alle rechten voorbehouden</p>
            <div className="flex gap-4">
              <a href="https://instagram.com/lenslab.nl" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-700 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://linkedin.com/company/lenslab" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-700 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
