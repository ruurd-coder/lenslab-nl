import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PhotographerCard from "@/components/photographer-card";
import type { Photographer } from "@/lib/types";

const CATEGORIES: Record<string, { name: string; emoji: string; singular: string; plural: string }> = {
  "drone-lucht":       { name: "Drone / Lucht",      emoji: "☁️",  singular: "Drone fotograaf",           plural: "Drone fotografen" },
  "food-restaurant":   { name: "Food & restaurant",  emoji: "🌶️", singular: "Food fotograaf",            plural: "Food fotografen" },
  "afscheid":          { name: "Afscheid",            emoji: "🌹",  singular: "Afscheidsfotograaf",        plural: "Afscheidsfotografen" },
  "baby":              { name: "Baby",                emoji: "👶🏼", singular: "Babyfotograaf",             plural: "Babyfotografen" },
  "evenementen":       { name: "Evenementen",         emoji: "🎤",  singular: "Evenementfotograaf",        plural: "Evenementfotografen" },
  "makelaars":         { name: "Makelaars",           emoji: "🏘️", singular: "Vastgoedfotograaf",         plural: "Vastgoedfotografen" },
  "bedrijf":           { name: "Bedrijf",             emoji: "🏢",  singular: "Bedrijfsfotograaf",         plural: "Bedrijfsfotografen" },
  "huisdier":          { name: "Huisdier",            emoji: "🐶",  singular: "Huisdierfotograaf",         plural: "Huisdierfotografen" },
  "familie":           { name: "Familie",             emoji: "👨‍👨‍👧‍👧", singular: "Familiefotograaf",          plural: "Familiefotografen" },
  "portret":           { name: "Portret",             emoji: "👱‍♀️", singular: "Portretfotograaf",          plural: "Portretfotografen" },
  "boudoir":           { name: "Boudoir",             emoji: "💋",  singular: "Boudoirfotograaf",          plural: "Boudoirfotografen" },
  "bruiloft":          { name: "Bruiloft",            emoji: "💍",  singular: "Bruiloftsfotograaf",        plural: "Bruiloftsfotografen" },
  "zwangerschap":      { name: "Zwangerschap",        emoji: "🤰",  singular: "Zwangerschapsfotograaf",    plural: "Zwangerschapsfotografen" },
  "feest":             { name: "Feest",               emoji: "🥳",  singular: "Feestfotograaf",            plural: "Feestfotografen" },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cat = CATEGORIES[slug];
  if (!cat) return {};

  return {
    title: `De beste ${cat.plural} in Nederland | LensLab`,
    description: `Vind de beste ${cat.plural} in Nederland. Bekijk portfolio's, lees reviews en neem direct contact op via LensLab.`,
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
    "drone-lucht": {
      what: "Een dronefotograaf maakt professionele luchtfoto's en -video's met een gecertificeerde drone. Van vastgoed en evenementen tot landschappen en bedrijfslocaties — luchtbeelden geven een uniek perspectief dat op de grond onmogelijk te bereiken is.",
      when: "Huur een dronefotograaf in bij vastgoedverkoop, bouwprojectdocumentatie, evenementen, trouwerijen of als je je bedrijfslocatie vanuit de lucht wil laten zien. Een vergunning is soms nodig — een goede drone pilot regelt dit voor je.",
      cost: "Dronefotografie kost gemiddeld tussen €200 en €600 per sessie, afhankelijk van de locatie, duur en het gewenste eindresultaat. Videoproducties zijn doorgaans duurder dan alleen foto's.",
      tips: "Controleer of de fotograaf een officieel dronebewijs (RPA-certificaat) heeft. Vraag naar ervaring met jouw type locatie en bespreek de weersomstandigheden van tevoren.",
    },
    "food-restaurant": {
      what: "Een foodfotograaf legt gerechten en dranken vast op een manier die de kijker doet watertanden. Of het nu gaat om menukaarten, social media content of campagnes — sterke foodfotografie vertelt een verhaal en versterkt je merk.",
      when: "Foodfotografie is waardevol bij de lancering van een nieuw menu, een rebrand van je restaurant, het aanmaken van social media content of voor gebruik in advertenties en campagnes.",
      cost: "Foodfotografie kost gemiddeld tussen €250 en €800 per dag, inclusief styling. Sommige fotografen werken met een food stylist — vraag of die inbegrepen is.",
      tips: "Zorg dat de gerechten er op hun best uitzien: vers, stoom, glans. Bespreek de gewenste sfeer en kleurpalet van tevoren. Bekijk het portfolio op stijl: editorial, moody of helder en licht?",
    },
    "afscheid": {
      what: "Een afscheidsfotograaf legt op respectvolle en liefdevolle wijze de laatste momenten met een dierbare vast. Deze beelden zijn onvervangbaar en geven troost in de rouwperiode.",
      when: "Bij het overlijden van een dierbare, tijdens een afscheidsbijeenkomst of uitvaart. Sommige fotografen zijn ook gespecialiseerd in 'before I die'-shoots voor ernstig zieken.",
      cost: "Afscheidsfotografie kost doorgaans tussen €150 en €400. Veel fotografen bieden een vaste prijs per sessie aan inclusief een selectie bewerkte foto's.",
      tips: "Kies een fotograaf met aantoonbare ervaring in rouw- en afscheidsfotografie. Empathie en discretie zijn minstens zo belangrijk als technische kwaliteit.",
    },
    "baby": {
      what: "Een babyfotograaf specialiseert zich in het vastleggen van de eerste weken en maanden van een baby. Van schattige slaapportretten tot levendige momenten met de hele familie.",
      when: "De populairste momenten zijn: newbornshoot (eerste 2 weken), 3-maanden, half jaar en 1 jaar. Plan de newbornshoot al tijdens je zwangerschap — ze zijn snel volgeboekt.",
      cost: "Een babyshoot kost gemiddeld tussen €125 en €350, afhankelijk van de locatie (thuis of studio), duur en het aantal bewerkingen. Combinatiepakketten met zwangerschap zijn vaak voordeliger.",
      tips: "Plan de shoot rond de slaaptijden van de baby voor de rustigste resultaten. Zorg voor een warme ruimte bij newbornshoot — baby's slapen beter bij warmte.",
    },
    "evenementen": {
      what: "Een evenementfotograaf legt de sfeer, mensen en bijzondere momenten van jouw evenement vast. Van zakelijke conferenties en productlanceringen tot festivals en privéfeesten.",
      when: "Bij elk evenement waar herinneringen vastgelegd moeten worden: congressen, awards ceremonies, openingsevenementen, sporttoernooien, beurzen en feesten.",
      cost: "Evenementfotografie kost doorgaans tussen €150 en €400 per uur, of een dagprijs van €600 tot €1.500. Vraag altijd naar het aantal geleverde en bewerkte foto's.",
      tips: "Briefje de fotograaf van tevoren over het programma en de must-have shots. Bespreek of flashfotografie toegestaan is in de ruimte.",
    },
    "makelaars": {
      what: "Een vastgoedfotograaf maakt professionele interieur- en exterieursfoto's van woningen, kantoren en commercieel vastgoed. Goede fotografie verhoogt de aantrekkingskracht van een pand aanzienlijk.",
      when: "Bij de verkoop of verhuur van vastgoed, bij nieuwbouwprojecten, voor architectuurpublicaties of bij de lancering van een nieuw kantoor of bedrijfspand.",
      cost: "Vastgoedfotografie kost gemiddeld tussen €175 en €500 per woning, afhankelijk van de grootte en de gewenste oplevering. Drone-opnames kosten extra.",
      tips: "Zorg dat het pand opgeruimd en gestaged is vóór de shoot. Vraag naar HDR-fotografie voor optimale belichting van zowel ramen als interieur.",
    },
    "bedrijf": {
      what: "Een bedrijfsfotograaf maakt professionele beelden van medewerkers, kantoren, producten en bedrijfsactiviteiten. Van headshots en teamfoto's tot reportages die je bedrijfscultuur laten zien.",
      when: "Bij een rebrand, de lancering van een nieuwe website, jaarverslag, persberichten, LinkedIn-profielen van medewerkers of als je bedrijf wil laten zien wie jullie zijn.",
      cost: "Bedrijfsfotografie kost gemiddeld tussen €250 en €700 per halve dag. Headshots zijn vaak apart geprijsd: €75 tot €200 per persoon.",
      tips: "Maak duidelijke afspraken over de dresscode en de gewenste uitstraling (formeel, casual, dynamisch). Zorg voor een rustige locatie met goed licht.",
    },
    "huisdier": {
      what: "Een huisdierfotograaf legt de persoonlijkheid en het karakter van jouw huisdier vast in mooie, professionele beelden. Of het nu gaat om honden, katten, paarden of andere dieren.",
      when: "Als je je huisdier wilt vereeuwigen, voor het maken van een persoonlijk cadeau of als je een professioneel portret wilt voor thuis. Ook populair als afscheidsfoto bij een ziek of oud huisdier.",
      cost: "Huisdierfotografie kost gemiddeld tussen €125 en €300 per sessie, thuis of op locatie. In-studio shoots zijn soms duurder.",
      tips: "Plan de shoot op een moment dat je huisdier uitgerust en goed gevoed is. Neem favoriete speeltjes mee voor aandacht. Een fotograaf met ervaring met dieren is een must.",
    },
    "familie": {
      what: "Een familiefotograaf legt de band tussen gezinsleden vast in authentieke, warme beelden. Van jonge gezinnen met baby's tot grote familiereünies — de beste familieportretten tonen echte emoties.",
      when: "Bij bijzondere momenten zoals een geboorte, verjaardag, sinterklaas, kerst of gewoon omdat je de fase wilt vastleggen. Jaarlijkse familieportretten worden steeds populairder.",
      cost: "Familiefotografie kost gemiddeld tussen €150 en €400, afhankelijk van de locatie, duur en het aantal bewerkte foto's.",
      tips: "Kies kleding die bij elkaar past maar niet identiek is. Plan de shoot buiten de slaaptijden van jonge kinderen. Laat de fotograaf spelletjes meenemen voor natuurlijke reacties.",
    },
    "portret": {
      what: "Een portretfotograaf maakt professionele foto's van individuen, waarbij karakter, uitstraling en persoonlijkheid centraal staan. Van zakelijke headshots tot artistieke portretten.",
      when: "Voor LinkedIn-profielen, persoonlijke branding, acteursfoto's, cv-foto's of als je gewoon een mooie professionele foto van jezelf wilt hebben.",
      cost: "Portretfotografie kost gemiddeld tussen €100 en €350 per sessie. Zakelijke headshots zijn soms per stuk geprijsd: €75 tot €200.",
      tips: "Bespreek de gewenste uitstraling: formeel, zakelijk, creatief of casual. Draag kleding die bij je past en je zelfvertrouwen geeft. Bewerkte foto's zijn doorgaans inbegrepen.",
    },
    "boudoir": {
      what: "Boudoirfotografie is intieme fotografie waarbij vrouwelijkheid, zelfvertrouwen en schoonheid centraal staan. Een boudoirshoot is een krachtige manier om jezelf te vieren zoals je bent.",
      when: "Als persoonlijk cadeau (bijv. voor een partner), ter viering van een milestone (verjaardag, gewichtsafname, ziekte overwonnen) of gewoon als boost voor je zelfvertrouwen.",
      cost: "Een boudoirshoot kost gemiddeld tussen €200 en €600, inclusief makeup-artist en een selectie bewerkte foto's. Uitgebreide pakketten met album zijn duurder.",
      tips: "Kies een fotograaf waarbij je je veilig en op je gemak voelt — lees reviews. Vraag of er een makeup-artist aanwezig is. De locatie (studio of hotel) maakt veel uit voor de sfeer.",
    },
    "bruiloft": {
      what: "Een bruiloftsfotograaf legt alle emoties en bijzondere momenten van jouw trouwdag vast. Van de voorbereiding tot het feest — authentiek, tijdloos en vol liefde.",
      when: "Boek je bruiloftsfotograaf zo vroeg mogelijk — goede fotografen zijn soms al meer dan een jaar van tevoren volgeboekt.",
      cost: "Bruiloftsfotografie kost doorgaans tussen €1.500 en €2.800, afhankelijk van het pakket en de duur van de dag.",
      tips: "Vraag altijd naar een back-up plan bij ziekte. Bekijk volledige bruiloftsreportages (niet alleen de beste foto's) om een goed beeld te krijgen.",
    },
    "zwangerschap": {
      what: "Een zwangerschapsfotograaf legt de bijzondere periode van de zwangerschap vast in professionele beelden. Van de groeiende buik tot de intieme momenten tussen partners.",
      when: "De beste tijd voor een zwangerschapsshoot is tussen week 28 en 34. Dan is de buik mooi rond maar ben je nog comfortabel genoeg voor een shoot.",
      cost: "Een zwangerschapsshoot kost gemiddeld tussen €150 en €400, afhankelijk van de duur en het pakket. Veel fotografen bieden ook combi-pakketten aan met newborn fotografie.",
      tips: "Let op het portfolio van de fotograaf: past de stijl bij jou? Bespreek van tevoren welke outfits en locaties je in gedachten hebt.",
    },
    "feest": {
      what: "Een feestfotograaf legt de sfeer en de beste momenten van jouw feest vast. Van verjaardagsfeesten en jubilea tot kinderfeestjes en buurtborrels — professionele feestfoto's zijn een blijvende herinnering.",
      when: "Bij elke viering waarbij je de sfeer en de mensen wilt vastleggen: verjaardagen (18e, 25e, 50e), jubilea, pensioen, geslaagd, babyshower of huwelijksfeest.",
      cost: "Feestfotografie kost doorgaans tussen €150 en €350 per avond/sessie, afhankelijk van de duur en de gewenste oplevering.",
      tips: "Bespreek de must-have shots van tevoren (groepsfoto's, taartmoment, etc.). Geef aan of er een fotoshoothoek ingericht moet worden voor portretjes.",
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
          De beste {cat.plural}<br />in Nederland
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mb-8">
          Vind de perfecte {cat.singular} voor jouw moment. Bekijk portfolio&apos;s en neem direct contact op.
        </p>

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
            <p className="text-sm text-gray-400 mt-1">{cat.plural} worden binnenkort toegevoegd.</p>
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
