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
  {
    name: "Noord-Holland", slug: "noord-holland",
    cities: ["Amsterdam", "Haarlem", "Zaandam", "Hoofddorp", "Alkmaar", "Hilversum", "Amstelveen", "Purmerend"],
    citySlugs: ["amsterdam", "haarlem", "zaandam", "hoofddorp", "alkmaar", "hilversum", "amstelveen", "purmerend"],
  },
  {
    name: "Zuid-Holland", slug: "zuid-holland",
    cities: ["Rotterdam", "Den Haag", "Leiden", "Dordrecht", "Delft", "Zoetermeer", "Gouda", "Schiedam"],
    citySlugs: ["rotterdam", "den-haag", "leiden", "dordrecht", "delft", "zoetermeer", "gouda", "schiedam"],
  },
  {
    name: "Utrecht", slug: "utrecht-provincie",
    cities: ["Utrecht", "Amersfoort", "Veenendaal", "Nieuwegein", "Zeist", "Houten"],
    citySlugs: ["utrecht", "amersfoort", "veenendaal", "nieuwegein", "zeist", "houten"],
  },
  {
    name: "Noord-Brabant", slug: "noord-brabant",
    cities: ["Eindhoven", "Tilburg", "Breda", "'s-Hertogenbosch", "Helmond", "Oss"],
    citySlugs: ["eindhoven", "tilburg", "breda", "s-hertogenbosch", "helmond", "oss"],
  },
  {
    name: "Gelderland", slug: "gelderland",
    cities: ["Nijmegen", "Arnhem", "Apeldoorn", "Ede", "Harderwijk", "Zutphen"],
    citySlugs: ["nijmegen", "arnhem", "apeldoorn", "ede", "harderwijk", "zutphen"],
  },
  {
    name: "Overijssel", slug: "overijssel",
    cities: ["Enschede", "Zwolle", "Deventer", "Hengelo", "Almelo"],
    citySlugs: ["enschede", "zwolle", "deventer", "hengelo", "almelo"],
  },
  {
    name: "Groningen", slug: "groningen",
    cities: ["Groningen", "Hoogezand"],
    citySlugs: ["groningen", "hoogezand"],
  },
  {
    name: "Friesland", slug: "friesland",
    cities: ["Leeuwarden", "Drachten", "Heerenveen"],
    citySlugs: ["leeuwarden", "drachten", "heerenveen"],
  },
  {
    name: "Limburg", slug: "limburg",
    cities: ["Maastricht", "Venlo", "Heerlen", "Roermond"],
    citySlugs: ["maastricht", "venlo", "heerlen", "roermond"],
  },
  {
    name: "Flevoland", slug: "flevoland",
    cities: ["Almere", "Lelystad"],
    citySlugs: ["almere", "lelystad"],
  },
  {
    name: "Zeeland", slug: "zeeland",
    cities: ["Middelburg", "Vlissingen"],
    citySlugs: ["middelburg", "vlissingen"],
  },
  {
    name: "Drenthe", slug: "drenthe",
    cities: ["Assen", "Emmen"],
    citySlugs: ["assen", "emmen"],
  },
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

  return (
    <div className="sticky top-0 z-50">
      <div className="bg-[#FCFAFF] border-b border-[#E9E7F0]">
        <nav className="px-6 py-3.5 flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/">
            <Image src="/logo.png" alt="LensLab" width={120} height={32} className="h-8 w-auto" priority />
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">

            {/* Locaties mega menu */}
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
                        <Link
                          href={`/locatie/${province.slug}`}
                          onClick={() => locaties.setOpen(false)}
                          className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2 hover:text-gray-600 transition-colors"
                        >
                          {province.name}
                        </Link>
                        <ul className="space-y-1">
                          {province.cities.slice(0, 4).map((city, i) => (
                            <li key={city}>
                              <Link
                                href={`/locatie/${province.citySlugs[i]}`}
                                onClick={() => locaties.setOpen(false)}
                                className="text-sm text-gray-500 hover:text-gray-900 transition-colors block"
                              >
                                {city}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#E9E7F0]">
                    <Link
                      href="/locaties"
                      onClick={() => locaties.setOpen(false)}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      Bekijk alle locaties →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Gelegenheid dropdown */}
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
                        <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
                          {group.heading}
                        </p>
                        <ul className="space-y-1">
                          {group.items.map((item) => (
                            <li key={item.slug}>
                              <Link
                                href={`/categorie/${item.slug}`}
                                onClick={() => gelegenheid.setOpen(false)}
                                className="text-sm text-gray-500 hover:text-gray-900 transition-colors block"
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Alle fotografen */}
            <Link href="/fotografen" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Alle fotografen
            </Link>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Login</Link>
            <Link href="/aanmelden" className="text-sm bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-gray-700 transition-colors font-medium">
              Get Started
            </Link>
          </div>
        </nav>
      </div>
      <TrustpilotBar />
    </div>
  );
}
