"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import TrustpilotBar from "@/components/trustpilot-bar";

const CATEGORY_GROUPS = [
  {
    heading: "Persoonlijk",
    items: [
      { name: "Portret", slug: "portret" },
      { name: "Familie", slug: "familie" },
      { name: "Baby", slug: "baby" },
      { name: "Zwangerschap", slug: "zwangerschap" },
      { name: "Boudoir", slug: "boudoir" },
    ],
  },
  {
    heading: "Speciale momenten",
    items: [
      { name: "Bruiloft", slug: "bruiloft" },
      { name: "Afscheid", slug: "afscheid" },
      { name: "Feest", slug: "feest" },
      { name: "Evenementen", slug: "evenementen" },
    ],
  },
  {
    heading: "Zakelijk",
    items: [
      { name: "Bedrijf", slug: "bedrijf" },
      { name: "Makelaars", slug: "makelaars" },
      { name: "Food & restaurant", slug: "food-restaurant" },
    ],
  },
  {
    heading: "Overige",
    items: [
      { name: "Huisdier", slug: "huisdier" },
      { name: "Drone / Lucht", slug: "drone-lucht" },
    ],
  },
];

const PROVINCES = [
  { name: "Noord-Holland", slug: "noord-holland", cities: ["Amsterdam", "Haarlem", "Zaandam", "Hoofddorp"], citySlugs: ["amsterdam", "haarlem", "zaandam", "hoofddorp"] },
  { name: "Zuid-Holland", slug: "zuid-holland", cities: ["Rotterdam", "Den Haag", "Leiden", "Dordrecht"], citySlugs: ["rotterdam", "den-haag", "leiden", "dordrecht"] },
  { name: "Utrecht", slug: "utrecht-provincie", cities: ["Utrecht", "Amersfoort", "Veenendaal", "Nieuwegein"], citySlugs: ["utrecht", "amersfoort", "veenendaal", "nieuwegein"] },
  { name: "Noord-Brabant", slug: "noord-brabant", cities: ["Eindhoven", "Tilburg", "Breda", "'s-Hertogenbosch"], citySlugs: ["eindhoven", "tilburg", "breda", "s-hertogenbosch"] },
  { name: "Gelderland", slug: "gelderland", cities: ["Nijmegen", "Arnhem", "Apeldoorn", "Ede"], citySlugs: ["nijmegen", "arnhem", "apeldoorn", "ede"] },
  { name: "Overijssel", slug: "overijssel", cities: ["Enschede", "Zwolle", "Deventer", "Hengelo"], citySlugs: ["enschede", "zwolle", "deventer", "hengelo"] },
  { name: "Groningen", slug: "groningen", cities: ["Groningen", "Hoogezand"], citySlugs: ["groningen", "hoogezand"] },
  { name: "Friesland", slug: "friesland", cities: ["Leeuwarden", "Drachten", "Heerenveen"], citySlugs: ["leeuwarden", "drachten", "heerenveen"] },
  { name: "Limburg", slug: "limburg", cities: ["Maastricht", "Venlo", "Heerlen", "Roermond"], citySlugs: ["maastricht", "venlo", "heerlen", "roermond"] },
  { name: "Flevoland", slug: "flevoland", cities: ["Almere", "Lelystad"], citySlugs: ["almere", "lelystad"] },
  { name: "Zeeland", slug: "zeeland", cities: ["Middelburg", "Vlissingen"], citySlugs: ["middelburg", "vlissingen"] },
  { name: "Drenthe", slug: "drenthe", cities: ["Assen", "Emmen"], citySlugs: ["assen", "emmen"] },
];

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return { open, setOpen, ref };
}

export default function SiteNav() {
  const locaties = useDropdown();
  const gelegenheid = useDropdown();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<"locaties" | "gelegenheid" | null>(null);

  const closeMobile = () => { setMobileOpen(false); setMobileSection(null); };

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <div className="sticky top-0 z-50">
      <div className="bg-[#FCFAFF] border-b border-[#E9E7F0]">
        <nav className="px-5 py-3.5 flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" onClick={closeMobile}>
            <Image src="/logo.png" alt="LensLab" width={120} height={32} className="h-8 w-auto" priority />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {/* Locaties */}
            <div ref={locaties.ref} className="relative">
              <button
                onClick={() => { locaties.setOpen(!locaties.open); gelegenheid.setOpen(false); }}
                className={`flex items-center gap-1 text-sm transition-colors ${locaties.open ? "text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
              >
                Locaties
                <svg className={`w-3.5 h-3.5 transition-transform ${locaties.open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {locaties.open && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white rounded-2xl shadow-xl border border-[#E9E7F0] p-6 w-[760px] z-50">
                  <div className="grid grid-cols-4 gap-x-6 gap-y-5">
                    {PROVINCES.map((province) => (
                      <div key={province.slug}>
                        <Link href={`/locatie/${province.slug}`} onClick={() => locaties.setOpen(false)} className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2 hover:text-gray-600 transition-colors">
                          {province.name}
                        </Link>
                        <ul className="space-y-1">
                          {province.cities.slice(0, 4).map((city, i) => (
                            <li key={city}>
                              <Link href={`/locatie/${province.citySlugs[i]}`} onClick={() => locaties.setOpen(false)} className="text-sm text-gray-500 hover:text-gray-900 transition-colors block">{city}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#E9E7F0]">
                    <Link href="/locaties" onClick={() => locaties.setOpen(false)} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Bekijk alle locaties →</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Gelegenheid */}
            <div ref={gelegenheid.ref} className="relative">
              <button
                onClick={() => { gelegenheid.setOpen(!gelegenheid.open); locaties.setOpen(false); }}
                className={`flex items-center gap-1 text-sm transition-colors ${gelegenheid.open ? "text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
              >
                Gelegenheid
                <svg className={`w-3.5 h-3.5 transition-transform ${gelegenheid.open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {gelegenheid.open && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white rounded-2xl shadow-xl border border-[#E9E7F0] p-6 w-[520px] z-50">
                  <div className="grid grid-cols-4 gap-x-6 gap-y-5">
                    {CATEGORY_GROUPS.map((group) => (
                      <div key={group.heading}>
                        <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">{group.heading}</p>
                        <ul className="space-y-1">
                          {group.items.map((item) => (
                            <li key={item.slug}>
                              <Link href={`/categorie/${item.slug}`} onClick={() => gelegenheid.setOpen(false)} className="text-sm text-gray-500 hover:text-gray-900 transition-colors block">{item.name}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/fotografen" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Alle fotografen</Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Login</Link>
            <Link href="/aanmelden" className="text-sm bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-gray-700 transition-colors font-medium">Get Started</Link>
          </div>

          {/* Mobile: CTA + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/aanmelden" className="text-xs bg-gray-900 text-white px-4 py-2 rounded-full font-medium">Get Started</Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Menu">
              {mobileOpen ? (
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </div>
      <TrustpilotBar />

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[57px] z-40 bg-[#FCFAFF] overflow-y-auto md:hidden">
          <div className="px-5 py-6 space-y-1">
            {!mobileSection ? (
              <>
                <button onClick={() => setMobileSection("locaties")} className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-[#E9E7F0] text-gray-800 font-medium text-sm transition-colors">
                  Locaties
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
                <button onClick={() => setMobileSection("gelegenheid")} className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-[#E9E7F0] text-gray-800 font-medium text-sm transition-colors">
                  Gelegenheid
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
                <Link href="/fotografen" onClick={closeMobile} className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-[#E9E7F0] text-gray-800 font-medium text-sm transition-colors">
                  Alle fotografen
                </Link>
                <div className="border-t border-[#E9E7F0] my-3" />
                <Link href="/login" onClick={closeMobile} className="flex items-center px-4 py-3.5 rounded-xl hover:bg-[#E9E7F0] text-gray-600 text-sm transition-colors">
                  Inloggen
                </Link>
                <Link href="/aanmelden" onClick={closeMobile} className="flex items-center justify-center px-4 py-3.5 rounded-xl bg-gray-900 text-white font-medium text-sm mt-2">
                  Aanmelden als beeldmaker
                </Link>
              </>
            ) : mobileSection === "locaties" ? (
              <>
                <button onClick={() => setMobileSection(null)} className="flex items-center gap-2 text-sm text-gray-500 mb-4 px-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Terug
                </button>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide px-4 mb-3">Locaties</p>
                {PROVINCES.map((province) => (
                  <Link key={province.slug} href={`/locatie/${province.slug}`} onClick={closeMobile} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#E9E7F0] text-gray-800 text-sm transition-colors">
                    {province.name}
                  </Link>
                ))}
                <div className="border-t border-[#E9E7F0] mt-3 pt-3">
                  <Link href="/locaties" onClick={closeMobile} className="px-4 py-3 text-sm text-gray-500 block">Bekijk alle locaties →</Link>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => setMobileSection(null)} className="flex items-center gap-2 text-sm text-gray-500 mb-4 px-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Terug
                </button>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide px-4 mb-3">Gelegenheid</p>
                {CATEGORY_GROUPS.map((group) => (
                  <div key={group.heading}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pt-3 pb-1">{group.heading}</p>
                    {group.items.map((item) => (
                      <Link key={item.slug} href={`/categorie/${item.slug}`} onClick={closeMobile} className="flex items-center px-4 py-2.5 rounded-xl hover:bg-[#E9E7F0] text-gray-800 text-sm transition-colors">
                        {item.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
