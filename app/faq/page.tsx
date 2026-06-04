"use client";

import Link from "next/link";
import { useState } from "react";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";

const FAQ_SECTIONS = [
  {
    label: "VOOR OPDRACHTGEVERS",
    items: [
      {
        q: "Is LensLab gratis te gebruiken?",
        a: "Ja, als opdrachtgever gebruik je LensLab volledig gratis. Je betaalt geen abonnement of verborgen kosten.",
      },
      {
        q: "Hoe neem ik contact op met een beeldmaker?",
        a: "Via het profiel van de beeldmaker kun je direct een bericht sturen via het contactformulier, naar de website gaan of de socials bezoeken.",
      },
      {
        q: "Hoe weet ik of een beeldmaker goed is?",
        a: "Elk profiel op LensLab is handmatig beoordeeld. Je ziet altijd het portfolio, de specialisaties en de socials van de beeldmaker.",
      },
      {
        q: "Kan ik meerdere beeldmakers tegelijk benaderen?",
        a: "Ja, je kunt zoveel profielen bekijken en beeldmakers benaderen als je wilt.",
      },
      {
        q: "Wat als ik niet weet welke categorie ik nodig heb?",
        a: "Gebruik onze zoekfunctie en filters om te verkennen. Twijfel je? Neem contact op met ons team via de website.",
      },
    ],
  },
  {
    label: "VOOR BEELDMAKERS",
    items: [
      {
        q: "Hoe maak ik een profiel aan?",
        a: "Registreer je gratis op LensLab, vul je portfolio in, voeg je specialisaties, website en socials toe en je profiel is live.",
      },
      {
        q: "Kost een profiel op LensLab geld?",
        a: "Een basisprofiel is gratis. Wil je meer zichtbaarheid? Dan zijn er betaalde abonnementen beschikbaar die je bereik vergroten.",
      },
      {
        q: "Welke abonnementen zijn er beschikbaar?",
        a: "LensLab biedt verschillende abonnementen aan met extra functies zoals hogere zichtbaarheid in zoekresultaten. Bekijk de abonnementspagina voor meer informatie.",
      },
      {
        q: "Hoe word ik gevonden door opdrachtgevers?",
        a: "Opdrachtgevers zoeken via filters op categorie, locatie en specialisme. Hoe completer jouw profiel, hoe groter de kans dat je gevonden wordt.",
      },
      {
        q: "Kan ik mijn profiel altijd aanpassen?",
        a: "Ja, je kunt jouw profiel op elk moment updaten met nieuwe foto's, projecten of informatie.",
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="text-[15px] text-gray-900">{q}</span>
        <svg
          className={`w-4 h-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <p className="text-sm text-gray-500 leading-relaxed pb-5 -mt-1">
          {a}
        </p>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />

      <div className="max-w-6xl mx-auto px-5 md:px-8 py-12">
        {/* Terug */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-12">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Terug
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20">
          {/* Links: titel */}
          <div className="lg:sticky lg:top-32 self-start">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-5">
              Alles wat je wil weten
            </p>
            <h1
              className="text-4xl sm:text-5xl font-black leading-tight text-gray-900"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              De meest<br />gestelde vragen
            </h1>
          </div>

          {/* Rechts: FAQ secties */}
          <div className="space-y-10">
            {FAQ_SECTIONS.map((section) => (
              <div key={section.label}>
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                  {section.label}
                </p>
                <div>
                  {section.items.map((item) => (
                    <FaqItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
