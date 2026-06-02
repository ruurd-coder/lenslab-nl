import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Memberships — LensLab",
  description: "Kies het membership dat bij jou past als fotograaf of videograaf op LensLab.",
};

type Feature = { label: string; value?: string; included: boolean };

const FREE_FEATURES: Feature[] = [
  { label: "Zichtbaar op listing pagina's", included: true },
  { label: "Zichtbaar op de landingspagina's van 1 provincie", included: true },
  { label: "Zichtbaar op", value: "1 categorie", included: true },
  { label: "Ontvang emails direct vanuit potentiële opdrachtgevers", included: true },
  { label: "Creëer meer vertrouwen met een Review-tool", included: true },
  { label: "Link naar website", included: false },
  { label: "Link naar socials", included: false },
];

const PLUS_FEATURES: Feature[] = [
  { label: "Zichtbaar boven Free op listing pagina's", included: true },
  { label: "Zichtbaar op de landingspagina's van 3 provincies", included: true },
  { label: "Zichtbaar op", value: "4 categorieën", included: true },
  { label: "Ontvang emails direct vanuit potentiële opdrachtgevers", included: true },
  { label: "Creëer meer vertrouwen met een Review-tool", included: true },
  { label: "Link naar website", included: true },
  { label: "Link naar socials", included: true },
  { label: "Andere beeldmakers niet zichtbaar op jouw profiel", included: true },
];

const PREMIUM_FEATURES: Feature[] = [
  { label: "Zichtbaar boven Plus op listing pagina's", included: true },
  { label: "Zichtbaar op de landingspagina's van onbeperkt aantal provincies", included: true },
  { label: "Zichtbaar op", value: "8 categorieën", included: true },
  { label: "Ontvang emails direct vanuit potentiële opdrachtgevers", included: true },
  { label: "Creëer meer vertrouwen met een Review-tool", included: true },
  { label: "Link naar website", included: true },
  { label: "Link naar socials", included: true },
  { label: "Andere beeldmakers niet zichtbaar op jouw profiel", included: true },
  { label: "Uitgelicht op home / categorie pagina's", included: true },
];

const TIERS = [
  { name: "Free",    price: "Gratis", period: "",        description: "Starten op het platform en direct zichtbaar worden.",                         featured: false, cta: "Gratis aanmelden",   ctaLink: "/login",                                             billing: "Geen creditcard nodig.",       features: FREE_FEATURES    },
  { name: "Plus",    price: "€7",     period: "/maand",  description: "Meer zichtbaarheid en een completer profiel voor groeiende fotografen.",       featured: true,  cta: "Start met Plus",     ctaLink: "mailto:hello@lenslab.nl?subject=Plus membership",    billing: "Jaarlijks gefactureerd.",      features: PLUS_FEATURES    },
  { name: "Premium", price: "€14",    period: "/maand",  description: "Maximum zichtbaarheid en uitgelicht op het hele platform.",                    featured: false, cta: "Start met Premium",  ctaLink: "mailto:hello@lenslab.nl?subject=Premium membership", billing: "Jaarlijks gefactureerd.",      features: PREMIUM_FEATURES },
];

function CheckIcon() {
  return (
    <svg className="flex-shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 12 2 2 4-4" /><circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg className="flex-shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
    </svg>
  );
}

export default function MembershipsPage() {
  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 pt-16 pb-12 text-center">
        <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "rgba(3,0,5,0.4)" }}>
          Beeldmakers
        </p>
        <h1 className="text-5xl font-black leading-tight tracking-tight mb-4" style={{ color: "#030005" }}>
          Kies jouw membership
        </h1>
        <p className="text-lg mb-2" style={{ color: "rgba(3,0,5,0.6)" }}>
          Zet jezelf op de kaart als fotograaf of videograaf. Begin gratis en upgrade wanneer je meer wilt.
        </p>
        <p className="text-sm" style={{ color: "rgba(3,0,5,0.4)" }}>
          Betaling per jaar · Opzegbaar per maand
        </p>
      </section>

      {/* Pricing cards */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col rounded-3xl p-6 md:p-7"
              style={{
                backgroundColor: "#FFFFFF",
                border: tier.featured ? "2px solid #030005" : "1px solid rgba(3,0,5,0.10)",
              }}
            >
              {/* Naam + badge */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[20px] font-bold" style={{ color: "#030005" }}>{tier.name}</span>
                {tier.featured && (
                  <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                    style={{ backgroundColor: "#030005" }}>
                    Meest gekozen
                  </span>
                )}
              </div>

              {/* Beschrijving */}
              <p className="text-[14px] leading-snug mb-5 min-h-[40px]" style={{ color: "rgba(3,0,5,0.6)" }}>
                {tier.description}
              </p>

              {/* Prijs */}
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-[34px] font-bold" style={{ color: "#030005" }}>{tier.price}</span>
                {tier.period && <span className="text-[14px]" style={{ color: "rgba(3,0,5,0.5)" }}>{tier.period}</span>}
              </div>

              {/* Facturering */}
              <p className="text-[13.5px] leading-snug mt-2 mb-5 min-h-[40px]" style={{ color: "rgba(3,0,5,0.6)" }}>
                {tier.billing}
              </p>

              {/* CTA */}
              <Link
                href={tier.ctaLink}
                className="rounded-xl py-3 text-center text-[15px] font-semibold transition-opacity hover:opacity-90"
                style={tier.featured
                  ? { backgroundColor: "#FFFFFF", color: "#030005", border: "1px solid rgba(3,0,5,0.15)" }
                  : { backgroundColor: "#030005", color: "#FCFAFF" }
                }
              >
                {tier.cta}
              </Link>

              {/* Features */}
              <ul className="flex flex-col gap-3 mt-6">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    {f.included ? <CheckIcon /> : <CrossIcon />}
                    <span className="text-[14px] leading-snug" style={{ color: "#030005" }}>
                      {f.label}
                      {f.value && <strong className="ml-1">{f.value}</strong>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-8" style={{ color: "#030005" }}>
            Veelgestelde vragen
          </h2>
          <div className="space-y-4">
            {[
              { q: "Kan ik op elk moment opzeggen?", a: "Ja, je kunt maandelijks opzeggen. De betaling vindt jaarlijks plaats maar je kunt tussentijds stoppen." },
              { q: "Hoe upgrade ik mijn membership?", a: "Stuur een mail naar hello@lenslab.nl en we regelen de upgrade voor je." },
              { q: "Wat is het verschil tussen locaties?", a: "Met meer locaties ben je zichtbaar op meer stad- en provinciepagina's. Free = 1 provincie, Plus = 3, Premium = alle provincies." },
              { q: "Kan ik eerst gratis proberen?", a: "Ja! Begin gratis en upgrade wanneer je meer zichtbaarheid wilt. Er is geen tijdslimiet op het gratis account." },
            ].map((faq, i) => (
              <div key={i} className="rounded-2xl p-5" style={{ backgroundColor: "#E9E7F0" }}>
                <p className="font-semibold mb-2" style={{ color: "#030005" }}>{faq.q}</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(3,0,5,0.6)" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
