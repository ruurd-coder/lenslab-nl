"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";

const TEAM = [
  {
    name: "Ruurd Boehlee",
    title: "Chief Executive Officer",
    image: "/team/ruurd-boehlee.jpg",
    linkedin: "https://www.linkedin.com/in/ruurdboehlee/",
  },
  {
    name: "Nicky van Dinter",
    title: "Chief Product Officer",
    image: "/team/nicky-van-dinter.jpg",
    linkedin: "https://www.linkedin.com/in/nickyvandinter/",
  },
  {
    name: "Alain Manche",
    title: "Non Executive Officer",
    image: "/team/alain-manche.jpg",
    linkedin: "https://www.linkedin.com/in/alainmanche/",
  },
  {
    name: "Anouk de Bruijne",
    title: "Growth Marketeer",
    image: "/team/anouk-de-bruijne.jpg",
    linkedin: "https://www.linkedin.com/in/anoukdebruijne/",
  },
];

const TABS = [
  {
    id: "missie",
    label: "Missie",
    tag: "MISSIE",
    heading: "Iedereen verdient toegang tot topkwaliteit visuele content.",
    body: "We starten met het idee dat talent overal is — maar dat opdrachtgevers het niet altijd kunnen vinden. LensLab is gebouwd om die kloof te overbruggen. Niet met tussenpersonen of ingewikkelde processen, maar met een direct platform waar de kwaliteit voor zichzelf spreekt.",
    image: "/showcase/grid-1-1.webp",
  },
  {
    id: "visie",
    label: "Onze visie",
    tag: "VISIE",
    heading: "Gevonden worden op basis van talent, niet op basis van toeval.",
    body: "Wij geloven in een wereld waarin ieder bedrijf en iedere particulier toegang heeft tot topkwaliteit visuele content. Een wereld waarin beeldmakers worden gevonden op basis van talent, niet op basis van netwerk of toeval. LensLab bouwt aan dat platform, elke dag.",
    image: "/showcase/grid-2-1.webp",
  },
  {
    id: "succes",
    label: "Succes cases",
    tag: "SUCCES CASES",
    heading: "Merken die al werken met LensLab beeldmakers.",
    body: "Van kleine webshops tot grote Nederlandse merken — steeds meer opdrachtgevers vinden via LensLab de beeldmaker die écht bij hun merk past. Consistent, snel en zonder gedoe.",
    image: "/showcase/grid-3-1.webp",
  },
  {
    id: "locatie",
    label: "Locatie & kantoor",
    tag: "LOCATIE & KANTOOR",
    heading: "We werken vanuit het hart van Rijswijk.",
    body: "LensLab is gevestigd op Lange Kleiweg 62, 2288 GK Rijswijk. We zijn altijd bereikbaar via hello@lenslab.nl voor samenwerkingen, vragen of gewoon een kop koffie.",
    image: "/showcase/grid-4-1.webp",
  },
];

export default function OverOnsPage() {
  const [activeTab, setActiveTab] = useState("visie");
  const current = TABS.find((t) => t.id === activeTab) ?? TABS[1];

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-5 md:px-8 pt-14 pb-10 text-center">
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-5">Over ons</p>
        <h1
          className="text-4xl sm:text-5xl font-black leading-[1.08] tracking-tight text-gray-900 mb-12"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Geboren uit liefde voor sterk beeld.<br />
          Wij geloven in de kracht van beelden.
        </h1>

        {/* Two hero images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image src="/showcase/grid-1-2.webp" alt="LensLab opdrachtgevers" fill className="object-cover" priority />
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image src="/showcase/grid-2-2.webp" alt="LensLab beeldmakers" fill className="object-cover" priority />
          </div>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">LensLab voor opdrachtgevers</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">
              Opdrachtgevers door heel Nederland gebruiken LensLab om snel en eenvoudig de perfecte fotograaf of videograaf te vinden. Gefilterd op categorie, locatie en specialisme.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Of je nu zoekt voor een productshoot, evenement of branding. Op LensLab vind je altijd de beeldmaker die bij jouw opdracht en budget past.
            </p>
            <Link href="/beeldmakers" className="inline-block bg-gray-900 text-white text-sm font-semibold px-5 py-3 rounded-full hover:bg-gray-700 transition-colors">
              Zoek een beeldmaker
            </Link>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">LensLab voor beeldmakers</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">
              Als fotograaf of videograaf gebruik je LensLab om jezelf te presenteren aan honderden opdrachtgevers die actief op zoek zijn naar jouw specialisme.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Maak gratis een profiel aan, laat je portfolio zien en word direct gevonden. Wil je meer zichtbaarheid? Kies een abonnement dat bij jou past.
            </p>
            <Link href="/aanmelden" className="inline-block bg-gray-900 text-white text-sm font-semibold px-5 py-3 rounded-full hover:bg-gray-700 transition-colors">
              Maak een profiel aan
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quote ── */}
      <section className="border-t border-[#E9E7F0] py-14">
        <p className="max-w-3xl mx-auto px-5 md:px-8 text-center text-xl sm:text-2xl font-black text-gray-900 leading-snug">
          Bij LensLab verbinden we opdrachtgevers met de beste fotografen en videografen van Nederland, zo eenvoudig mogelijk.
        </p>
      </section>

      {/* ── Tabs: Missie / Visie / Succes / Locatie ── */}
      <section className="max-w-5xl mx-auto px-5 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
          {/* Tab list */}
          <div className="flex md:flex-col gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 text-left text-sm px-4 py-3 rounded-xl transition-colors font-medium w-full ${
                  activeTab === tab.id
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:text-gray-900 hover:bg-[#E9E7F0]"
                }`}
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="bg-[#F0EDF5] rounded-3xl overflow-hidden grid grid-cols-1 sm:grid-cols-[1fr_280px]">
            <div className="p-8 flex flex-col justify-center">
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">{current.tag}</p>
              <h3
                className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-4"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {current.heading}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{current.body}</p>
            </div>
            <div className="relative min-h-[220px] sm:min-h-0">
              <Image src={current.image} alt={current.tag} fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-t border-[#E9E7F0] py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Wat LensLab brengt</h2>
          <p className="text-sm text-gray-500 mb-10">
            We bouwen dagelijks aan het grootste en meest betrouwbare netwerk van fotografen en videografen van Nederland.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: "📍", number: "100+", label: "Gecureerde beeldmakers" },
              { icon: "⚡", number: "50+",  label: "Steden door heel Nederland" },
              { icon: "🆓", number: "100%", label: "Gratis voor opdrachtgevers" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-start gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#E9E7F0] flex items-center justify-center text-2xl">
                  {stat.icon}
                </div>
                <p className="text-4xl font-black text-gray-900">{stat.number}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="border-t border-[#E9E7F0] py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">Klein team, grote ambities</p>
          <h2
            className="text-3xl sm:text-4xl font-black text-gray-900 mb-12"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Ontmoet het LensLab team
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <div key={member.name}>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#E9E7F0] mb-3">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
                <p className="text-sm text-gray-700">{member.name}</p>
                <p className="text-sm font-bold text-gray-900 mb-2">{member.title}</p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-[#E9E7F0] hover:border-gray-400 transition-colors"
                  aria-label={`LinkedIn van ${member.name}`}
                >
                  <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
