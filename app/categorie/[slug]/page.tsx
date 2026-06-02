import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PhotographerCard from "@/components/photographer-card";
import type { Photographer } from "@/lib/types";

const CATEGORIES: Record<string, { name: string; emoji: string; singular: string }> = {
  "drone-lucht":       { name: "Drone / Lucht",      emoji: "☁️",  singular: "Drone fotograaf" },
  "food-restaurant":   { name: "Food & restaurant",  emoji: "🌶️", singular: "Food fotograaf" },
  "afscheid":          { name: "Afscheid",            emoji: "🌹",  singular: "Afscheidsfotograaf" },
  "baby":              { name: "Baby",                emoji: "👶🏼", singular: "Babyfotograaf" },
  "evenementen":       { name: "Evenementen",         emoji: "🎤",  singular: "Evenementfotograaf" },
  "makelaars":         { name: "Makelaars",           emoji: "🏘️", singular: "Vastgoedfotograaf" },
  "bedrijf":           { name: "Bedrijf",             emoji: "🏢",  singular: "Bedrijfsfotograaf" },
  "huisdier":          { name: "Huisdier",            emoji: "🐶",  singular: "Huis­dier­fotograaf" },
  "familie":           { name: "Familie",             emoji: "👨‍👨‍👧‍👧", singular: "Familie­fotograaf" },
  "portret":           { name: "Portret",             emoji: "👱‍♀️", singular: "Portret­fotograaf" },
  "boudoir":           { name: "Boudoir",             emoji: "💋",  singular: "Boudoir­fotograaf" },
  "bruiloft":          { name: "Bruiloft",            emoji: "💍",  singular: "Bruilofts­fotograaf" },
  "zwangerschap":      { name: "Zwangerschap",        emoji: "🤰",  singular: "Zwanger­schaps­fotograaf" },
  "feest":             { name: "Feest",               emoji: "🥳",  singular: "Feest­fotograaf" },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cat = CATEGORIES[slug];
  if (!cat) return {};

  return {
    title: `De beste ${cat.singular}en in Nederland | LensLab`,
    description: `Vind de beste ${cat.singular}en in Nederland. Bekijk portfolio's, lees reviews en neem direct contact op via LensLab.`,
  };
}

export default async function CategoriePage({ params }: Props) {
  const { slug } = await params;
  const cat = CATEGORIES[slug];
  if (!cat) notFound();

  // Haal fotografen op met deze specialiteit uit Supabase
  const supabase = await createClient();
  const { data } = await supabase
    .from("photographers")
    .select("*")
    .eq("is_published", true)
    .contains("specialties", [cat.name])
    .order("membership_tier", { ascending: false })
    .order("rating", { ascending: false });

  const photographers = (data as Photographer[]) || [];

  // Dynamische stats
  const cities = new Set(photographers.map((p) => p.city).filter(Boolean));
  const stats = {
    count: photographers.length,
    cities: cities.size,
  };

  const contentMap: Record<string, { what: string; when: string; cost: string; tips: string }> = {
    "zwangerschap": {
      what: "Een zwangerschapsfotograaf legt de bijzondere periode van de zwangerschap vast in professionele beelden. Van de groeiende buik tot de intieme momenten tussen partners.",
      when: "De beste tijd voor een zwangerschapsshoot is tussen week 28 en 34. Dan is de buik mooi rond maar ben je nog comfortabel genoeg voor een shoot.",
      cost: "Een zwangerschapsshoot kost gemiddeld tussen €150 en €400, afhankelijk van de duur en het pakket. Veel fotografen bieden ook combi-pakketten aan met newborn fotografie.",
      tips: "Let op het portfolio van de fotograaf: past de stijl bij jou? Bespreek van tevoren welke outfits en locaties je in gedachten hebt.",
    },
    "bruiloft": {
      what: "Een bruiloftsfotograaf legt alle emoties en bijzondere momenten van jouw trouwdag vast. Van de voorbereiding tot het feest — authentiek, tijdloos en vol liefde.",
      when: "Boek je bruiloftsfotograaf zo vroeg mogelijk — goede fotografen zijn soms al meer dan een jaar van tevoren volgeboekt.",
      cost: "Bruiloftsfotografie kost doorgaans tussen €1.500 en €2.800, afhankelijk van het pakket en de duur van de dag.",
      tips: "Vraag altijd naar een back-up plan bij ziekte. Bekijk volledige bruiloftsreportages (niet alleen de beste foto's) om een goed beeld te krijgen.",
    },
  };

  const content = contentMap[slug] || {
    what: `Een ${cat.singular} legt professioneel jouw bijzondere momenten vast. Met oog voor detail en een persoonlijke aanpak zorgt een ${cat.singular} voor beelden die je koestert.`,
    when: `Wanneer je een professionele ${cat.singular} nodig hebt, is afhankelijk van de gelegenheid. Plan je shoot ruim van tevoren om de beste ${cat.singular} te kunnen boeken.`,
    cost: `De kosten voor ${cat.name.toLowerCase()} fotografie variëren per fotograaf en pakket. Vergelijk via LensLab en vraag een offerte op.`,
    tips: `Bekijk het portfolio van meerdere fotografen en let op stijl en persoonlijkheid. Een goed klik met je fotograaf maakt het resultaat altijd beter.`,
  };

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
          {cat.emoji} {cat.name}
        </p>
        <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tight mb-4">
          De beste {cat.singular}en<br />in Nederland
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mb-8">
          Vind de perfecte {cat.singular} voor jouw moment. Bekijk portfolio&apos;s en neem direct contact op.
        </p>

        {/* Stats */}
        <div className="flex gap-4 flex-wrap mb-10">
          <div className="bg-white rounded-2xl border border-gray-100 px-6 py-4">
            <p className="text-2xl font-black text-gray-900">{stats.count}</p>
            <p className="text-sm text-gray-400 mt-1">{cat.singular}en in Nederland</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 px-6 py-4">
            <p className="text-2xl font-black text-gray-900">{stats.cities}</p>
            <p className="text-sm text-gray-400 mt-1">Actief in steden</p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        {photographers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {photographers.map((p) => (
              <PhotographerCard key={p.id} photographer={p} pageContext={`/categorie/${slug}`} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 text-center py-16">
            <p className="text-4xl mb-3">{cat.emoji}</p>
            <p className="text-gray-600 font-medium">Binnenkort beschikbaar</p>
            <p className="text-sm text-gray-400 mt-1">{cat.singular}en worden binnenkort toegevoegd.</p>
          </div>
        )}
      </section>

      {/* Content blokken */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Wat doet een {cat.singular}?
            </h2>
            <p className="text-gray-500 leading-relaxed">{content.what}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Wanneer huur je een {cat.singular} in?
            </h2>
            <p className="text-gray-500 leading-relaxed">{content.when}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Wat kost {cat.name.toLowerCase()} fotografie?
            </h2>
            <p className="text-gray-500 leading-relaxed">{content.cost}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Waar let je op bij het kiezen van een {cat.singular}?
            </h2>
            <p className="text-gray-500 leading-relaxed">{content.tips}</p>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              FAQ — {cat.singular}
            </h2>
            <div className="space-y-4">
              {[
                { q: `Hoe vind ik een goede ${cat.singular}?`, a: `Via LensLab kun je portfolio's vergelijken en reviews lezen. Filter op locatie en stijl om de perfecte match te vinden.` },
                { q: `Kan ik vooraf mijn wensen bespreken?`, a: `Ja, via LensLab kun je direct contact opnemen met de fotograaf om jouw wensen, locatie en stijlvoorkeur te bespreken.` },
                { q: `Zijn de foto's geschikt voor commercieel gebruik?`, a: `Dit verschilt per fotograaf en pakket. Vraag dit van tevoren na — het staat vaak vermeld in het profiel.` },
              ].map((faq, i) => (
                <div key={i} className="bg-[#E9E7F0] rounded-2xl p-5">
                  <p className="font-semibold text-gray-900 mb-2">{faq.q}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
