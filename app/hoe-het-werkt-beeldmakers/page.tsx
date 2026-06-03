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

export default function HoeHetWerktBeeldmakersPage() {
  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-5 md:px-8 pt-14 pb-10 text-center">
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-5">
          Zo werkt LensLab voor beeldmakers
        </p>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.08] tracking-tight text-gray-900 mb-10"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Gevonden worden door de<br className="hidden sm:block" /> opdrachtgevers die bij jou passen.
        </h1>

        {/* Hero image */}
        <div className="relative w-full aspect-[16/7] rounded-3xl overflow-hidden">
          <Image
            src="/showcase/grid-1-2.webp"
            alt="Fotograaf aan het werk"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* 3 stappen */}
      <section className="max-w-5xl mx-auto px-5 md:px-8 pb-16">
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

      <SiteFooter />
    </div>
  );
}
