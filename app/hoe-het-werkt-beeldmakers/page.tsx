import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Zo werkt LensLab voor beeldmakers — LensLab",
  description: "Gevonden worden door de opdrachtgevers die bij jou passen. Maak een gratis profiel aan en ontvang directe aanvragen.",
};

const STEPS = [
  {
    number: "STAP 1",
    title: "Maak jouw profiel aan",
    description:
      "Maak een gratis profiel aan en laat zien wie je bent. Voeg je portfolio, specialisaties, website en socials toe en word direct zichtbaar voor opdrachtgevers door heel Nederland.",
  },
  {
    number: "STAP 2",
    title: "Zorg dat je gevonden wordt",
    description:
      "Opdrachtgevers zoeken via onze filters. Met een sterk profiel vergroot je jouw kans om gevonden te worden door de opdrachten die écht bij jou passen.",
  },
  {
    number: "STAP 3",
    title: "Ontvang opdrachten",
    description:
      "Opdrachtgevers nemen direct contact met je op via het contactformulier, jouw website of socials. Geen tussenpersoon, geen gedoe — gewoon direct schakelen en aan de slag.",
  },
];

const BENEFITS = [
  {
    icon: (
      <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Meer zichtbaarheid",
    description:
      "Presenteer jezelf aan honderden opdrachtgevers die actief op zoek zijn naar jouw specialisme. Overzichtelijk, gefilterd en altijd op de juiste plek.",
  },
  {
    icon: (
      <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Direct in contact",
    description:
      "Opdrachtgevers nemen rechtstreeks contact met je op via jouw profiel. Geen tussenpersoon, geen omwegen — gewoon direct schakelen.",
  },
  {
    icon: (
      <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    title: "Start gratis",
    description:
      "Maak gratis een profiel aan en word direct zichtbaar op LensLab. Met een abonnement vergroot je jouw bereik en trek je meer opdrachtgevers aan.",
  },
];

const CHECKLIST = [
  "Jouw profiel bereikt dagelijks nieuwe opdrachtgevers",
  "Presenteer je portfolio, website en socials op één plek",
  "Word gevonden op categorie, specialisme en locatie",
];

export default function HoeHetWerktBeeldmakersPage() {
  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />

      {/* ── Hero ── */}
      <section className="max-w-4xl mx-auto px-5 md:px-8 pt-14 pb-10 text-center">
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-5">
          Zo werkt LensLab voor beeldmakers
        </p>
        <h1
          className="text-4xl sm:text-5xl md:text-[3.6rem] font-black leading-[1.08] tracking-tight text-gray-900 mb-10"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Gevonden worden door de<br className="hidden sm:block" /> opdrachtgevers die bij jou passen.
        </h1>

        <div className="relative w-full aspect-[16/7] rounded-3xl overflow-hidden">
          <Image
            src="/hero-beeldmakers.png"
            alt="Fotograaf aan het werk"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </section>

      {/* ── 3 stappen ── */}
      <section className="max-w-5xl mx-auto px-5 md:px-8 pb-20">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
          3 eenvoudige stappen naar jouw volgende opdracht
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Zet jouw werk in de spotlight en word gevonden door opdrachtgevers die bij jou passen. Zo ga je van start:
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
            href="/aanmelden"
            className="inline-block bg-gray-900 text-white text-sm font-semibold px-8 py-4 rounded-full hover:bg-gray-700 transition-colors"
          >
            Meld je aan
          </Link>
        </div>
      </section>

      {/* ── Waarom LensLab ── */}
      <section className="max-w-5xl mx-auto px-5 md:px-8 py-16 border-t border-[#E9E7F0]">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
          Waarom beeldmakers kiezen voor LensLab
        </h2>
        <p className="text-gray-500 text-sm mb-12">
          Word gevonden door de opdrachtgevers die écht bij jou passen.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {BENEFITS.map((b) => (
            <div key={b.title}>
              <div className="w-16 h-16 rounded-2xl bg-[#F0EDF5] flex items-center justify-center mb-5">
                {b.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">{b.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Kwaliteit checklist ── */}
      <section className="max-w-5xl mx-auto px-5 md:px-8 py-16 border-t border-[#E9E7F0]">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
            Wij staan voor kwaliteit
          </p>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-tight"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Jouw profiel in de<br />beste handen
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          {CHECKLIST.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-5 border-b border-[#E9E7F0] last:border-b-0"
            >
              <span className="text-gray-700 text-sm sm:text-base">{item}</span>
              <svg className="w-5 h-5 text-green-500 shrink-0 ml-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sluit-CTA ── */}
      <section className="max-w-5xl mx-auto px-5 md:px-8 py-16 text-center border-t border-[#E9E7F0]">
        <h2
          className="text-3xl sm:text-4xl font-black text-gray-900 mb-4"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Klaar om te beginnen?
        </h2>
        <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
          Maak gratis een profiel aan en word vandaag nog zichtbaar voor opdrachtgevers door heel Nederland.
        </p>
        <Link
          href="/aanmelden"
          className="inline-block bg-gray-900 text-white text-sm font-semibold px-8 py-4 rounded-full hover:bg-gray-700 transition-colors"
        >
          Meld je aan →
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
