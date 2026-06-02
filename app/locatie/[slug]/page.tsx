import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PhotographerCard from "@/components/photographer-card";
import type { Photographer } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

async function getLocationData(slug: string) {
  const supabase = await createClient();

  // Haal regio op uit database
  const { data: region } = await supabase
    .from("regions")
    .select("*")
    .eq("slug", slug)
    .single();

  return region;
}

async function getPhotographers(region: { name: string; city: string | null; province: string | null }) {
  const supabase = await createClient();

  let query = supabase
    .from("photographers")
    .select("*")
    .eq("is_published", true);

  if (region.city) {
    // Stadspagina: fotografen in deze stad OF beschikbaar in de provincie
    query = query.or(
      `city.ilike.%${region.city}%,regions.cs.{"${region.city}"},regions.cs.{"${region.province}"}`
    );
  } else {
    // Provinciepagina: fotografen beschikbaar in deze provincie
    query = query.or(
      `regions.cs.{"${region.name}"},regions.cs.{"${region.province}"}`
    );
  }

  const { data } = await query
    .order("membership_tier", { ascending: false })
    .order("rating", { ascending: false });

  return (data as Photographer[]) || [];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const region = await getLocationData(slug);
  if (!region) return {};

  const name = region.city || region.name;
  return {
    title: `Fotografen in ${name} — Vind de beste fotograaf | LensLab`,
    description: `Zoek je een professionele fotograaf in ${name}? Bekijk portfolio's van fotografen en videografen in ${name}. Direct contact opnemen via LensLab.`,
  };
}

export default async function LocatiePage({ params }: Props) {
  const { slug } = await params;
  const region = await getLocationData(slug);

  if (!region) notFound();

  const photographers = await getPhotographers(region);
  const locationName = region.city || region.name;
  const isCity = !!region.city;

  // Dynamische stats
  const avgRating = photographers.length > 0
    ? Math.round((photographers.reduce((sum, p) => sum + (p.rating || 0), 0) / photographers.length) * 10) / 10
    : 0;
  const allSpecialties = new Set(photographers.flatMap((p) => p.specialties || []));

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
          {region.province || region.name}
        </p>
        <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tight mb-4">
          Fotografen in {locationName}
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mb-8">
          Vind de beste fotograaf of videograaf in {locationName}. Bekijk portfolio&apos;s en neem direct contact op.
        </p>

        {/* Dynamische stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-[#E9E7F0] p-5">
            <p className="text-2xl font-black text-gray-900">{photographers.length}</p>
            <p className="text-sm text-gray-400 mt-1">Actieve beeldmakers</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E9E7F0] p-5">
            <p className="text-2xl font-black text-gray-900">{allSpecialties.size}</p>
            <p className="text-sm text-gray-400 mt-1">Specialisaties</p>
          </div>
          {avgRating > 0 && (
            <div className="bg-white rounded-2xl border border-[#E9E7F0] p-5">
              <p className="text-2xl font-black text-gray-900">{avgRating}/5</p>
              <p className="text-sm text-gray-400 mt-1">Gemiddelde beoordeling</p>
            </div>
          )}
        </div>
      </section>

      {/* Fotografen grid */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        {photographers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {photographers.map((p) => (
              <PhotographerCard key={p.id} photographer={p} pageContext={`/locatie/${slug}`} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl text-center py-16 border border-[#E9E7F0]">
            <p className="text-3xl mb-3">📍</p>
            <p className="text-gray-600 font-medium mb-2">Nog geen beeldmakers in {locationName}</p>
            <p className="text-sm text-gray-400 mb-6">Ben jij beeldmaker in deze regio?</p>
            <a href="/aanmelden" className="inline-block bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full hover:bg-gray-700 transition-colors">
              Meld je aan
            </a>
          </div>
        )}
      </section>

      {/* SEO content blokken */}
      <section className="bg-white border-t border-[#E9E7F0]">
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Fotografie in {locationName}
            </h2>
            <p className="text-gray-500 leading-relaxed">
              {isCity
                ? `${locationName} biedt een gevarieerd aanbod van professionele fotografen en videografen. Van intieme portretshoot tot zakelijke reportage — er is altijd een beeldmaker die past bij jouw wensen en budget.`
                : `In de provincie ${locationName} vind je professionele fotografen voor elke gelegenheid. Of je nu in de grote steden of in kleinere dorpen zoekt — via LensLab vind je snel de juiste beeldmaker.`
              }
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Waarom een fotograaf inhuren in {locationName}?
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Een professionele fotograaf zorgt voor beelden die blijven. De beeldmakers in {locationName} kennen de mooiste locaties en weten hoe ze het beste in mensen naar boven halen — authentiek en tijdloos.
            </p>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Veelgestelde vragen — Fotografen in {locationName}
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: `Wat kost een fotograaf in ${locationName}?`,
                  a: `De tarieven verschillen per type shoot en ervaring. Een portretshoot is vaak mogelijk vanaf €150. Bruiloftsfotografie kost doorgaans tussen €1.500 en €2.800. Via LensLab zie je altijd duidelijke prijzen.`,
                },
                {
                  q: `Hoe vind ik een betrouwbare fotograaf in ${locationName}?`,
                  a: `Via LensLab vergelijk je portfolio's, lees je reviews en neem je direct contact op. Alle beeldmakers zijn vooraf gescreend op kwaliteit en professionaliteit.`,
                },
                {
                  q: `Werken fotografen in ${locationName} ook op andere locaties?`,
                  a: `Ja, de meeste beeldmakers zijn flexibel en werken ook in omliggende plaatsen. Check het profiel voor de exacte beschikbaarheid.`,
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

      <SiteFooter />
    </div>
  );
}
