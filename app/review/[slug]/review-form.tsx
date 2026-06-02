"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  photographerId: string;
  photographerName: string;
}

export default function ReviewForm({ photographerId, photographerName }: Props) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError("Kies een beoordeling (1-5 sterren)"); return; }
    if (!name.trim()) { setError("Vul je naam in"); return; }

    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: dbError } = await supabase.from("reviews").insert({
      photographer_id: photographerId,
      reviewer_name: name.trim(),
      rating,
      review_text: text.trim() || null,
      review_date: new Date().toISOString().split("T")[0],
      source: "via uitnodiging",
      is_published: true,
    });

    if (dbError) {
      setError("Er ging iets mis. Probeer opnieuw.");
    } else {
      setDone(true);
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div className="bg-white rounded-3xl border border-[#E9E7F0] p-8 text-center">
        <div className="text-5xl mb-4">🙏</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Bedankt voor je review!</h2>
        <p className="text-sm text-gray-500">
          Je beoordeling van {photographerName} is opgeslagen en zichtbaar op het profiel.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#E9E7F0] p-8 space-y-5">
      {/* Sterren */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Jouw beoordeling *</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="focus:outline-none"
            >
              <svg
                className={`w-10 h-10 transition-colors ${
                  star <= (hovered || rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-200 fill-gray-200"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-sm text-gray-400 mt-1">
            {["", "Slecht", "Matig", "Goed", "Zeer goed", "Uitstekend"][rating]}
          </p>
        )}
      </div>

      {/* Naam */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jouw naam *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jan de Vries"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]"
        />
      </div>

      {/* Review tekst */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Jouw review <span className="text-gray-400 font-normal">(optioneel)</span>
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Vertel hoe je de samenwerking met ${photographerName} hebt ervaren...`}
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF] resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 text-white py-3 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Versturen..." : "Review versturen →"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Je review wordt direct zichtbaar op het profiel van {photographerName}.
      </p>
    </form>
  );
}
