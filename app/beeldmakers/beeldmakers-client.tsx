"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import PhotographerCard from "@/components/photographer-card";
import TypewriterInput from "@/components/typewriter-input";
import { FAQ_ITEMS } from "@/lib/mock-data";
import type { Photographer } from "@/lib/types";

interface Props {
  photographers: Photographer[];
  featured: Photographer[];
}

const DIENSTEN = [
  { value: "", label: "Alle diensten" },
  { value: "fotograaf", label: "Fotograaf" },
  { value: "videograaf", label: "Videograaf" },
  { value: "beide", label: "Foto & video" },
];

const CATEGORIES = [
  { value: "", label: "Alle categorieën" },
  { value: "Drone / Lucht", label: "☁️ Drone / Lucht" },
  { value: "Food & restaurant", label: "🌶️ Food & restaurant" },
  { value: "Afscheid", label: "🌹 Afscheid" },
  { value: "Baby", label: "👶🏼 Baby" },
  { value: "Evenementen", label: "🎤 Evenementen" },
  { value: "Makelaars", label: "🏘️ Makelaars" },
  { value: "Bedrijf", label: "🏢 Bedrijf" },
  { value: "Huisdier", label: "🐶 Huisdier" },
  { value: "Familie", label: "👨‍👨‍👧‍👧 Familie" },
  { value: "Portret", label: "👱‍♀️ Portret" },
  { value: "Boudoir", label: "💋 Boudoir" },
  { value: "Bruiloft", label: "💍 Bruiloft" },
  { value: "Zwangerschap", label: "🤰 Zwangerschap" },
  { value: "Feest", label: "🥳 Feest" },
];

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-colors ${
          value
            ? "border-gray-900 bg-gray-900 text-white"
            : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
        }`}
      >
        {value ? selected?.label : label}
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-lg z-20 min-w-[200px] py-1.5 overflow-hidden">
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#FCFAFF] transition-colors ${
                value === o.value ? "font-semibold text-gray-900" : "text-gray-700"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BeeldmakersClient({ photographers, featured }: Props) {
  const [search, setSearch] = useState("");
  const [dienstFilter, setDienstFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return photographers.filter((p) => {
      // Zoek over alle relevante velden
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          p.business_name?.toLowerCase().includes(q) ||
          p.contact_name?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.type?.toLowerCase().includes(q) ||
          p.regions?.some((r) => r.toLowerCase().includes(q)) ||
          p.specialties?.some((s) => s.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (dienstFilter && p.type !== dienstFilter) return false;
      if (categoryFilter && !p.specialties.includes(categoryFilter)) return false;
      return true;
    });
  }, [photographers, search, dienstFilter, categoryFilter]);

  const hasFilters = search || dienstFilter || categoryFilter;

  return (
    <>
      {/* Hero + zoekbalk */}
      <section className="pt-12 pb-8 px-6 max-w-3xl mx-auto text-center">
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
          Professionele beeldmakers voor elke shoot
        </p>
        <h1
          className="text-[8.4vw] md:text-[82px] font-bold leading-[1.1] md:leading-[1.04] tracking-tight mb-8"
          style={{ fontFamily: "var(--font-dm-sans)", color: "#030005" }}
        >
          Vind de perfecte foto- of videograaf
        </h1>

        {/* Zoekbalk met typewriter placeholder */}
        <TypewriterInput
          value={search}
          onChange={setSearch}
          onSubmit={() => {}}
        />
      </section>

      {/* Filterbar */}
      <section className="pb-6 px-6 max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-3 items-center">
          <FilterDropdown
            label="Diensten"
            value={dienstFilter}
            options={DIENSTEN}
            onChange={setDienstFilter}
          />
          <FilterDropdown
            label="Categorie"
            value={categoryFilter}
            options={CATEGORIES}
            onChange={setCategoryFilter}
          />
          {hasFilters && (
            <button
              onClick={() => { setSearch(""); setDienstFilter(""); setCategoryFilter(""); }}
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors px-2"
            >
              Wis filters
            </button>
          )}
        </div>
      </section>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-16">
        {!hasFilters ? (
          /* Standaard: uitgelichte beeldmakers */
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900 mb-1">Uitgelichte creators</h2>
              <p className="text-sm text-gray-400">Bekijk onze beste fotografen en videografen op een rij</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {featured.map((p) => (
                <PhotographerCard key={p.id} photographer={p} pageContext="/beeldmakers" />
              ))}
            </div>
          </>
        ) : filtered.length > 0 ? (
          /* Zoekresultaten */
          <>
            <p className="text-sm text-gray-500 mb-6">
              <span className="font-semibold text-gray-900">{filtered.length}</span> beeldmaker{filtered.length !== 1 ? "s" : ""} gevonden
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((p) => (
                <PhotographerCard key={p.id} photographer={p} pageContext="/beeldmakers" />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl text-center py-24 border border-gray-100">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-gray-600 text-lg font-medium mb-2">Geen beeldmakers gevonden</p>
            <p className="text-sm text-gray-400 mb-6">Probeer andere zoektermen</p>
            <button
              onClick={() => { setSearch(""); setDienstFilter(""); setCategoryFilter(""); }}
              className="text-sm bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-700 transition-colors"
            >
              Wis zoekopdracht
            </button>
          </div>
        )}
      </main>

      {/* FAQ */}
      <section className="bg-white border-t border-gray-100 mt-4">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-black text-gray-900 text-center tracking-tight mb-3">
            Veelgestelde vragen
          </h2>
          <p className="text-gray-400 text-center text-base mb-12">
            Staat jouw vraag er niet bij? Neem dan contact op.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="bg-[#E9E7F0] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-start justify-between gap-3"
                >
                  <span className="text-sm font-semibold text-gray-800 leading-snug">{item.question}</span>
                  <svg className={`w-4 h-4 text-gray-400 shrink-0 mt-0.5 transition-transform ${openFaq === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-gray-500 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-200 py-8 px-6 text-center">
        <p className="text-sm text-gray-400">© 2025 LensLab — Alle beeldmakers in Nederland</p>
      </footer>
    </>
  );
}
