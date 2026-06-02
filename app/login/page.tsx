"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import TrustpilotBar from "@/components/trustpilot-bar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError("Er ging iets mis. Controleer je e-mailadres en probeer opnieuw.");
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      {/* Nav */}
      <div className="bg-[#FCFAFF] border-b border-[#E9E7F0]">
        <nav className="px-6 py-3.5 flex items-center justify-between max-w-5xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7">
              <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <path d="M16 2 L30 26 L2 26 Z" fill="#111" />
                <path d="M16 2 L30 26" stroke="#E55A2B" strokeWidth="3" />
              </svg>
            </div>
            <span className="font-bold text-base tracking-tight text-gray-900 uppercase">Lenslab</span>
          </Link>
          <Link href="/beeldmakers" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Bekijk beeldmakers
          </Link>
        </nav>
      </div>
      <TrustpilotBar />

      {/* Login form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl border border-[#E9E7F0] shadow-sm p-8">
            {!sent ? (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-black text-gray-900 mb-2">
                    Inloggen als beeldmaker
                  </h1>
                  <p className="text-sm text-gray-500">
                    Vul je e-mailadres in. Je ontvangt een inloglink — geen wachtwoord nodig.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      E-mailadres
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jouw@email.nl"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full bg-gray-900 text-white py-3 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Versturen..." : "Stuur inloglink →"}
                  </button>
                </form>

                <p className="text-xs text-gray-400 text-center mt-6">
                  Nog geen profiel?{" "}
                  <a href="mailto:info@lenslab.nl" className="underline hover:text-gray-700">
                    Neem contact op
                  </a>
                </p>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="text-4xl mb-4">📬</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Check je inbox!
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  We hebben een inloglink gestuurd naar <strong>{email}</strong>.
                  Klik op de link in de e-mail om in te loggen.
                </p>
                <button
                  onClick={() => { setSent(false); setEmail(""); }}
                  className="text-sm text-gray-400 hover:text-gray-700 underline transition-colors"
                >
                  Ander e-mailadres gebruiken
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
