"use client";

import { useState, useMemo } from "react";
import PhotographerCard from "@/components/photographer-card";
import TypewriterInput from "@/components/typewriter-input";
import type { Photographer } from "@/lib/types";

interface Props {
  photographers: Photographer[];
}

export default function FotografenClient({ photographers }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return photographers;
    const q = search.toLowerCase();
    return photographers.filter((p) =>
      p.business_name?.toLowerCase().includes(q) ||
      p.contact_name?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q) ||
      p.type?.toLowerCase().includes(q) ||
      p.regions?.some((r) => r.toLowerCase().includes(q)) ||
      p.specialties?.some((s) => s.toLowerCase().includes(q))
    );
  }, [photographers, search]);

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
          Alle beeldmakers
        </h1>
        <TypewriterInput
          value={search}
          onChange={setSearch}
          onSubmit={() => {}}
        />
      </section>

      {/* Teller */}
      <div className="max-w-7xl mx-auto px-6 pb-4">
        <p className="text-sm text-gray-500">
          {search.trim() ? (
            <><span className="font-semibold text-gray-900">{filtered.length}</span> beeldmaker{filtered.length !== 1 ? "s" : ""} gevonden</>
          ) : (
            <><span className="font-semibold text-gray-900">{photographers.length}</span> beeldmakers in Nederland</>
          )}
        </p>
      </div>

      {/* Grid — altijd alle beeldmakers zichtbaar */}
      <main className="max-w-7xl mx-auto px-6 pb-16">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <PhotographerCard key={p.id} photographer={p} pageContext="/fotografen" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl text-center py-24 border border-[#E9E7F0]">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-gray-600 text-lg font-medium mb-2">Geen beeldmakers gevonden</p>
            <p className="text-sm text-gray-400 mb-6">Probeer een andere zoekterm</p>
            <button
              onClick={() => setSearch("")}
              className="text-sm bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-700 transition-colors"
            >
              Wis zoekopdracht
            </button>
          </div>
        )}
      </main>
    </>
  );
}
