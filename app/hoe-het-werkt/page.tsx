import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Zo werkt LensLab — LensLab",
  description: "Ontdek honderden fotografen en videografen op één plek. Vind de perfecte beeldmaker voor jouw opdracht.",
};

const STEPS = [
  {
    number: "STAP 1",
    title: "Zoek de perfecte beeldmaker",
    description:
      "Gebruik onze filters om te zoeken op categorie, locatie en specialisme. Of je nu een productfotograaf of bruiloftsvideograaf zoekt. Je vindt precies wie je nodig hebt.",
  },
  {
    number: "STAP 2",
    title: "Bekijk profielen & portfolio's",
    description:
      "Elke beeldmaker heeft een eigen profielpagina met portfolio, specialisaties, website en socials. Zo zie je in één oogopslag of iemand bij jouw opdracht en stijl past.",
  },
  {
    number: "STAP 3",
    title: "Neem direct contact op",
    description:
      "Enthousiast? Stuur een bericht via het contactformulier op het profiel of bezoek de website of social media van de beeldmaker. Geen tussenpersoon, gewoon direct schakelen.",
  },
];

const BENEFITS = [
  {
    title: "Alles op één plek",
    description:
      "Geen eindeloos googelen meer. Op LensLab vind je talloze gecureerde beeldmakers. Overzichtelijk, snel en op jouw criteria gefilterd.",
    icon: (
      <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
  },
  {
    title: "Snel schakelen",
    description:
      "Bekijk portfolio's, socials en contactgegevens direct op één profielpagina. Van zoeken naar contact opnemen in enkele minuten.",
    icon: (
      <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
  },
  {
    title: "Gratis te gebruiken",
    description:
      "Als opdrachtgever gebruik je LensLab volledig gratis. Geen abonnement, geen verborgen kosten. Gewoon direct aan de slag.",
    icon: (
      <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>
    ),
  },
];

const GUARANTEES = [
  "Elk profiel is handmatig beoordeeld",
  "Alleen beeldmakers met een sterk portfolio",
  "Transparant | portfolio, socials en website altijd zichtbaar",
  "Gratis te gebruiken voor opdrachtgevers",
];

export default function HoeHetWerktPage() {
  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-5 md:px-8 pt-14 pb-10 text-center">
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-5">
          Zo werkt LensLab
        </p>
        <h1
          className="text-4xl sm:text-[2.75rem] md:text-5xl font-black leading-[1.08] tracking-tight text-gray-900 mb-10"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Ontdek honderden fotografen<br />en videografen op één plek.
        </h1>

        <div className="relative w-full aspect-[16/7] rounded-3xl overflow-hidden">
          <Image
            src="/hoe-het-werkt.png"
            alt="Fotograaf aan het werk"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* 3 stappen */}
      <section className="max-w-5xl mx-auto px-5 md:px-8 pb-20">
        <h2
          className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 text-center"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          3 eenvoudige stappen naar jouw perfecte beeldmaker
        </h2>
        <p className="text-gray-500 text-sm mb-8 text-center">
          Vind de fotograaf of videograaf die bij jouw opdracht past. Zo ga je van start:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {STEPS.map((step) => (
            <div key={step.number} className="bg-white border border-[#E9E7F0] rounded-2xl p-7">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                {step.number}
              </p>
              <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/beeldmakers"
            className="inline-block bg-gray-900 text-white text-sm font-semibold px-8 py-4 rounded-full hover:bg-gray-700 transition-colors"
          >
            Ga opzoek
          </Link>
        </div>
      </section>

      {/* Waarom opdrachtgevers kiezen voor LensLab */}
      <section className="max-w-5xl mx-auto px-5 md:px-8 py-16 border-t border-[#E9E7F0]">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 text-center">
          Waarom opdrachtgevers kiezen voor LensLab
        </h2>
        <p className="text-gray-500 text-sm mb-12 text-center">
          Vind de fotograaf of videograaf die bij jouw opdracht past. Zo ga je van start:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#F0EDF5] flex items-center justify-center mb-5">
                {b.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">{b.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Alleen gecureerde beeldmakers */}
      <section className="max-w-3xl mx-auto px-5 md:px-8 py-20 text-center">
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-5">
          Als opdrachtgever zit je altijd goed
        </p>
        <h2
          className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.08] tracking-tight text-gray-900 mb-14"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Alleen gecureerde<br /> beeldmakers op ons platform
        </h2>

        <div className="max-w-2xl mx-auto">
          {GUARANTEES.map((item, i) => (
            <div key={i} className={`flex items-center justify-between py-5 ${i < GUARANTEES.length - 1 ? "border-b border-[#E9E7F0]" : ""}`}>
              <span className="text-sm text-gray-700 text-left">{item}</span>
              <svg className="w-5 h-5 text-green-500 shrink-0 ml-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
