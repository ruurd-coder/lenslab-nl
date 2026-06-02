"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  photographerId: string;
  photographerName: string;
  onClose: () => void;
}

export default function ContactModal({ photographerId, photographerName, onClose }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  // Sluit bij Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photographerId,
          senderName: form.name,
          senderEmail: form.email,
          senderPhone: form.phone,
          message: form.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Versturen mislukt");
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Versturen mislukt, probeer opnieuw");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden"
      >
        {!sent ? (
          <>
            {/* Header */}
            <div className="px-6 pt-6 pb-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900">Stuur een bericht</h2>
                <p className="text-sm text-gray-400 mt-1">aan {photographerName}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#E9E7F0] flex items-center justify-center hover:bg-gray-200 transition-colors shrink-0"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Naam *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jouw naam"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">E-mailadres *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jouw@email.nl"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Telefoonnummer</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="06-12345678 (optioneel)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bericht *</label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder={`Hallo, ik ben geïnteresseerd in jullie diensten...`}
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF] resize-none"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-3 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Versturen..." : "Verstuur bericht →"}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Je e-mailadres wordt alleen gebruikt om dit bericht te beantwoorden.
              </p>
            </form>
          </>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="text-5xl mb-4">✉️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Bericht verstuurd!</h2>
            <p className="text-sm text-gray-500 mb-6">
              {photographerName} ontvangt jouw bericht en neemt zo snel mogelijk contact op.
            </p>
            <button
              onClick={onClose}
              className="bg-gray-900 text-white text-sm px-6 py-2.5 rounded-full hover:bg-gray-700 transition-colors"
            >
              Sluiten
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
