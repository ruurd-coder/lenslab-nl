import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Memberships — LensLab",
  description: "Kies het membership dat bij jou past als fotograaf of videograaf op LensLab.",
};

// Elke feature heeft een waarde per tier (null = niet tonen, false = ❌, true = ✅, string = tekst)
const FEATURES: { label: string; free: boolean | string | null; plus: boolean | string | null; premium: boolean | string | null }[] = [
  {
    label: "Zichtbaar op listing pagina's",
    free:    "Op listing pagina's",
    plus:    "Boven Free op listing pagina's",
    premium: "Boven Plus op listing pagina's",
  },
  {
    label: "Landingspagina's",
    free:    "Landingspagina's van 1 provincie",
    plus:    "Landingspagina's van 3 provincies",
    premium: "Onbeperkt landingspagina's",
  },
  {
    label: "Actieve categorieën",
    free:    "1 categorie",
    plus:    "4 categorieën",
    premium: "8 categorieën",
  },
  {
    label: "Ontvang emails direct vanuit potentiële opdrachtgevers",
    free:    true,
    plus:    true,
    premium: true,
  },
  {
    label: "Creëer meer vertrouwen met een Review-tool",
    free:    true,
    plus:    true,
    premium: true,
  },
  {
    label: "Link naar website",
    free:    false,
    plus:    true,
    premium: true,
  },
  {
    label: "Link naar socials",
    free:    false,
    plus:    true,
    premium: true,
  },
  {
    label: "Andere beeldmakers niet zichtbaar op jouw profiel",
    free:    null,
    plus:    true,
    premium: true,
  },
  {
    label: "Uitgelicht op home / categorie pagina's",
    free:    null,
    plus:    null,
    premium: true,
  },
];

const TIERS = [
  { name: "Free",    price: "Gratis", period: "",       description: "Starten op het platform en direct zichtbaar worden.",                       featured: false, cta: "Gratis aanmelden",  ctaLink: "/login",                                          billing: "Geen creditcard nodig."  },
  { name: "Plus",    price: "€7",     period: "/maand", description: "Meer zichtbaarheid en een completer profiel voor groeiende fotografen.",     featured: true,  cta: "Start met Plus",    ctaLink: "mailto:hello@lenslab.nl?subject=Plus membership", billing: "Jaarlijks gefactureerd." },
  { name: "Premium", price: "€14",    period: "/maand", description: "Maximum zichtbaarheid en uitgelicht op het hele platform.",                  featured: false, cta: "Start met Premium", ctaLink: "mailto:hello@lenslab.nl?subject=Premium membership", billing: "Jaarlijks gefactureerd." },
];

function CheckIcon() {
  return (
    <svg className="flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 12 2 2 4-4" /><circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg className="flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
    </svg>
  );
}

function FeatureCell({ value }: { value: boolean | string | null }) {
  if (value === null) {
    // Lege cel — neemt wel ruimte in
    return <div className="flex items-center gap-2.5 py-3 px-5 min-h-[48px]" />;
  }
  return (
    <div className="flex items-center gap-2.5 py-3 px-5">
      {value === false ? <CrossIcon /> : <CheckIcon />}
      {typeof value === "string" && (
        <span className="text-[14px] leading-snug" style={{ color: "#030005" }}>{value}</span>
      )}
    </div>
  );
}

export default function MembershipsPage() {
  const tierValues: (boolean | string | null)[][] = [
    FEATURES.map((f) => f.free),
    FEATURES.map((f) => f.plus),
    FEATURES.map((f) => f.premium),
  ];

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

      {/* Pricing — één grid, kaartkolommen */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-3 gap-5">

          {/* ── Kaart headers ── */}
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="rounded-t-3xl p-6 md:p-7"
              style={{
                backgroundColor: "#FFFFFF",
                borderTop: tier.featured ? "2px solid #030005" : "1px solid rgba(3,0,5,0.10)",
                borderLeft: tier.featured ? "2px solid #030005" : "1px solid rgba(3,0,5,0.10)",
                borderRight: tier.featured ? "2px solid #030005" : "1px solid rgba(3,0,5,0.10)",
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[20px] font-bold" style={{ color: "#030005" }}>{tier.name}</span>
                {tier.featured && (
                  <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                    style={{ backgroundColor: "#030005" }}>
                    Meest gekozen
                  </span>
                )}
              </div>
              <p className="text-[14px] leading-snug mb-5 min-h-[40px]" style={{ color: "rgba(3,0,5,0.6)" }}>
                {tier.description}
              </p>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-[34px] font-bold" style={{ color: "#030005" }}>{tier.price}</span>
                {tier.period && <span className="text-[14px]" style={{ color: "rgba(3,0,5,0.5)" }}>{tier.period}</span>}
              </div>
              <p className="text-[13.5px] leading-snug mt-2 mb-5 min-h-[40px]" style={{ color: "rgba(3,0,5,0.6)" }}>
                {tier.billing}
              </p>
              <Link
                href={tier.ctaLink}
                className="block w-full rounded-xl py-3 text-center text-[15px] font-semibold transition-opacity hover:opacity-90"
                style={tier.featured
                  ? { backgroundColor: "#FFFFFF", color: "#030005", border: "1px solid rgba(3,0,5,0.15)" }
                  : { backgroundColor: "#030005", color: "#FCFAFF" }
                }
              >
                {tier.cta}
              </Link>
            </div>
          ))}

          {/* ── Feature rijen — elke rij is 3 cellen naast elkaar ── */}
          {FEATURES.map((feature, rowIdx) => {
            const isLast = rowIdx === FEATURES.length - 1;
            return TIERS.map((tier, colIdx) => {
              const value = tierValues[colIdx][rowIdx];
              const featured = tier.featured;
              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={isLast ? "rounded-b-3xl" : ""}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderLeft:   featured ? "2px solid #030005" : "1px solid rgba(3,0,5,0.10)",
                    borderRight:  featured ? "2px solid #030005" : "1px solid rgba(3,0,5,0.10)",
                    borderBottom: isLast ? (featured ? "2px solid #030005" : "1px solid rgba(3,0,5,0.10)") : "none",
                    borderTop: `1px solid rgba(3,0,5,0.06)`,
                  }}
                >
                  <FeatureCell value={value} />
                </div>
              );
            });
          })}

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
