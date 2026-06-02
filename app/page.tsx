"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SiteNav from "@/components/site-nav";

const PROVINCES = [
  { name: "Noord-Holland", slug: "noord-holland", image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=600&h=400&fit=crop" },
  { name: "Groningen", slug: "groningen", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop" },
  { name: "Utrecht", slug: "utrecht", image: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=600&h=400&fit=crop" },
  { name: "Noord-Brabant", slug: "noord-brabant", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&h=400&fit=crop" },
  { name: "Friesland", slug: "friesland", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop" },
  { name: "Limburg", slug: "limburg", image: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=600&h=400&fit=crop" },
];

const TESTIMONIALS = [
  {
    company: "Spektre",
    quote: "LensLab heeft mij last minute perfect geholpen met de juiste fotograaf. Snel en top geregeld!",
    name: "Thijs Visser",
    title: "CCO & Co-Founder, Spektre",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop",
  },
  {
    company: "Studio Noord",
    quote: "Binnen een dag de perfecte fotograaf gevonden voor ons teamportret. Geweldige kwaliteit!",
    name: "Laura de Vries",
    title: "Marketing Manager, Studio Noord",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop",
  },
  {
    company: "Bloom Agency",
    quote: "Via LensLab vinden wij consistent topfotografen voor al onze klanten. Aanrader!",
    name: "Mark Janssen",
    title: "Creative Director, Bloom Agency",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop",
  },
];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/beeldmakers?q=${encodeURIComponent(search)}`);
    } else {
      router.push("/beeldmakers");
    }
  };

  const testimonial = TESTIMONIALS[testimonialIndex];

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
          Zo gevonden, zo geboekt
        </p>
        <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tight mb-8">
          Vind de perfecte foto-<br />of videograaf
        </h1>

        {/* Zoekbalk */}
        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Geef jouw categorie, of locatie door"
            className="w-full bg-white border border-[#E9E7F0] rounded-full px-6 py-4 pr-14 text-sm text-gray-700 shadow-sm focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </section>

      {/* ── Uitgelichte creators ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-black text-gray-900 mb-1">
          Uitgelichte creators voor jouw opdracht
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Bekijk onze beste fotografen en videografen op een rij
        </p>

        {/* Tijdelijke kaartjes met mock data tot echte data geladen is */}
        <FeaturedPhotographers />
      </section>

      {/* ── Provincies ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">
              Vind een ervaren fotograaf in jouw provincie
            </h2>
            <p className="text-sm text-gray-400">
              Van Groningen tot Zeeland, jouw fotograaf staat om de hoek
            </p>
          </div>
          <Link
            href="/beeldmakers"
            className="hidden md:flex items-center gap-1.5 border border-gray-200 text-gray-700 text-sm px-4 py-2 rounded-full hover:border-gray-400 transition-colors"
          >
            Bekijk alle (12)
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PROVINCES.map((province) => (
            <Link
              key={province.slug}
              href={`/locatie/${province.slug}`}
              className="relative aspect-[4/3] overflow-hidden group rounded-sm"
            >
              <Image
                src={province.image}
                alt={province.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="absolute bottom-3 left-3">
                <span className="text-white font-bold text-sm drop-shadow">{province.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Testimonial ───────────────────────────────────── */}
      <section className="bg-white border-y border-[#E9E7F0] py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-sm font-bold text-gray-400 mb-6">{testimonial.company}</p>
          <blockquote className="text-2xl font-bold text-gray-900 leading-snug mb-8">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
              <Image src={testimonial.avatar} alt={testimonial.name} width={40} height={40} className="object-cover" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
              <p className="text-xs text-gray-400">{testimonial.title}</p>
            </div>
          </div>

          {/* Carousel dots */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={() => setTestimonialIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="text-gray-300 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === testimonialIndex ? "bg-gray-900" : "bg-gray-300"}`}
                />
              ))}
            </div>
            <button
              onClick={() => setTestimonialIndex((i) => (i + 1) % TESTIMONIALS.length)}
              className="text-gray-300 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="bg-white border-t border-[#E9E7F0] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <Image src="/logo.png" alt="LensLab" width={100} height={28} className="h-7 w-auto mb-3" />
              <p className="text-xs text-gray-400 mb-4">Freeze time, frame life</p>
              <div className="flex gap-3">
                <a href="https://instagram.com/lenslab.nl" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-700 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://linkedin.com/company/lenslab" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-700 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://wa.me/31612345678" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-700 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Opdrachtgevers</p>
              <div className="space-y-2">
                <Link href="/beeldmakers" className="block text-sm text-gray-400 hover:text-gray-700">Zo werkt LensLab</Link>
                <Link href="/beeldmakers" className="block text-sm text-gray-400 hover:text-gray-700">Vind je beeldmaker</Link>
                <Link href="/beeldmakers" className="block text-sm text-gray-400 hover:text-gray-700">Laat ons AI zoeken</Link>
                <Link href="/beeldmakers" className="block text-sm text-gray-400 hover:text-gray-700">Laat ons voor je posten</Link>
                <Link href="/beeldmakers" className="block text-sm text-gray-400 hover:text-gray-700">Boek met vertrouwen</Link>
                <Link href="/beeldmakers" className="block text-sm text-gray-400 hover:text-gray-700">Meest gestelde vragen</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Beeldmakers</p>
              <div className="space-y-2">
                <Link href="/login" className="block text-sm text-gray-400 hover:text-gray-700">Aanmelden</Link>
                <Link href="/login" className="block text-sm text-gray-400 hover:text-gray-700">Log in</Link>
                <Link href="/beeldmakers" className="block text-sm text-gray-400 hover:text-gray-700">Zo werkt LensLab</Link>
                <Link href="/beeldmakers" className="block text-sm text-gray-400 hover:text-gray-700">Over reviews</Link>
                <Link href="/dashboard" className="block text-sm text-gray-400 hover:text-gray-700">Verificeer profiel</Link>
                <Link href="/beeldmakers" className="block text-sm text-gray-400 hover:text-gray-700">FAQ voor beeldmakers</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Over LensLab</p>
              <div className="space-y-2">
                <Link href="/beeldmakers" className="block text-sm text-gray-400 hover:text-gray-700">Over ons</Link>
                <a href="mailto:info@lenslab.nl" className="block text-sm text-gray-400 hover:text-gray-700">Contact</a>
              </div>
            </div>
          </div>
          <div className="border-t border-[#E9E7F0] pt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-gray-400">Copyright © 2025 LensLab. All rights reserved.</p>
            <div className="flex gap-4 text-xs text-gray-400">
              <a href="#" className="hover:text-gray-700">Laan de Ring 62, 2289GA Rijswijk</a>
              <a href="#" className="hover:text-gray-700">Algemene voorwaarden</a>
              <a href="#" className="hover:text-gray-700">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Uitgelichte fotografen (client-side laden) ─────────────────────
function FeaturedPhotographers() {
  // Tijdelijk mock — wordt straks via server component geladen
  const MOCK = [
    { name: "Hoven Fotografie", slug: "hoven-fotografie", contact: "Jill van den Hoven", tags: ["Familie", "Zwangerschap"], image: "https://images.unsplash.com/photo-1511895426328-dc8714191011?w=400&h=400&fit=crop", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop" },
    { name: "Pret met Jet fotografie", slug: "jill-van-den-hoven", contact: "Jill van den Hoven", tags: ["Familie", "Zwangerschap"], image: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=400&h=400&fit=crop", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop" },
    { name: "Bas foto- en film", slug: "wahid-fayumzadah", contact: "Jill van den Hoven", tags: ["Familie", "Zwangerschap"], image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop" },
    { name: "Donker Fotografie", slug: "conchita-hamann", contact: "Jill van den Hoven", tags: ["Familie", "Zwangerschap"], image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {MOCK.map((p) => (
        <Link key={p.slug} href={`/beeldmakers/${p.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-[#E9E7F0] shadow-sm hover:shadow-md transition-shadow">
          <div className="relative aspect-square overflow-hidden">
            <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <div className="p-4">
            <p className="font-bold text-gray-900 text-sm mb-1">{p.name}</p>
            <p className="text-xs text-gray-400 mb-3 line-clamp-2">
              Hallo, ik ben Jill (26) en de trotse moeder van een dochter. Ik heb gestudeerd aan de Foto Academie en de Fotovak... <span className="font-semibold text-gray-600">lees meer</span>
            </p>
            <p className="text-xs text-gray-400 mb-1.5">Te boeken voor:</p>
            <div className="flex gap-1.5 mb-3">
              {p.tags.map((t) => <span key={t} className="text-xs bg-[#E9E7F0] text-gray-600 rounded-full px-2.5 py-0.5">{t}</span>)}
            </div>
            <hr className="border-[#E9E7F0] mb-3" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-200 shrink-0">
                <Image src={p.avatar} alt={p.contact} width={28} height={28} className="object-cover" />
              </div>
              <div>
                <p className="text-xs text-gray-400 leading-none">Bekijk het profiel van:</p>
                <p className="text-xs font-semibold text-gray-800">{p.contact}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
