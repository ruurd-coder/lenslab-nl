"use client";

import { useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";

function ContactModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/support-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Versturen mislukt");
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Er ging iets mis, probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
        {!sent ? (
          <>
            <div className="px-7 pt-7 pb-5 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900">Contact opnemen</h2>
                <p className="text-sm text-gray-400 mt-1">We reageren zo snel mogelijk.</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#E9E7F0] flex items-center justify-center hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-7 pb-7 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Naam *</label>
                <input
                  type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jouw naam"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">E-mailadres *</label>
                <input
                  type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jouw@email.nl"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bericht *</label>
                <textarea
                  required value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Hoe kunnen we je helpen?"
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF] resize-none"
                />
              </div>
              {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
              <button
                type="submit" disabled={loading}
                className="w-full bg-gray-900 text-white py-3 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Versturen..." : "Verstuur bericht →"}
              </button>
            </form>
          </>
        ) : (
          <div className="px-7 py-12 text-center">
            <div className="text-5xl mb-4">✉️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Bericht verstuurd!</h2>
            <p className="text-sm text-gray-500 mb-6">We nemen zo snel mogelijk contact met je op.</p>
            <button onClick={onClose} className="bg-gray-900 text-white text-sm px-6 py-2.5 rounded-full hover:bg-gray-700 transition-colors">
              Sluiten
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HelpSupportPage() {
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />

      <div className="max-w-3xl mx-auto px-5 md:px-8 py-14">

        {/* Hero */}
        <div className="mb-14">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-5">Help & Support</p>
          <h1
            className="text-4xl sm:text-5xl font-black leading-tight text-gray-900 mb-6"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Hoi, welkom bij onze<br className="hidden sm:block" /> help & support
          </h1>
          <p className="text-gray-500 leading-relaxed mb-8 max-w-xl">
            Heb je een vraag over je profiel, een samenwerking of het gebruik van LensLab? Veel antwoorden vind je in onze FAQ. Staat je vraag er niet tussen? Dan staan we klaar om je verder te helpen via de mail.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-gray-700 transition-colors"
            >
              FAQ
            </Link>
            <button
              onClick={() => setShowContact(true)}
              className="inline-flex items-center gap-2 border border-gray-900 text-gray-900 text-sm font-semibold px-6 py-3 rounded-full hover:bg-gray-50 transition-colors"
            >
              Contact ons
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E9E7F0] mb-14" />

        {/* Contact + adres */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div>
            <h2 className="text-lg font-black text-gray-900 mb-3">
              Heb je een vraag of wil je samenwerken?
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              We horen graag van je.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Onze adresgegevens</p>
            <address className="not-italic text-sm text-gray-700 leading-relaxed space-y-1">
              <p className="font-semibold text-gray-900">LensLab</p>
              <p>Lange Kleiweg 62</p>
              <p>2288 GK, Rijswijk</p>
              <p>Nederland</p>
            </address>
          </div>
        </div>
      </div>

      <SiteFooter />

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </div>
  );
}
