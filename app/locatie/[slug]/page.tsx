import { notFound } from "next/navigation";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import PhotographerCard from "@/components/photographer-card";
import { MOCK_PHOTOGRAPHERS } from "@/lib/mock-data";

// Tijdelijke locatie data — wordt straks uit Supabase gehaald
const LOCATIONS: Record<string, { name: string; province: string; isCity: boolean }> = {
  "amsterdam": { name: "Amsterdam", province: "Noord-Holland", isCity: true },
  "rotterdam": { name: "Rotterdam", province: "Zuid-Holland", isCity: true },
  "den-haag": { name: "Den Haag", province: "Zuid-Holland", isCity: true },
  "utrecht": { name: "Utrecht", province: "Utrecht", isCity: true },
  "eindhoven": { name: "Eindhoven", province: "Noord-Brabant", isCity: true },
  "noord-holland": { name: "Noord-Holland", province: "Noord-Holland", isCity: false },
  "zuid-holland": { name: "Zuid-Holland", province: "Zuid-Holland", isCity: false },
  "noord-brabant": { name: "Noord-Brabant", province: "Noord-Brabant", isCity: false },
  "utrecht-provincie": { name: "Utrecht", province: "Utrecht", isCity: false },
  "gelderland": { name: "Gelderland", province: "Gelderland", isCity: false },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const location = LOCATIONS[slug];
  if (!location) return {};

  const type = location.isCity ? "stad" : "provincie";
  return {
    title: `Fotografen in ${location.name} — Vind de beste fotograaf | LensLab`,
    description: `Zoek je een professionele fotograaf in ${location.name}? Bekijk portfolio's van alle fotografen en videografen in ${location.name} en omgeving. Direct contact opnemen.`,
  };
}

export default async function LocatiePage({ params }: Props) {
  const { slug } = await params;
  const location = LOCATIONS[slug];

  if (!location) notFound();

  // Straks: filter op echte Supabase data
  const photographers = MOCK_PHOTOGRAPHERS;

  // Mock stats — straks dynamisch
  const stats = {
    count: photographers.length,
    specialties: 8,
    avgRating: 4.8,
    responseTime: "4 uur",
  };

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
          {location.province}
        </p>
        <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tight mb-4">
          Fotografen in {location.name}
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mb-8">
          Vind de beste fotograaf of videograaf in {location.name}. Bekijk portfolio&apos;s en neem direct contact op.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Actieve fotografen", value: stats.count },
            { label: "Specialisaties", value: stats.specialties },
            { label: "Gemiddelde beoordeling", value: `${stats.avgRating}/5` },
            { label: "Gem. reactietijd", value: stats.responseTime },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fotografen grid */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {photographers.map((p) => (
            <PhotographerCard key={p.id} photographer={p} pageContext={`/locatie/${slug}`} />
          ))}
        </div>
      </section>

      {/* Content blokken */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Fotografie in {location.name}
            </h2>
            <p className="text-gray-500 leading-relaxed">
              {location.name} is een bruisende stad met een rijke fotografiecultuur. Van intieme portretshoot in een Amsterdamse studio tot een zakelijke reportage op locatie — er is altijd een fotograaf die precies past bij jouw wensen en budget.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Waarom een fotograaf inhuren in {location.name}?
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Een professionele fotograaf zorgt voor beelden die blijven. Of het nu gaat om je bruiloft, een zakelijke shoot of een bijzondere familiemoment — de fotografen in {location.name} kennen de beste locaties en weten hoe ze het mooiste in mensen naar boven halen.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Populaire soorten fotografie in {location.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["💍 Bruiloft", "👨‍👨‍👧‍👧 Familie", "🏢 Bedrijf", "👱‍♀️ Portret", "🤰 Zwangerschap", "🎤 Evenementen"].map((cat) => (
                <div key={cat} className="bg-[#E9E7F0] rounded-xl px-4 py-3 text-sm font-medium text-gray-700">
                  {cat}
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              FAQ — Fotografen in {location.name}
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: `Wat kost een fotograaf in ${location.name}?`,
                  a: `De tarieven van een fotograaf in ${location.name} verschillen per type shoot en ervaring. Een portretshoot is vaak mogelijk vanaf €150. Bruiloftsfotografie kost doorgaans tussen €1.500 en €2.800.`,
                },
                {
                  q: `Hoe vind ik een betrouwbare fotograaf in ${location.name}?`,
                  a: `Via LensLab kun je portfolio's vergelijken, reviews lezen en direct contact opnemen. Alle fotografen zijn vooraf gescreend op kwaliteit en professionaliteit.`,
                },
                {
                  q: `Werken fotografen in ${location.name} ook buiten de stad?`,
                  a: `Ja, de meeste fotografen in ${location.name} zijn flexibel en werken ook in omliggende plaatsen. Check het profiel voor de exacte regio's.`,
                },
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

      <footer className="border-t border-gray-200 py-8 px-6 text-center bg-white">
        <p className="text-sm text-gray-400">© 2025 LensLab — Fotografen in {location.name}</p>
      </footer>
    </div>
  );
}
