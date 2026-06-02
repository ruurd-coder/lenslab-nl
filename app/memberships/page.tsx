import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Memberships — LensLab",
  description: "Kies het membership dat bij jou past als fotograaf of videograaf op LensLab.",
};

const TIERS = [
  {
    name: "Free",
    price: "Gratis",
    period: "",
    description: "Starten op het platform en zichtbaar worden.",
    color: "bg-white",
    highlight: false,
    cta: "Gratis aanmelden",
    ctaLink: "/login",
    features: [
      { label: "Zichtbaar op listing pagina's", value: "✓" },
      { label: "Landingspagina's (provincie)", value: "1 locatie" },
      { label: "Actieve categorieën", value: "1" },
      { label: "Foto's per portfolio", value: "10 foto's" },
      { label: "Link naar website", value: "—" },
      { label: "Link naar socials", value: "—" },
      { label: "Mail direct", value: "✓" },
      { label: "Review-tool", value: "✓" },
      { label: "Andere beeldmakers op profiel", value: "Ja" },
      { label: "Uitgelicht op home / categorie", value: "—" },
    ],
  },
  {
    name: "Plus",
    price: "€7",
    period: "/maand",
    description: "Meer zichtbaarheid en een completer profiel.",
    color: "bg-[#FCFAFF]",
    highlight: true,
    cta: "Start met Plus",
    ctaLink: "mailto:hello@lenslab.nl?subject=Plus membership",
    features: [
      { label: "Zichtbaar op listing pagina's", value: "Boven Free" },
      { label: "Landingspagina's (provincie)", value: "3 locaties" },
      { label: "Actieve categorieën", value: "4" },
      { label: "Foto's per portfolio", value: "10 foto's" },
      { label: "Link naar website", value: "✓" },
      { label: "Link naar socials", value: "✓" },
      { label: "Mail direct", value: "✓" },
      { label: "Review-tool", value: "✓" },
      { label: "Andere beeldmakers op profiel", value: "Nee" },
      { label: "Uitgelicht op home / categorie", value: "—" },
    ],
  },
  {
    name: "Premium",
    price: "€14",
    period: "/maand",
    description: "Maximum zichtbaarheid en uitgelicht op het platform.",
    color: "bg-gray-900",
    highlight: false,
    dark: true,
    cta: "Start met Premium",
    ctaLink: "mailto:hello@lenslab.nl?subject=Premium membership",
    features: [
      { label: "Zichtbaar op listing pagina's", value: "Boven Plus" },
      { label: "Landingspagina's (provincie)", value: "Onbeperkt" },
      { label: "Actieve categorieën", value: "8" },
      { label: "Foto's per portfolio", value: "10 foto's" },
      { label: "Link naar website", value: "✓" },
      { label: "Link naar socials", value: "✓" },
      { label: "Mail direct", value: "✓" },
      { label: "Review-tool", value: "✓" },
      { label: "Andere beeldmakers op profiel", value: "Nee" },
      { label: "Uitgelicht op home / categorie", value: "✓" },
    ],
  },
];

export default function MembershipsPage() {
  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Beeldmakers</p>
        <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tight mb-4">
          Kies jouw membership
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Zet jezelf op de kaart als fotograaf of videograaf. Begin gratis en upgrade wanneer je meer wilt.
        </p>
        <p className="text-sm text-gray-400 mt-2">Betaling per jaar · Opzegbaar per maand</p>
      </section>

      {/* Pricing cards */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl border overflow-hidden relative ${
                tier.dark
                  ? "bg-gray-900 border-gray-800"
                  : tier.highlight
                  ? "bg-[#FCFAFF] border-[#E9E7F0] ring-2 ring-gray-900"
                  : "bg-white border-[#E9E7F0]"
              }`}
            >
              {tier.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Meest gekozen
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Tier header */}
                <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${tier.dark ? "text-gray-400" : "text-gray-400"}`}>
                  {tier.name}
                </p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-4xl font-black ${tier.dark ? "text-white" : "text-gray-900"}`}>
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className={`text-sm ${tier.dark ? "text-gray-400" : "text-gray-400"}`}>
                      {tier.period}
                    </span>
                  )}
                </div>
                <p className={`text-sm mb-6 ${tier.dark ? "text-gray-400" : "text-gray-500"}`}>
                  {tier.description}
                </p>

                <Link
                  href={tier.ctaLink}
                  className={`block w-full text-center py-3 rounded-full text-sm font-medium transition-colors mb-8 ${
                    tier.dark
                      ? "bg-white text-gray-900 hover:bg-gray-100"
                      : tier.highlight
                      ? "bg-gray-900 text-white hover:bg-gray-700"
                      : "border border-gray-200 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {tier.cta}
                </Link>

                {/* Features */}
                <div className="space-y-3">
                  {tier.features.map((f) => (
                    <div key={f.label} className={`flex items-center justify-between text-sm border-b pb-3 ${
                      tier.dark ? "border-gray-800" : "border-[#E9E7F0]"
                    }`}>
                      <span className={tier.dark ? "text-gray-400" : "text-gray-500"}>{f.label}</span>
                      <span className={`font-semibold ${
                        f.value === "—"
                          ? tier.dark ? "text-gray-600" : "text-gray-300"
                          : f.value === "✓"
                          ? "text-green-500"
                          : tier.dark ? "text-white" : "text-gray-900"
                      }`}>
                        {f.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Veelgestelde vragen</h2>
          <div className="space-y-4">
            {[
              { q: "Kan ik op elk moment opzeggen?", a: "Ja, je kunt maandelijks opzeggen. De betaling vindt jaarlijks plaats maar je kunt tussentijds stoppen." },
              { q: "Hoe upgrade ik mijn membership?", a: "Stuur een mail naar hello@lenslab.nl en we regelen de upgrade voor je." },
              { q: "Wat is het verschil tussen locaties?", a: "Met meer locaties ben je zichtbaar op meer stad- en provinciepagina's. Free = 1 provincie, Plus = 3, Premium = alle provincies." },
              { q: "Kan ik eerst gratis proberen?", a: "Ja! Begin gratis en upgrade wanneer je meer zichtbaarheid wilt. Er is geen tijdslimiet op het gratis account." },
            ].map((faq, i) => (
              <div key={i} className="bg-[#E9E7F0] rounded-2xl p-5">
                <p className="font-semibold text-gray-900 mb-2">{faq.q}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
